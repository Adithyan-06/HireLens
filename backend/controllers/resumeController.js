import { extractText } from "unpdf";

export const parseResume = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    /* ------------------ 1. Extract PDF Text ------------------ */

    const fileData = new Uint8Array(req.file.buffer);
    const extracted = await extractText(fileData);

    let text =
      typeof extracted === "string"
        ? extracted
        : extracted?.text || "";

    text = text.toString().replace(/\r/g, "").trim();

    if (!text) {
      return res.status(400).json({
        error: "Text extraction failed. PDF may be image-based."
      });
    }

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    /* ------------------ 2. BASIC INFO ------------------ */

    const name = lines[0] || null;

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    const email = emailMatch ? emailMatch[0] : null;

    const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);
    const github_url = githubMatch ? githubMatch[0] : null;

    const cgpaMatch = text.match(/(CGPA|GPA)[^\d]*([\d.]+)/i);
    const cgpa = cgpaMatch ? parseFloat(cgpaMatch[2]) : null;

    /* ------------------ 3. SECTION DETECTION ------------------ */

    const sectionIndexes = {};
    const sectionKeywords = {
      education: ["education"],
      experience: ["experience", "work experience", "professional experience", "internship"],
      projects: ["projects"],
      skills: ["technical skills", "skills"],
      certifications: ["certifications", "certification"]
    };

    lines.forEach((line, index) => {
      for (const section in sectionKeywords) {
        if (
          sectionKeywords[section].some(keyword =>
            line.toLowerCase().includes(keyword)
          )
        ) {
          if (!sectionIndexes[section]) {
            sectionIndexes[section] = index;
          }
        }
      }
    });

    const getSectionText = (startKey, endKeys = []) => {
      if (sectionIndexes[startKey] === undefined) return "";

      const start = sectionIndexes[startKey] + 1;

      let end = lines.length;
      endKeys.forEach(key => {
        if (sectionIndexes[key] !== undefined && sectionIndexes[key] > start) {
          end = Math.min(end, sectionIndexes[key]);
        }
      });

      return lines.slice(start, end);
    };

    /* ------------------ 4. SKILLS ------------------ */

    const skillsLines = getSectionText("skills", ["projects", "experience", "education", "certifications"]);

    const skills = [];

    skillsLines.forEach(line => {
      if (line.includes(":")) {
        const parts = line.split(":")[1];
        if (parts) {
          parts.split(",").forEach(skill => {
            const clean = skill.trim();
            if (clean) skills.push(clean);
          });
        }
      } else {
        line.split(",").forEach(skill => {
          const clean = skill.trim();
          if (clean && clean.length < 40) skills.push(clean);
        });
      }
    });

    /* ------------------ 5. EXPERIENCE / INTERNSHIPS ------------------ */

    const experienceLines = getSectionText("experience", ["projects", "skills", "education", "certifications"]);

    const internships = [];
    let currentRole = null;

    experienceLines.forEach(line => {
      // Detect internship roles
      if (/intern|trainee|apprentice/i.test(line)) {
        if (currentRole) internships.push(currentRole);

        currentRole = {
          title: line,
          company: "",
          description: ""
        };
      }
      else if (currentRole && line.startsWith("•")) {
        currentRole.description += line.replace("•", "").trim() + " ";
      }
      else if (currentRole && !currentRole.company) {
        currentRole.company = line;
      }
    });

    if (currentRole) internships.push(currentRole);

    /* ------------------ 6. PROJECTS ------------------ */

    const projectLines = getSectionText("projects", ["skills", "experience", "education", "certifications"]);

    const projects = [];
    let currentProject = null;

    projectLines.forEach(line => {
      if (!line.startsWith("•")) {
        if (currentProject) projects.push(currentProject);

        currentProject = {
          title: line,
          description: ""
        };
      } else if (currentProject) {
        currentProject.description += line.replace("•", "").trim() + " ";
      }
    });

    if (currentProject) projects.push(currentProject);

    /* ------------------ 7. FINAL RESPONSE ------------------ */

    // Helper to extract username from a URL like github.com/username
const extractGithubUsername = (url) => {
  if (!url) return null;
  const parts = url.replace(/\/$/, "").split('/');
  return parts[parts.length - 1];
};

return res.status(200).json({
  success: true,
  data: {
    // Flattened to match your profiles table columns
    full_name: name,
    email: email,
    github_username: extractGithubUsername(github_url),
    cgpa: cgpa,
    skills: skills,
    // Renamed 'internships' to 'experience' to match DB/Frontend
    experience: internships, 
    projects: projects
  }
});

  } catch (error) {
    console.error("Resume Parsing Error:", error);
    return res.status(500).json({
      error: "Resume parsing failed",
      details: error.message
    });
  }
};
