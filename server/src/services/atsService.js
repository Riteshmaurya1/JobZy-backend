const { generateWithGemini } = require("../config/geminiAI");

/**
 * Analyze resume using Gemini AI
 * Returns ATS score and detailed feedback
 */
const analyzeResumeWithAI = async (resumeText, jobRole) => {
  try {
    console.log("🤖 [ATS Service] Starting AI analysis...");
    console.log("🤖 [ATS Service] Job Role:", jobRole);
    console.log(
      "🤖 [ATS Service] Resume Length:",
      resumeText.length,
      "characters"
    );

    // Create detailed prompt based on job role
    const prompt = `You are an ATS (Applicant Tracking System) analyzer. Analyze the following resume for a ${jobRole} position.

Resume Content:
${resumeText}

Provide a detailed analysis in the following JSON format (return ONLY valid JSON, no markdown, no code blocks):
{
  "atsScore": <number between 0-100>,
  "overallFeedback": "<brief summary>",
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
  "missingKeywords": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "suggestions": ["<suggestion1>", "<suggestion2>", "<suggestion3>"],
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

Scoring Criteria:
- Contact Info: Phone, email, LinkedIn presence, Github (if applicable)
- Summary: Clear, concise, role-specific
- Experience: Measurable achievements, relevant experience for ${jobRole}
- Skills: Technical skills matching ${jobRole} requirements
- Education: Relevant degrees/certifications
- Formatting: ATS-friendly format, clear sections, no images/tables`;

    // ✅ Use generateWithGemini instead of model.generateContent
    const aiResponse = await generateWithGemini(prompt);

    console.log("🤖 [ATS Service] ✅ AI Response received");
    console.log("🤖 [ATS Service] Response length:", aiResponse.length);

    // Parse JSON response (handle markdown code blocks)
    let jsonText = aiResponse.trim();

    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    // Extract JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("🤖 [ATS Service] ❌ Invalid JSON response");
      console.error(
        "Raw response (first 500 chars):",
        aiResponse.substring(0, 500)
      );
      throw new Error("Invalid AI response format");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    console.log(
      "🤖 [ATS Service] ✅ Parsed successfully. ATS Score:",
      analysis.atsScore
    );

    return analysis;
  } catch (error) {
    console.error("[ATS Service] ❌ Error:", error.message);

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

/**
 * Get job role specific keywords
 */
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

/**
 * Get AI-powered keyword suggestions
 * Pro feature: Detailed keyword analysis with context
 */
const getKeywordSuggestions = async (
  resumeText,
  jobRole,
  jobDescription = ""
) => {
  try {
    console.log("🤖 [Keyword Suggestions] Starting analysis...");

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

    console.log("🤖 [Keyword Suggestions] ✅ Response received");

    // Parse JSON response
    let jsonText = aiResponse.trim();
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("🤖 [Keyword Suggestions] ❌ Invalid JSON");
      throw new Error("Invalid AI response format");
    }

    const suggestions = JSON.parse(jsonMatch[0]);
    console.log("🤖 [Keyword Suggestions] ✅ Parsed successfully");

    return suggestions;
  } catch (error) {
    console.error("[ATS Service] Keyword Suggestions Error:", error.message);
    throw new Error(`Failed to generate keyword suggestions: ${error.message}`);
  }
};

/**
 * Compare resume with job description
 * Extract matching and missing keywords
 */
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
