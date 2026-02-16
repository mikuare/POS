class PaymongoProvider {
  constructor() {
    this.providerName = 'paymongo';
  }

  async createGcashCheckout() {
    throw new Error('PayMongo integration not configured in this sample. Use PAYMENT_PROVIDER=mock for test flow.');
  }
}

module.exports = PaymongoProvider;
