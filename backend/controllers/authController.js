import { supabase } from '../config/supabase.js';

export const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // If Supabase returns an error, send it back
      return res.status(400).json({ error: error.message });
    }

    // Success! 
    // We don't need to manually insert into 'profiles' 
    // because the trigger handles it.
    res.status(201).json({ 
      message: "User created successfully", 
      user: data.user 
    });

  } catch (err) {
    res.status(500).json({ error: "Server error during signup" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the URL

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single(); // We only want one profile

    if (error) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching profile" });
  }
};