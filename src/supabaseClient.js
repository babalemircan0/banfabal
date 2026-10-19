import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jndhfuascjxjbjobneun.supabase.co'
const supabaseAnonKey = 'sb_publishable_tiEff-K7UqyMhItdvTZ5VA_o5StZA_i'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)