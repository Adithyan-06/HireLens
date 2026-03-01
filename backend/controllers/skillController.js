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

export const getGithubSkills = async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch public repos for the user
    const response = await axios.get(`https://api.github.com/users/${username}/repos`);
    const repos = response.data;

    // Count occurrences of languages
    const languages = {};
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    // Format for our Skill Matrix
    const extractedSkills = Object.keys(languages).map(lang => ({
      name: lang,
      count: languages[lang],
      source: 'GitHub'
    }));

    res.json(extractedSkills);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch GitHub data" });
  }
};