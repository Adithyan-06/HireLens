export const calculateTotalScore = (profile) => {
    const weights = {
      cgpa: 0.2,       // 20%
      github: 0.3,     // 30%
      skills: 0.3,     // 30%
      experience: 0.2  // 20% (Internships/Projects)
    };
  
    // Simple math: (Value / MaxValue) * Weight * 100
    const cgpaScore = (profile.cgpa / 10) * weights.cgpa * 100;
    const githubScore = (profile.github_stars > 0 ? 100 : 50) * weights.github; // Simplified for now
    const skillsScore = (profile.skills_count * 10) * weights.skills;
  
    return Math.round(cgpaScore + githubScore + skillsScore);
  };