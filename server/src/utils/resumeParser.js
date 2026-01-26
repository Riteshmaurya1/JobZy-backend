const PDFParser = require("pdf2json");
const mammoth = require("mammoth");
const fs = require("fs").promises;

// const parsePDF = (filePath) => {
//   return new Promise((resolve, reject) => {
//     const pdfParser = new PDFParser();

//     // Error handler
//     pdfParser.on("pdfParser_dataError", (errData) => {
//       console.error("[PDF Parser] Error:", errData.parserError);
//       reject(new Error(`PDF parsing failed: ${errData.parserError}`));
//     });

//     // Success handler
//     pdfParser.on("pdfParser_dataReady", (pdfData) => {
//       try {
//         // Extract raw text content
//         const text = pdfParser.getRawTextContent();
//         console.log(`[PDF Parser] ✅ Extracted ${text.length} characters`);
//         resolve(text);
//       } catch (error) {
//         console.error("[PDF Parser] Text extraction error:", error.message);
//         reject(new Error(`Text extraction failed: ${error.message}`));
//       }
//     });

//     // Load PDF file
//     console.log(`[PDF Parser] Loading file: ${filePath}`);
//     pdfParser.loadPDF(filePath);
//   });
// };

const parsePDF = (filePath) => {
  return new Promise((resolve, reject) => {
    // Important: pass (this, 1)
    const pdfParser = new PDFParser(null, 1);

    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error("[PDF Parser] Error:", errData.parserError);
      reject(new Error(`PDF parsing failed: ${errData.parserError}`));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        const text = pdfParser.getRawTextContent() || "";
        console.log(
          `[PDF Parser] ✅ Extracted ${text.length} characters (raw text)`
        );
        // Debug first 200 chars
        console.log("[PDF Parser] Sample text:", text.slice(0, 200));
        resolve(text);
      } catch (error) {
        console.error("[PDF Parser] Text extraction error:", error.message);
        reject(new Error(`Text extraction failed: ${error.message}`));
      }
    });

    console.log(`[PDF Parser] Loading file: ${filePath}`);
    pdfParser.loadPDF(filePath);
  });
};


const parseResume = async (filePath, fileType) => {
  try {
    let text = "";

    console.log(`[Resume Parser] Processing ${fileType} file: ${filePath}`);

    if (fileType === "application/pdf") {
      // ✅ Parse PDF using pdf2json
      text = await parsePDF(filePath);
      console.log(`[Resume Parser] ✅ PDF parsed successfully`);
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword"
    ) {
      // ✅ Parse DOCX using mammoth
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
      console.log(`[Resume Parser] ✅ DOCX parsed: ${text.length} characters`);
    } else if (fileType === "text/plain") {
      // ✅ Parse TXT file
      text = await fs.readFile(filePath, "utf8");
      console.log(`[Resume Parser] ✅ TXT parsed: ${text.length} characters`);
    } else {
      throw new Error(`Unsupported file format: ${fileType}`);
    }

    // Validate text content
    if (!text || text.trim().length < 100) {
      throw new Error(
        "Resume text is too short or empty (minimum 100 characters required)"
      );
    }

    // Clean text (remove extra whitespace)
    const cleanedText = text
      .replace(/\s+/g, " ") // Multiple spaces → single space
      .replace(/\n+/g, "\n") // Multiple newlines → single newline
      .trim();

    console.log(
      `[Resume Parser] ✅ Final text length: ${cleanedText.length} characters`
    );

    return cleanedText;
  } catch (error) {
    console.error("[Resume Parser] ❌ Error:", error.message);
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};

module.exports = { parseResume };
