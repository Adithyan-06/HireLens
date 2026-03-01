import axios from 'axios';

export const getJobs = async (req, res) => {
  try {
    const { search, location } = req.query;
    const { id } = req.params; 

    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    let url;
    if (id) {
      // Fetch a specific job by ID
      url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=${id}`;

    } else {
      // Fetch all jobs 
      url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&content-type=application/json`;
    }

    const response = await axios.get(url);

    const skillSet = [
      'JavaScript',
      'React',
      'Node.js',
      'Python',
      'Django',
      'AWS',
      'Java',
      'C++',
      'SQL',
      'HTML',
      'CSS',
      'Angular',
      'Vue.js',
      'TypeScript',
      'Kubernetes',
      'Docker',
      'Machine Learning',
      'Data Science',
    ];

    if (id) {
      // If fetching a specific job, format the job details
      const job = response.data.results.find(job => job.id == id);

      const jobSkills = extractSkillsFromDescription(job.description, skillSet);

      const formattedJob = {
        id: job.id,
        title: job.title.replace(/<\/?[^>]+(>|$)/g, ''), // Remove HTML tags
        company: job.company.display_name,
        location: job.location.display_name,
        url: job.redirect_url,
        description: job.description,
        salary: job.salary_min && job.salary_max
          ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
          : job.salary_min
          ? `$${job.salary_min.toLocaleString()}`
          : job.salary_max
          ? `$${job.salary_max.toLocaleString()}`
          : 'Competitive',
        skills: jobSkills,
      };

      return res.status(200).json(formattedJob);
    } else {
      // If searching for jobs, format the list of jobs
      const jobs = response.data.results.map((job) => {
        const jobSkills = extractSkillsFromDescription(job.description, skillSet);

        return {
          id: job.id,
          title: job.title.replace(/<\/?[^>]+(>|$)/g, ''), // Remove HTML tags
          company: job.company.display_name,
          location: job.location.display_name,
          description: job.description,
          salary: job.salary_min && job.salary_max
            ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
            : job.salary_min
            ? `$${job.salary_min.toLocaleString()}`
            : job.salary_max
            ? `$${job.salary_max.toLocaleString()}`
            : 'Competitive',
          skills: jobSkills,
        };
      });

      return res.status(200).json(jobs);
    }
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// Helper function to extract skills from job description
const extractSkillsFromDescription = (description, skillSet) => {
  if (!description) return [];
  const lowerCaseDescription = description.toLowerCase();
  return skillSet.filter(skill => lowerCaseDescription.includes(skill.toLowerCase()));
};
export const searchJobs = async (req, res) => {
  try {
    const { search, location } = req.query;

    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    // Instead of throwing error, set defaults
    const finalSearch = search || "developer";
    const finalLocation = location || "";

    const apiUrl = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${finalSearch}&where=${finalLocation}&content-type=application/json`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Adzuna API');
    }

    const data = await response.json();

    res.status(200).json(data.results || []);

  } catch (error) {
    console.error('Error in searchJobs:', error.message);
    res.status(500).json([]);
  }
};

export const applyJob = async (req, res) => {
  try {
    const { userId, jobId, jobTitle, company, status } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({ error: "Missing required information" });
    }

    const { data, error } = await supabase
      .from('applied_jobs')
      .insert([
        { 
          user_id: userId, 
          job_id: jobId, 
          job_title: jobTitle, 
          company: company, 
          status: status || 'Applied' 
        }
      ]);

    if (error) throw error;

    res.status(200).json({ success: true, message: "Application tracked successfully" });
  } catch (error) {
    console.error('Error applying for job:', error.message);
    res.status(500).json({ error: 'Failed to track application' });
  }
};