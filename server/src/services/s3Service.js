const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const uploadResumeToS3 = async (file, userId) => {
  try {
    console.log(`📤 [S3] Uploading resume for user: ${userId}`);

    if (!file || !file.buffer) {
      throw new Error("Invalid file object - missing buffer");
    }

    // Generate unique file name
    const fileExtension = file.originalname.split(".").pop();
    const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
    const s3Key = `resumes/user${userId}/${uniqueFileName}`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        userId: String(userId),
        originalName: file.originalname,
      },
    });

    await s3Client.send(command);

    console.log(`✅ [S3] Resume uploaded: ${s3Key}`);

    return {
      fileName: file.originalname,
      s3Key: s3Key,
      fileSize: file.size,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error("❌ [S3] Upload error:", error.message);
    throw new Error(`Failed to upload to S3: ${error.message}`);
  }
};

const generateSignedDownloadUrl = async (s3Key, expiresIn = 3600) => {
  try {
    console.log(`🔗 [S3] Generating download URL for: ${s3Key}`);

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    console.log(`✅ [S3] Download URL generated (expires in ${expiresIn}s)`);

    return signedUrl;
  } catch (error) {
    console.error("❌ [S3] Generate URL error:", error.message);
    throw new Error(`Failed to generate download URL: ${error.message}`);
  }
};

const deleteResumeFromS3 = async (s3Key) => {
  try {
    console.log(`🗑️ [S3] Deleting resume: ${s3Key}`);

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    await s3Client.send(command);

    console.log(`✅ [S3] Resume deleted: ${s3Key}`);
  } catch (error) {
    console.error("❌ [S3] Delete error:", error.message);
    throw new Error(`Failed to delete from S3: ${error.message}`);
  }
};

module.exports = {
  uploadResumeToS3,
  generateSignedDownloadUrl,
  deleteResumeFromS3,
};
