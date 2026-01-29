// AWS SQS Queue Service
const {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  GetQueueAttributesCommand,
} = require("@aws-sdk/client-sqs");

// Initialize SQS Client
const sqs = new SQSClient({
  region: process.env.SQS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const QUEUE_URL = process.env.SQS_QUEUE_URL;

async function queueEmailToSQS(type, data) {
  const message = {
    type,
    data,
    timestamp: new Date().toISOString(),
    id: `${Date.now()}-${Math.random()}`,
    retries: 0,
  };

  const params = {
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(message),
    MessageGroupId: `email-${data.userId || "system"}`,
    MessageDeduplicationId: message.id,
  };

  try {
    const result = await sqs.send(new SendMessageCommand(params));
    console.log(`✅ [SQS] Email queued: ${type} → ${data.email}`);
    console.log(`[SQS] Message ID: ${result.MessageId}`);
    return result;
  } catch (error) {
    console.error(
      `❌ [SQS] Failed to queue email to ${data.email}:`,
      error.message,
    );
    throw error;
  }
}

/**
 * Poll SQS queue for pending email jobs
 */
async function receiveEmailsFromSQS(maxMessages = 5) {
  const params = {
    QueueUrl: QUEUE_URL,
    MaxNumberOfMessages: maxMessages,
    WaitTimeSeconds: 10,
    VisibilityTimeout: 60,
  };

  try {
    const result = await sqs.send(new ReceiveMessageCommand(params));

    if (!result.Messages) {
      return [];
    }

    console.log(`✅ [SQS] Received ${result.Messages.length} message(s)`);
    return result.Messages;
  } catch (error) {
    console.error(`❌ [SQS] Failed to receive messages:`, error.message);
    return [];
  }
}

/**
 * Remove a message from SQS queue
 */
async function deleteEmailFromSQS(receiptHandle) {
  const params = {
    QueueUrl: QUEUE_URL,
    ReceiptHandle: receiptHandle,
  };

  try {
    await sqs.send(new DeleteMessageCommand(params));
    console.log(`✅ [SQS] Message deleted from queue`);
  } catch (error) {
    console.error(`❌ [SQS] Failed to delete message:`, error.message);
  }
}

/**
 * Get queue status (optional monitoring)
 */
async function getQueueStatus() {
  try {
    const { Attributes } = await sqs.send(
      new GetQueueAttributesCommand({
        QueueUrl: QUEUE_URL,
        AttributeNames: ["All"],
      }),
    );

    console.log("[SQS] Queue Status:", {
      ApproximateMessages: Attributes.ApproximateNumberOfMessages,
      VisibleMessages: Attributes.ApproximateNumberOfMessagesVisible,
      HiddenMessages: Attributes.ApproximateNumberOfMessagesNotVisible,
    });

    return Attributes;
  } catch (error) {
    console.error("[SQS] Failed to get queue status:", error.message);
  }
}

module.exports = {
  queueEmailToSQS,
  receiveEmailsFromSQS,
  deleteEmailFromSQS,
  getQueueStatus,
};
