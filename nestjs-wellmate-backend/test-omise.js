const omise = require('omise')({
  publicKey: 'pkey_test_66wab5tvrz7sj8n1dmf',
  secretKey: 'skey_test_66wab5ubcvbbqrs6six'
});

async function test() {
  try {
    const charge = await omise.charges.create({
      amount: 41000,
      currency: 'thb',
      source: {
        type: 'promptpay'
      }
    });
    console.log('Success:', charge.id, charge.source?.scannable_code?.image?.download_uri);
  } catch (err) {
    console.error('Error:', err.message || err);
  }
}
test();
