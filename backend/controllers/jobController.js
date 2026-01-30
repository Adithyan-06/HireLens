import axios from 'axios';

export const getJobs = async (req, res) => {
  try {
    const { search, location } = req.query; // Get search terms from frontend

    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;


    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${search || 'developer'}&where=${location || ''}&content-type=application/json`;

    const response = await axios.get(url);

    const jobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title.replace(/<\/?[^>]+(>|$)/g, ""), 
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      salary: job.salary_min || "Not disclosed",
      redirect_url: job.redirect_url
    }));

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Adzuna Error:", error);
    res.status(500).json({ message: "Failed to fetch jobs from Adzuna" });
  }
};