const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

class MockProvider {
  constructor({ baseUrl, gcashOwnerNumber }) {
    this.baseUrl = baseUrl;
    this.gcashOwnerNumber = gcashOwnerNumber;
  }

  async createGcashCheckout({ invoice }) {
    const reference = `GC-${uuidv4()}`;
    const qrText = `GCASH://PAY?invoice=${invoice.reference}&amount=${invoice.total}&ref=${reference}&to=${this.gcashOwnerNumber}`;
    const qrDataUrl = await QRCode.toDataURL(qrText);

    return {
      provider: 'mock',
      reference,
      amount: invoice.total,
      currency: 'PHP',
      qrText,
      qrDataUrl,
      merchant: {
        gcashNumber: this.gcashOwnerNumber
      },
      checkoutUrl: `${this.baseUrl}/checkout/${reference}`,
      status: 'PENDING'
    };
  }
}

module.exports = MockProvider;
