import { supabase } from '../config/supabase.js';
import { calculateTotalScore } from '../utils/scoringEngine.js';

export const getRankings = async (req, res) => {
  try {
    // Fetch users, their skills, and profile data
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*, skills(count)');

    if (error) throw error;

    // Calculate scores and sort
    const rankedProfiles = profiles.map(profile => ({
      ...profile,
      overall_score: calculateTotalScore(profile)
    })).sort((a, b) => b.overall_score - a.overall_score);

    res.status(200).json(rankedProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};