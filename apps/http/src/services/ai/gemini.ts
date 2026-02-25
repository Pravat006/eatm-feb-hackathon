import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "@/config";
import { logger } from "@repo/logger";

const genAI = new GoogleGenerativeAI((config as any).GEMINI_API_KEY as string);

export interface AIAnalysisResult {
    category: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    summary: string;
    isHazard: boolean;
}

export const analyzeComplaint = async (description: string): Promise<AIAnalysisResult> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Analyze the following campus infrastructure complaint and provide a structured JSON response.
            Complaint: "${description}"

            Identify:
            1. Category: One of (Electrical, Plumbing, Network, Furniture, HVAC, Safety, Other).
            2. Priority: One of (LOW, MEDIUM, HIGH, CRITICAL). Use CRITICAL for immediate hazards like exposed wires or major floods.
            3. Summary: A short 5-10 word summary.
            4. IsHazard: Boolean flag if this presents a danger to students.

            Response Format (Strict JSON):
            {
                "category": "string",
                "priority": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
                "summary": "string",
                "isHazard": boolean
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the response in case Gemini adds markdown backticks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Failed to parse AI response as JSON");

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        logger.error("AI Analysis failed:", error);
        // Fallback for safety
        return {
            category: "Other",
            priority: "MEDIUM",
            summary: "Issue requires manual review",
            isHazard: false
        };
    }
};
