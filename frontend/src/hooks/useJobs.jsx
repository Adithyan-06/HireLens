import { useState } from 'react';
import axios from 'axios';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchJobs = async (query, location) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/search`, {
        params: { search: query, location }
      });
      setJobs(response.data);
    } catch (err) {
      console.error("Error searching jobs", err);
    } finally {
      setLoading(false);
    }
  };

  return { jobs, loading, searchJobs };
};