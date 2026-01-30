const crypto = require('crypto');
const logger = require('../logger/logger');

const verifyRazorpayWebhook = (req, res, next) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Check if webhook secret is configured
    if (!webhookSecret) {
      logger.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Webhook configuration error' 
      });
    }

    // Check if signature header exists
    if (!webhookSignature) {
      logger.warn('Webhook request missing signature header', {
        ip: req.ip,
        headers: req.headers
      });
      return res.status(401).json({ 
        success: false, 
        message: 'Missing webhook signature' 
      });
    }

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    // Compare signatures (timing-safe comparison)
    const isValid = crypto.timingSafeEqual(
      Buffer.from(webhookSignature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      logger.error('Razorpay webhook signature verification failed', {
        ip: req.ip,
        event: req.body?.event
      });
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid webhook signature' 
      });
    }

    // Signature valid - proceed
    logger.info('Razorpay webhook verified', { event: req.body.event });
    next();
    
  } catch (error) {
    logger.error('Webhook verification error', { error: error.message });
    return res.status(500).json({ 
      success: false, 
      message: 'Webhook verification failed' 
    });
  }
};

module.exports = verifyRazorpayWebhook;
