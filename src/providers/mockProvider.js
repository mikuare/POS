const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

class MockProvider {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  async createGcashCheckout({ invoice }) {
    const reference = `GC-${uuidv4()}`;
    const qrText = `GCASH://PAY?invoice=${invoice.reference}&amount=${invoice.total}&ref=${reference}`;
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
      status: 'PENDING'
    };
  }
}

module.exports = MockProvider;
