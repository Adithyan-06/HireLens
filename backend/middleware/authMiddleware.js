import { supabase } from '../config/supabase.js';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Use Supabase to verify the token
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Attach the user to the request object so controllers can use it
  req.user = user;
  next();
};