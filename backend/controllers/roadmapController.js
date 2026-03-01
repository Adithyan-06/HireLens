import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateRoadmap = async (req, res) => {
  try {
    const { jobTitle = "Unknown Job", adzunaDescription = "" } = req.body;

    const prompt = `
      ACT AS: A Senior Technical Architect and Career Coach.
      JOB ROLE: ${jobTitle}
      JOB DESCRIPTION: ${adzunaDescription}

      TASK: 
      1. Analyze the Job Description and extract the 5-8 most critical technical skills/tools required.
      2. Create a comprehensive, step-by-step weekly learning roadmap that covers ALL these skills from scratch.
      3. The roadmap should be structured for a student to become job-ready for this specific position.
      4. For each week, provide a clear topic and 2-3 specific free learning resources (e.g., "Web Dev Simplified YouTube", "MDN Docs", "FreeCodeCamp").

      RETURN ONLY JSON in this format:
      {
        "required_skills": ["string"],
        "roadmap": [
          { 
            "week": number, 
            "topic": "string", 
            "learning_objective": "string",
            "resources": ["string"] 
          }
        ],
        "estimated_duration": "X Weeks",
        "difficulty": "Beginner/Intermediate/Advanced"
      }
    `;

    // Use the correct model name for your tier
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 1. Robust JSON Cleaning
    const cleanJsonString = text.replace(/```json|```/g, "").trim();
    const rawData = JSON.parse(cleanJsonString);

    // 2. Data Transformation: Injecting 'completed: false' for the Frontend Checklist
    // This ensures the RoadmapView page can immediately toggle steps.
    const finalRoadmap = {
      ...rawData,
      roadmap: rawData.roadmap.map((step) => ({
        ...step,
        completed: false // Critical for progress tracking logic
      }))
    };

    // 3. Success Response
    res.status(200).json({ 
      success: true, 
      data: finalRoadmap 
    });

  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to generate complete job roadmap", 
      details: error.message 
    });
  }
};