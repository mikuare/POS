const { v4: uuidv4 } = require('uuid');

class PaymongoProvider {
  constructor({ baseUrl }) {
    this.providerName = 'paymongo';
    this.baseUrl = baseUrl;
    this.secretKey = process.env.PAYMONGO_SECRET_KEY || '';
    this.successUrl = process.env.PAYMONGO_SUCCESS_URL || `${baseUrl}/`;
    this.cancelUrl = process.env.PAYMONGO_CANCEL_URL || `${baseUrl}/`;
    this.apiBaseUrl = process.env.PAYMONGO_API_BASE_URL || 'https://api.paymongo.com/v1';
  }

  getAuthHeader() {
    if (!this.secretKey) {
      throw new Error('PAYMONGO_SECRET_KEY is not configured');
    }
    return `Basic ${Buffer.from(`${this.secretKey}:`).toString('base64')}`;
  }

  /**
   * Convert Philippine phone number to international format.
   * 09171234567 → +639171234567
   * 639171234567 → +639171234567
   * +639171234567 → +639171234567
   */
  formatPhoneNumber(phone) {
    if (!phone) return null;
    let cleaned = String(phone).replace(/[^0-9+]/g, '');
    
    // If starts with 0, replace with +63
    if (cleaned.startsWith('0')) {
      cleaned = '+63' + cleaned.slice(1);
    }
    // If starts with 63 (no +), add +
    else if (cleaned.startsWith('63') && !cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    // If doesn't start with +, assume it needs +63
    else if (!cleaned.startsWith('+')) {
      cleaned = '+63' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Create a PayMongo Customer object so it appears in
   * PayMongo Dashboard > Payment Channels > Customers.
   * Returns the customer ID (cus_xxx) or null if creation fails.
   */
  async createCustomer({ name, email, phone }) {
    // PayMongo requires at least first_name and last_name
    const nameParts = String(name || 'POS Customer').trim().split(/\s+/);
    const firstName = nameParts[0] || 'POS';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Customer';

    // Format phone to international format (+63...)
    const formattedPhone = this.formatPhoneNumber(phone);

    const customerBody = {
      data: {
        attributes: {
          first_name: firstName,
          last_name: lastName,
          email: email || undefined,
          phone: formattedPhone || undefined,
          default_device: 'phone'
        }
      }
    };

    try {
      const response = await fetch(`${this.apiBaseUrl}/customers`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: this.getAuthHeader()
        },
        body: JSON.stringify(customerBody)
      });

      const data = await response.json();

      if (!response.ok) {
        console.warn('[PayMongo] Failed to create customer:', data?.errors?.[0]?.detail || 'Unknown error');
        return null;
      }

      const customerId = data?.data?.id;
      console.log(`[PayMongo] Customer created: ${customerId} (${firstName} ${lastName})`);
      return customerId;
    } catch (err) {
      console.warn('[PayMongo] Customer creation error:', err.message);
      return null;
    }
  }

  async createGcashCheckout({ invoice, customerInfo = {} }) {
    const localReference = `GC-${uuidv4()}`;
    const amountInCentavos = Math.round(Number(invoice.total) * 100);

    // Use provided customer info or defaults
    const billingName = customerInfo.name || 'POS Customer';
    const billingEmail = customerInfo.email || 'pos-customer@example.com';
    const billingPhone = customerInfo.phone || null;

    // Create a PayMongo Customer object so it shows in Dashboard > Customers
    let paymongoCustomerId = null;
    if (customerInfo.name || customerInfo.email || customerInfo.phone) {
      paymongoCustomerId = await this.createCustomer({
        name: billingName,
        email: billingEmail,
        phone: billingPhone
      });
    }

    const body = {
      data: {
        attributes: {
          billing: {
            name: billingName,
            email: billingEmail,
            ...(billingPhone && { phone: billingPhone })
          },
          send_email_receipt: false,
          show_description: true,
          show_line_items: true,
          line_items: invoice.lineItems.map((item) => ({
            name: item.name,
            quantity: item.qty,
            amount: Math.round(Number(item.price) * 100),
            currency: 'PHP'
          })),
          payment_method_types: ['gcash'],
          description: `Invoice ${invoice.reference}`,
          ...(paymongoCustomerId && { customer_id: paymongoCustomerId }),
          metadata: {
            invoice_id: invoice.id,
            invoice_reference: invoice.reference,
            local_reference: localReference,
            ...(paymongoCustomerId && { paymongo_customer_id: paymongoCustomerId })
          },
          success_url: this.successUrl,
          cancel_url: this.cancelUrl
        }
      }
    };

    const response = await fetch(`${this.apiBaseUrl}/checkout_sessions`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: this.getAuthHeader()
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data?.errors?.[0]?.detail || 'Failed to create PayMongo checkout session';
      throw new Error(msg);
    }

    const sessionData = data?.data;
    const checkoutUrl = sessionData?.attributes?.checkout_url;
    if (!checkoutUrl) {
      throw new Error('PayMongo checkout URL is missing');
    }

    return {
      provider: 'paymongo',
      reference: localReference,
      amount: amountInCentavos / 100,
      currency: 'PHP',
      qrText: '',
      qrDataUrl: '',
      merchant: {},
      checkoutUrl,
      status: 'PENDING',
      paymongoCheckoutSessionId: sessionData.id
    };
  }

  /**
   * Check the status of a PayMongo checkout session directly via API.
   * Returns { paid: boolean, sessionStatus, payments, metadata }
   */
  async getCheckoutSessionStatus(checkoutSessionId) {
    const response = await fetch(`${this.apiBaseUrl}/checkout_sessions/${checkoutSessionId}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: this.getAuthHeader()
      }
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data?.errors?.[0]?.detail || 'Failed to fetch PayMongo checkout session';
      throw new Error(msg);
    }

    const session = data?.data;
    const attrs = session?.attributes || {};
    const payments = attrs.payments || [];
    const paymentIntent = attrs.payment_intent;
    const metadata = attrs.metadata || {};

    // Check if payment intent status is "succeeded" or if there are payments
    const isPaid =
      payments.length > 0 ||
      paymentIntent?.attributes?.status === 'succeeded';

    // Extract payment details if available
    let paymentDetails = null;
    let customerInfo = null;

    if (payments.length > 0) {
      const firstPayment = payments[0];
      const payAttrs = firstPayment.attributes || {};
      const billing = payAttrs.billing || {};

      paymentDetails = {
        paymentId: firstPayment.id,
        amount: Number(payAttrs.amount || 0) / 100,
        currency: payAttrs.currency || 'PHP',
        status: payAttrs.status,
        paidAt: payAttrs.paid_at
          ? new Date(payAttrs.paid_at * 1000).toISOString()
          : new Date().toISOString(),
        source: payAttrs.source?.type || 'gcash'
      };

      // Extract customer billing information
      customerInfo = {
        name: billing.name || null,
        email: billing.email || null,
        phone: billing.phone || null
      };
    }

    // Also check checkout session billing if no payment billing available
    if (!customerInfo && attrs.billing) {
      customerInfo = {
        name: attrs.billing.name || null,
        email: attrs.billing.email || null,
        phone: attrs.billing.phone || null
      };
    }

    return {
      checkoutSessionId: session.id,
      sessionStatus: attrs.status,
      paid: isPaid,
      payments,
      paymentDetails,
      customerInfo,
      metadata,
      localReference: metadata.local_reference || null,
      invoiceId: metadata.invoice_id || null
    };
  }
}

module.exports = PaymongoProvider;
