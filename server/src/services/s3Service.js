const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");

// Initialize S3 Client with your IAM user credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "jobzy-resumes-prod";
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Upload resume to S3
 * @param {Express.Multer.File} file - Uploaded file from multer
 * @param {string} userId - User ID
 * @returns {Promise<{s3Key: string, fileName: string, fileSize: number, uploadedAt: Date}>}
 */
async function uploadResumeToS3(file, userId) {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error(
        `Invalid file type. Allowed: PDF, DOCX. Got: ${file.mimetype}`
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large. Max size: 5MB. Got: ${file.size} bytes`);
    }

    // Generate unique file key
    const fileId = uuidv4();
    const fileExtension = file.originalname.split(".").pop();
    const s3Key = `resumes/${userId}/${fileId}.${fileExtension}`;

    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        userId: userId,
        uploadedAt: new Date().toISOString(),
        originalName: file.originalname,
      },
      ServerSideEncryption: "AES256", // Encrypt at rest
      StorageClass: "STANDARD",
    };

    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);

    console.log(`✅ Resume uploaded to S3: ${s3Key}`);

    return {
      s3Key: s3Key,
      fileName: file.originalname,
      fileSize: file.size,
      uploadedAt: new Date(),
      eTag: response.ETag,
    };
  } catch (error) {
    console.error("❌ S3 Upload Error:", error.message);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
}

/**
 * Generate signed URL for resume download (valid for 1 hour)
 * @param {string} s3Key - S3 object key
 * @param {number} expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns {Promise<string>}
 */
async function generateSignedDownloadUrl(s3Key, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresIn,
    });

    return signedUrl;
  } catch (error) {
    console.error("❌ Signed URL Generation Error:", error.message);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
}

/**
 * Delete resume from S3
 * @param {string} s3Key - S3 object key
 * @returns {Promise<void>}
 */
async function deleteResumeFromS3(s3Key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    await s3Client.send(command);
    console.log(`✅ Resume deleted from S3: ${s3Key}`);
  } catch (error) {
    console.error("❌ S3 Delete Error:", error.message);
    throw new Error(`S3 deletion failed: ${error.message}`);
  }
}

/**
 * Get object metadata from S3 (without downloading)
 * @param {string} s3Key - S3 object key
 * @returns {Promise<Object>}
 */
async function getResumeMetadata(s3Key) {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    const response = await s3Client.send(command);
    return {
      size: response.ContentLength,
      lastModified: response.LastModified,
      contentType: response.ContentType,
      metadata: response.Metadata,
    };
  } catch (error) {
    console.error("❌ Metadata Fetch Error:", error.message);
    throw new Error(`Failed to get metadata: ${error.message}`);
  }
}

module.exports = {
  uploadResumeToS3,
  generateSignedDownloadUrl,
  deleteResumeFromS3,
  getResumeMetadata,
  s3Client,
  BUCKET_NAME,
};
