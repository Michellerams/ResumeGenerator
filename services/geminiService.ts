
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, ATSFeedback } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        title: { type: Type.STRING },
        summary: { type: Type.STRING, description: "A professional summary of 2-4 sentences, optimized with keywords from the job description." },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.NUMBER },
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    dates: { type: Type.STRING },
                    description: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "3-5 bullet points for each job. Rewrite them to be action-oriented, results-driven, and tailored to the job description keywords."
                    }
                },
                required: ['id', 'title', 'company', 'location', 'dates', 'description']
            }
        },
        skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of relevant skills, prioritizing those mentioned in the job description."
        }
    },
    required: ['name', 'title', 'summary', 'experience', 'skills']
};


export const enhanceWithAI = async (resumeData: ResumeData, jobDescription: string): Promise<ResumeData> => {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
        You are an expert resume writer and career coach.
        Analyze the following resume data and job description.
        Your task is to rewrite and optimize the resume content to be highly ATS-friendly and tailored for the specific job.
        
        - Enhance the professional summary to be concise and impactful, incorporating key qualifications from the job description.
        - Rewrite the experience bullet points to be action-oriented and quantify achievements where possible. Use the STAR (Situation, Task, Action, Result) method.
        - Align the skills section with the requirements listed in the job description.
        - Do NOT change personal details like name, contact info, company names, dates, or education details. Only enhance the summary, experience descriptions, and skills list.
        - Return ONLY the JSON object conforming to the provided schema. Do not include any markdown formatting or introductory text.

        Resume Data:
        ${JSON.stringify({name: resumeData.name, title: resumeData.title, summary: resumeData.summary, experience: resumeData.experience, skills: resumeData.skills})}

        Job Description:
        ${jobDescription || 'A senior frontend developer role at a tech company.'}
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumeSchema
            }
        });
        
        const text = response.text.trim();
        const enhancedContent = JSON.parse(text);

        // Merge enhanced data with original data to preserve fields not touched by AI
        return {
            ...resumeData,
            summary: enhancedContent.summary,
            experience: resumeData.experience.map(exp => {
                const enhancedExp = enhancedContent.experience.find((e: any) => e.id === exp.id);
                return enhancedExp ? { ...exp, description: enhancedExp.description } : exp;
            }),
            skills: enhancedContent.skills,
        };

    } catch (e) {
        console.error("Error enhancing resume with AI:", e);
        throw new Error("Failed to process AI enhancement.");
    }
};

const atsFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER, description: "An overall ATS compatibility score from 0 to 100." },
        matchRate: { type: Type.STRING, description: "A short phrase describing the keyword match rate, e.g., 'High', 'Medium', 'Low'." },
        keywordAnalysis: {
            type: Type.OBJECT,
            properties: {
                found: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords from the job description that were found in the resume." },
                missing: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Crucial keywords from the job description that are missing from the resume." },
            },
            required: ['found', 'missing']
        },
        suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-5 actionable suggestions to improve the resume's ATS score and overall quality."
        }
    },
    required: ['score', 'matchRate', 'keywordAnalysis', 'suggestions']
};

export const getAtsFeedback = async (resumeText: string, jobDescription: string): Promise<ATSFeedback> => {
     const model = 'gemini-2.5-flash';
    
    const prompt = `
        You are an advanced Applicant Tracking System (ATS) simulator.
        Analyze the following resume text against the provided job description.

        Your tasks are:
        1. Calculate an ATS compatibility score from 0 to 100 based on keyword matching, formatting, and relevance.
        2. Identify keywords from the job description that are present and absent in the resume.
        3. Provide clear, actionable suggestions for improvement.

        Return ONLY the JSON object conforming to the provided schema. Do not include any markdown formatting or introductory text.

        Resume Text:
        ---
        ${resumeText}
        ---

        Job Description:
        ---
        ${jobDescription}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: atsFeedbackSchema
            }
        });
        
        const text = response.text.trim();
        return JSON.parse(text);

    } catch (e) {
        console.error("Error getting ATS feedback from AI:", e);
        throw new Error("Failed to process ATS feedback.");
    }
}
