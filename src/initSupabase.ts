import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient("https://lfawmlfblqyocweylumt.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmYXdtbGZibHF5b2N3ZXlsdW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMTE0MzIsImV4cCI6MjA1NzY4NzQzMn0.DNavgFln2POvp2RRS-Ccd0l3v6fyIzrCHFRiNWleVP4", {
  localStorage: AsyncStorage as any,
  detectSessionInUrl: false // Prevents Supabase from evaluating window.location.href, breaking mobile
});