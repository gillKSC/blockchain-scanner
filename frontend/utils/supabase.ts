import { createClient } from '@supabase/supabase-js'


let supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!
let supabase_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export default createClient(
  supabase_url,
  supabase_key	)