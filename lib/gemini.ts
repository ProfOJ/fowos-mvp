import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: number
  explanation: string
}

export interface GenerateQuizParams {
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  experienceLevel: "entry" | "mid" | "senior"
  category: string
}

export async function generateQuizQuestions({
  topic,
  difficulty,
  experienceLevel,
  category,
}: GenerateQuizParams): Promise<QuizQuestion[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const prompt = `
Generate exactly 10 multiple choice questions for a ${difficulty} level ${category} quiz on "${topic}" for ${experienceLevel} level professionals.

Requirements:
- Each question should have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Include a brief explanation for the correct answer
- Questions should be practical and relevant to real-world scenarios
- Difficulty should match ${difficulty} level
- Target audience: ${experienceLevel} level professionals

Format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]

Make sure the JSON is valid and contains exactly 10 questions. Do not include any markdown formatting or code blocks, just return the raw JSON array.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    let cleanText = text.trim()

    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\s*/, "").replace(/```\s*$/, "")

    // Find JSON array in the response
    const jsonMatch = cleanText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error("No JSON array found in response:", text)
      throw new Error("No valid JSON found in response")
    }

    const questions = JSON.parse(jsonMatch[0])

    // Validate the response
    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error(`Invalid response format or incorrect number of questions. Got ${questions.length} questions`)
    }

    // Validate each question
    questions.forEach((q, index) => {
      if (
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correct_answer !== "number" ||
        q.correct_answer < 0 ||
        q.correct_answer > 3 ||
        !q.explanation
      ) {
        throw new Error(`Invalid question format at index ${index}: ${JSON.stringify(q)}`)
      }
    })

    return questions
  } catch (error) {
    console.error("Error generating quiz questions:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate quiz questions: ${error.message}`)
    }
    throw new Error("Failed to generate quiz questions")
  }
}
