import { createClient } from '@supabase/supabase-js'

// Reemplaza estas variables con tus credenciales de Supabase
const SUPABASE_URL = 'https://nwxbgbwbtibwwygtzdtn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eGJnYndidGlid3d5Z3R6ZHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MjAzNzgsImV4cCI6MjA5NTk5NjM3OH0.Ic157jopLVZA3btSkc_Q-KMRAWgrakkqjAv6ArEgmNY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
