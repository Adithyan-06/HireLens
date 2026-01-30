let userSkills = ['React', 'Node.js', 'JavaScript', 'HTML'];

export const getUserSkills = (req, res) => {
  res.json({ skills: userSkills });
};

export const calculateMatch = (req, res) => {
  const { jobSkills } = req.body; // Array of skills from a job description

  if (!jobSkills || !Array.isArray(jobSkills)) {
    return res.status(400).json({ message: "Invalid job skills data" });
  }

  // Logic: How many jobSkills does the user have?
  const matches = jobSkills.filter(skill => 
    userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
  );

  const score = Math.round((matches.length / jobSkills.length) * 100);

  res.json({
    matchScore: score,
    matchedSkills: matches,
    missingSkills: jobSkills.filter(skill => !matches.includes(skill))
  });
};