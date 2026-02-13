
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const extractPdfContent = async (base64Data: string, fileName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Data,
            },
          },
          {
            text: `Please analyze this PDF document named "${fileName}". Extract the key details including the title, main topics discussed, dates mentioned, and a comprehensive summary of the professional achievement or training it represents. Format the output in a clean, structured way for a professional teacher portfolio.`
          }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "No content extracted.";
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    return "Error extracting content from PDF. Please check the file format or try again later.";
  }
};

export const getPortfolioAdvice = async (activities: any[]): Promise<string> => {
  try {
    const prompt = `Based on these teaching activities: ${JSON.stringify(activities)}, provide a brief, professional summary of the teacher's professional growth and 2 suggestions for future areas of practice or seminars to round out their portfolio. Keep it concise and monochrome-themed (professional).`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    return response.text || "Unable to generate advice.";
  } catch (error) {
    return "AI insights currently unavailable.";
  }
};
