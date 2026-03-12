const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

class MockProvider {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  async createEwalletCheckout({ invoice, paymentMethod = 'gcash' }) {
    const method = String(paymentMethod || 'gcash').toLowerCase() === 'paymaya' ? 'paymaya' : 'gcash';
    const prefix = method === 'paymaya' ? 'PM' : 'GC';
    const reference = `${prefix}-${uuidv4()}`;
    const qrText = `${method.toUpperCase()}://PAY?invoice=${invoice.reference}&amount=${invoice.total}&ref=${reference}`;
    const qrDataUrl = await QRCode.toDataURL(qrText);

    return {
      provider: 'mock',
      reference,
      amount: invoice.total,
      currency: 'PHP',
      qrText,
      qrDataUrl,
      merchant: {},
      checkoutUrl: `${this.baseUrl}/checkout/${reference}`,
      status: 'PENDING',
      method
    };
  }

  async createGcashCheckout({ invoice }) {
    return this.createEwalletCheckout({ invoice, paymentMethod: 'gcash' });
  }
}

module.exports = MockProvider;
