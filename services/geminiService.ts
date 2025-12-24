
import { GoogleGenAI, Type } from "@google/genai";

// Always use the named parameter for apiKey and assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTermuxAdvice = async (userQuery: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: "You are an expert Termux and Android developer. Help the user with Java, Gradle, package management, and GitHub Actions specifically for mobile development. Keep advice concise, practical, and shell-friendly.",
        temperature: 0.7,
      }
    });
    // .text is a property, not a method.
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error trying to process your request. Please check your connection and try again.";
  }
};

export const generateCustomWorkflow = async (projectDetails: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a GitHub Action YAML file for this project: ${projectDetails}`,
            config: {
                systemInstruction: "You are a DevOps engineer. Generate valid GitHub Actions YAML specifically for Java Gradle projects. Return ONLY the YAML content without markdown blocks if possible, or clear markdown code blocks.",
                temperature: 0.3,
            }
        });
        // .text is a property, not a method.
        return response.text;
    } catch (error) {
        return "Failed to generate workflow.";
    }
}
