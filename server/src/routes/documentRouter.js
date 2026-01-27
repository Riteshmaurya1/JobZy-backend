const express = require("express");
const documentRouter = express.Router();

const isAuth = require("../middleware/verifyJwt");
const checkFeatureAccess = require("../middleware/checkFeatureAccess");

const {
  uploadResumeForATS,
  getAllDocuments,
  getDocumentDetails,
  getDocumentDownloadUrl,
  updateAtsScore,
  deleteDocument,
  getAtsStatistics,
} = require("../controllers/documentController");

// PRO ONLY: Document Feature Access
documentRouter.use(
  isAuth,
  checkFeatureAccess("DOCUMENT_STORAGE")
);

// Get all documents
documentRouter.get("/documents", getAllDocuments);

// Get ATS statistics
documentRouter.get("/documents/stats/ats", getAtsStatistics);

// Get specific document details
documentRouter.get("/documents/:documentId", getDocumentDetails);

// Get download URL
documentRouter.get(
  "/documents/:documentId/download-url",
  getDocumentDownloadUrl
);

// Update ATS score
documentRouter.put(
  "/documents/:documentId/ats-score",
  updateAtsScore
);

// Delete document
documentRouter.delete(
  "/documents/:documentId",
  deleteDocument
);

module.exports = documentRouter;
