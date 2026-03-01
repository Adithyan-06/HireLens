import { supabase } from '../config/supabase.js';

export const applyToJob = async (req, res) => {
  const { userId, jobId, jobTitle, company, status } = req.body;
  try {
    const { data, error } = await supabase
      .from('applications')
      .insert([{ user_id: userId, job_id: jobId, job_title: jobTitle, company, status: status || 'applied' }]);

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { applicationId, status } = req.body;
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId);

    if (error) throw error;
    res.json({ message: "Status updated!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};