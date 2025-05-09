const { Payment } = require('../models');

exports.handleWebhook = async (req, res) => {
  const { obj } = req.body;

  if (obj.success === true) {
    try {
      await Payment.update(
        { isVerified: "true" },
        { where: { paymobOrderId: obj.order.id } }
      );
      res.status(200).send('Webhook processed');
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Error updating transaction');
    }
  } else {
    res.status(400).send('Payment failed');
  }
};