import { model } from "../../lib/gemini";
export type InterviewInfoType = {
  title: string;
  position: string;
  experience: string;
  Description: string;
};

const generateQuestions = async (InterviewInfo: InterviewInfoType) => {
  const prompt = `
  Generate 2 interview questions for a ${InterviewInfo.position} position that requires ${InterviewInfo.experience} experience.
  
  Job Description: ${InterviewInfo.Description}
  
  For each question, include:
  1. A challenging, open-ended interview question relevant to the position
  2. The expected duration to answer in seconds (between 60-180 seconds)
  3. Tips for the candidate on how to structure a good answer
  
  Return the questions in a valid JSON array format exactly as shown below:
  [
    {
      "id": 1,
      "text": "Question text here?",
      "expectedDuration": 120,
      "tips": "Tips for answering this question effectively."
    },
    {
      "id": 2,
      "text": "Question text here?",
      "expectedDuration": 90,
      "tips": "Tips for answering this question effectively."
    }
  ]
  
  Do not include any explanations or additional text outside of the JSON array.
  Ensure the questions are challenging and specific to the ${InterviewInfo.position} role.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract the JSON part from the response if needed
    const jsonPattern = /\[\s*\{[\s\S]*\}\s*\]/;
    const match = responseText.match(jsonPattern);

    if (!match) {
      console.error("Failed to extract valid JSON from AI response");
      return { error: "Failed to extract valid JSON from AI response" };
    }

    // Parse the JSON
    try {
      const questions = JSON.parse(match[0]);
      return questions;
    } catch (error) {
      console.error("Failed to parse questions JSON:", error);
      return { error: "Failed to parse questions JSON" };
    }
  } catch (error) {
    console.error("Error generating questions with Gemini:", error);
    return { error: "Error generating questions with Gemini" };
  }
};

export const getIntervewQuestions = async (
  InterviewInfo: InterviewInfoType
) => {
  const questions = await generateQuestions(InterviewInfo);
  return questions;
};

export const analyzeAnswers = async (
  answers: Record<number, { duration: number; transcript: string }>,
  questions: {
    id: number;
    text: string;
    expectedDuration: number;
    tips: string;
  }[],
  interviewInfo: InterviewInfoType
) => {
  try {
    // Significantly improved prompt with explicit JSON schema instructions
    const prompt = `
      You are an expert interviewer and career coach with deep knowledge of the ${
        interviewInfo.position
      } role.
      
      TASK: Analyze these interview answers for a ${
        interviewInfo.position
      } position requiring ${interviewInfo.experience} experience level.
      
      JOB DESCRIPTION: ${interviewInfo.Description}
      
      QUESTIONS AND ANSWERS:
      ${questions
        .map((q) => {
          const answer = answers[q.id];
          return `
          QUESTION ID: ${q.id}
          QUESTION TEXT: ${q.text}
          EXPECTED DURATION: ${q.expectedDuration} seconds
          ACTUAL DURATION: ${answer ? answer.duration : 0} seconds
          TRANSCRIPT: ${
            answer
              ? answer.transcript || "No transcript available"
              : "No answer provided"
          }
        `;
        })
        .join("\n\n")}
      
      EVALUATION CRITERIA:
      1. Technical accuracy and depth of knowledge
      2. Communication clarity and structure
      3. Relevance of examples provided
      4. Problem-solving approach
      5. Alignment with industry best practices for a ${interviewInfo.position}
      6. Appropriateness for the stated experience level (${
        interviewInfo.experience
      })
      
      REQUIRED JSON RESPONSE FORMAT:
      {
        "overallScore": [number between 0-100],
        "categories": [
          {
            "name": "Technical Knowledge", 
            "score": [number between 0-100]
          },
          {
            "name": "Communication Skills", 
            "score": [number between 0-100]
          },
          {
            "name": "Problem Solving", 
            "score": [number between 0-100]
          },
          {
            "name": "Role Relevance", 
            "score": [number between 0-100]
          },
          {
            "name": "Overall Impression", 
            "score": [number between 0-100]
          }
        ],
        "strengths": [
          "specific strength 1 with brief explanation",
          "specific strength 2 with brief explanation",
          "specific strength 3 with brief explanation"
        ],
        "improvements": [
          "specific improvement 1 with actionable advice",
          "specific improvement 2 with actionable advice",
          "specific improvement 3 with actionable advice"
        ],
        "questionAnalysis": [
          {
            "id": [matching question ID as integer],
            "score": [number between 0-100],
            "strengths": [array of 2-3 specific strengths as strings],
            "improvements": [array of 2-3 specific improvements as strings],
            "timeAssessment": "assessment of answer duration compared to expected time",
            "keyPoints": [array of 2-4 key points observed or missing in the answer]
          },
          ... one object for each question ...
        ]
      }
      
      CRITICAL INSTRUCTIONS:
      1. Return ONLY valid JSON - no additional text, markdown, or explanations outside the JSON structure
      2. Ensure ALL fields above are present even if empty arrays or default values
      3. Be specific and concrete in all feedback points - avoid generic responses
      4. For each question ID in the input, provide a corresponding analysis in the questionAnalysis array
      5. Make scores realistic - avoid inflating scores for weak answers
      6. Keep all arrays populated (never empty) - provide at least one item in each array
      7. Return precisely the JSON structure shown above, with no additional fields
      8. The response MUST be parseable as JSON with no errors
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Very strict JSON extraction pattern
    let jsonObject;

    try {
      // First try parsing the full response text
      jsonObject = JSON.parse(responseText);
    } catch (error) {
      console.error(
        "Failed to parse full response as JSON, trying to extract JSON part"
      );

      // If that fails, try to extract JSON using regex
      const jsonPattern = /\{[\s\S]*\}/;
      const match = responseText.match(jsonPattern);

      if (!match) {
        throw new Error("Failed to extract valid JSON from AI response");
      }

      try {
        jsonObject = JSON.parse(match[0]);
      } catch (innerError) {
        throw new Error("Failed to parse extracted JSON from AI response");
      }
    }

    // Validate the structure
    if (
      !jsonObject ||
      typeof jsonObject.overallScore !== "number" ||
      !Array.isArray(jsonObject.categories) ||
      !Array.isArray(jsonObject.strengths) ||
      !Array.isArray(jsonObject.improvements) ||
      !Array.isArray(jsonObject.questionAnalysis)
    ) {
      throw new Error("AI response is missing required fields");
    }

    return jsonObject;
  } catch (error) {
    console.error("Error in analyzeAnswers:", error);
    throw new Error(
      "Failed to analyze interview responses. Please try again later."
    );
  }
};
