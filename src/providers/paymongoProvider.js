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

  async createGcashCheckout({ invoice }) {
    const localReference = `GC-${uuidv4()}`;
    const amountInCentavos = Math.round(Number(invoice.total) * 100);

    const body = {
      data: {
        attributes: {
          billing: {
            name: 'POS Customer',
            email: 'pos-customer@example.com'
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
          metadata: {
            invoice_id: invoice.id,
            invoice_reference: invoice.reference,
            local_reference: localReference
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
