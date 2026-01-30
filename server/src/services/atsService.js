const { generateWithGemini } = require("../config/geminiAI");
const logger = require("../logger/logger");

const analyzeResumeWithAI = async (resumeText, jobRole) => {
  try {
    logger.log("🤖 [ATS Service] Starting AI analysis...");
    logger.info("🤖 [ATS Service] Job Role:", jobRole);
    logger.info(
      "🤖 [ATS Service] Resume Length:",
      resumeText.length,
      "characters",
    );

    // Create detailed prompt based on job role
    const prompt = `You are a strict ATS (Applicant Tracking System) analyzer with professional recruiting standards. Analyze this resume for a ${jobRole} position.

Resume Content:
${resumeText}

CRITICAL SCORING GUIDELINES:
- Be realistic and critical - most resumes have room for improvement
- Maximum score is capped at 85/100 (only exceptional resumes with perfect formatting, strong achievements, and excellent keyword optimization reach 75-80)
- Typical good resumes score 65-75
- Average resumes score 55-65
- Weak resumes score below 55
- Deduct points for: missing sections, vague descriptions, lack of quantifiable achievements, poor keyword optimization, formatting issues

Provide analysis in this EXACT JSON format (return ONLY valid JSON, no markdown, no code blocks):
{
  "atsScore": <number between 0-80, typically 50-70>,
  "overallFeedback": "<2-3 sentence critical summary explaining the score>",
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
  "missingKeywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "suggestions": ["<actionable suggestion1>", "<actionable suggestion2>", "<actionable suggestion3>"],
  "sectionScores": {
    "contactInfo": <0-100>,
    "summary": <0-100>,
    "experience": <0-100>,
    "skills": <0-100>,
    "education": <0-100>,
    "formatting": <0-100>
  },
  "keywordMatches": {
    "found": ["<keyword1>", "<keyword2>"],
    "missing": ["<keyword3>", "<keyword4>"]
  }
}

Scoring Rubric (be strict):
- Contact Info (0-100): Complete contact details, LinkedIn URL, professional email, location
- Summary (0-100): Role-specific, quantified achievements, clear value proposition (most resumes: 50-70)
- Experience (0-100): Measurable results, action verbs, relevance to ${jobRole}, 3+ years recent experience (most resumes: 50-65)
- Skills (0-100): Technical skills matching ${jobRole}, proficiency levels stated, balanced hard/soft skills (most resumes: 55-70)
- Education (0-100): Relevant degree, certifications, ongoing learning
- Formatting (0-100): ATS-compatible (no tables/images/headers), clear hierarchy, consistent formatting, proper use of keywords

Remember: Score critically. A score of 80+ means the resume is genuinely strong and competitive.`;
    // Use generateWithGemini instead of model.generateContent
    const aiResponse = await generateWithGemini(prompt);

    logger.info("🤖 [ATS Service] - AI Response received");
    logger.info("🤖 [ATS Service] Response length:", aiResponse.length);

    // Parse JSON response (handle markdown code blocks)
    let jsonText = aiResponse.trim();

    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    // Extract JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.error("🤖 [ATS Service] ❌ Invalid JSON response");
      logger.error(
        "Raw response (first 500 chars):",
        aiResponse.substring(0, 500),
      );
      throw new Error("Invalid AI response format");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    logger.info(
      "🤖 [ATS Service] - Parsed successfully. ATS Score:",
      analysis.atsScore,
    );

    return analysis;
  } catch (error) {
    logger.error("[ATS Service] - Error:", error.message);

    // Provide specific error messages
    if (error.message.includes("API key")) {
      throw new Error("Invalid Gemini API key. Check your .env file");
    }

    if (error.message.includes("quota") || error.message.includes("429")) {
      throw new Error("Gemini API rate limit reached. Try again later");
    }

    if (error.message.includes("JSON")) {
      throw new Error("AI returned invalid format. Please try again");
    }

    throw new Error(`Failed to analyze resume with AI: ${error.message}`);
  }
};

const getJobRoleKeywords = (jobRole) => {
  const keywordMap = {
    frontend: [
      "React",
      "JavaScript",
      "HTML",
      "CSS",
      "TypeScript",
      "Vue",
      "Angular",
      "Redux",
      "Webpack",
      "Responsive Design",
      "UI/UX",
      "REST API",
    ],
    backend: [
      "Node.js",
      "Express",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "REST API",
      "GraphQL",
      "Microservices",
      "Docker",
      "AWS",
      "Redis",
      "Authentication",
    ],
    fullstack: [
      "React",
      "Node.js",
      "JavaScript",
      "MongoDB",
      "Express",
      "REST API",
      "Database Design",
      "Git",
      "Agile",
      "CI/CD",
    ],
    devops: [
      "Docker",
      "Kubernetes",
      "AWS",
      "CI/CD",
      "Jenkins",
      "Terraform",
      "Linux",
      "Monitoring",
      "Nginx",
      "Git",
    ],
  };

  return keywordMap[jobRole.toLowerCase()] || [];
};

const getKeywordSuggestions = async (
  resumeText,
  jobRole,
  jobDescription = "",
) => {
  try {
    logger.info("[Keyword Suggestions] Starting analysis...");

    const prompt = `You are an ATS keyword expert. Analyze the resume and suggest missing keywords for a ${jobRole} position.

Resume Content:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}\n` : ""}

Provide detailed keyword suggestions in the following JSON format (return ONLY valid JSON, no markdown, no code blocks):
{
  "criticalMissing": [
    {
      "keyword": "<keyword>",
      "reason": "<why important>",
      "placement": "<where to add: summary/experience/skills>"
    }
  ],
  "recommended": [
    {
      "keyword": "<keyword>",
      "reason": "<why helpful>",
      "placement": "<section>"
    }
  ],
  "industryTrending": [
    {
      "keyword": "<trending skill>",
      "relevance": "<why trending for ${jobRole}>"
    }
  ],
  "actionVerbs": ["<verb1>", "<verb2>", "<verb3>"],
  "technicalSkills": ["<skill1>", "<skill2>", "<skill3>"],
  "softSkills": ["<skill1>", "<skill2>"],
  "certifications": ["<cert1>", "<cert2>"],
  "overallSuggestions": "<strategic advice for keyword optimization>"
}

Focus on:
1. Keywords that ATS systems specifically look for in ${jobRole} roles
2. Industry-standard terminology
3. Technical skills commonly required
4. Action verbs that demonstrate impact
5. Certifications that add credibility
${jobDescription ? "6. Keywords from the provided job description" : ""}`;

    // ✅ Use generateWithGemini
    const aiResponse = await generateWithGemini(prompt);

    logger.info("🤖 [Keyword Suggestions] - AI Response received");

    // Parse JSON response
    let jsonText = aiResponse.trim();
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.error("🤖 [Keyword Suggestions] - Invalid JSON");
      throw new Error("Invalid AI response format");
    }

    const suggestions = JSON.parse(jsonMatch[0]);
    logger.info("🤖 [Keyword Suggestions] - Parsed successfully");

    return suggestions;
  } catch (error) {
    logger.error("[ATS Service] Keyword Suggestions Error:", error.message);
    throw new Error(`Failed to generate keyword suggestions: ${error.message}`);
  }
};

const compareWithJobDescription = (resumeText, jobDescription) => {
  // Simple keyword extraction (can be enhanced with NLP)
  const resumeWords = resumeText.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const jobWords = jobDescription.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

  const resumeSet = new Set(resumeWords);
  const jobSet = new Set(jobWords);

  const matching = [...jobSet].filter((word) => resumeSet.has(word));
  const missing = [...jobSet].filter((word) => !resumeSet.has(word));

  // Filter out common words
  const commonWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "this",
    "that",
    "from",
    "have",
    "will",
    "can",
    "are",
    "was",
    "were",
    "been",
    "has",
    "had",
    "does",
    "did",
    "would",
    "could",
    "should",
  ]);

  return {
    matchingKeywords: matching.filter((w) => !commonWords.has(w)).slice(0, 20),
    missingKeywords: missing.filter((w) => !commonWords.has(w)).slice(0, 20),
    matchPercentage:
      Math.round((matching.length / Math.max(jobWords.length, 1)) * 100) || 0,
  };
};

module.exports = {
  analyzeResumeWithAI,
  getJobRoleKeywords,
  getKeywordSuggestions,
  compareWithJobDescription,
};
