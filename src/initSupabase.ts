import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Better put your these secret keys in .env file
export const supabase = createClient("https://wloopuwaklzhprojamfg.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indsb29wdXdha2x6aHByb2phbWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NzM4NjAsImV4cCI6MjA1MjQ0OTg2MH0.ySYSSWUWOgyoY_tQAIv0oCzlRbkLZ7qo-lMkc3X0eyo", {
  localStorage: AsyncStorage as any,
  detectSessionInUrl: false // Prevents Supabase from evaluating window.location.href, breaking mobile
});
