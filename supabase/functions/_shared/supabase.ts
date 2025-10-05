import { createClient } from 'jsr:@supabase/supabase-js@2';

export const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
