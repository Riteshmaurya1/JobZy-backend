// Use this in Node.js or browser console
const crypto = require('crypto');

const order_id = "order_S9qBUKkSpYWdU8"; // from Step 1
const payment_id = "rzp_test_S7VIWgjJb9NWvn"; // generate fake or get from dashboard
const secret = "5OeQvQzQGsGbyL3otTkOAmbb";

const generated_signature = crypto
  .createHmac('sha256', secret)
  .update(`${order_id}|${payment_id}`)
  .digest('hex');

console.log(generated_signature);