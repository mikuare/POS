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
}

module.exports = PaymongoProvider;
