import { createClient } from '@supabase/supabase-js';
import { Supabase_Config } from './config.js';

export const supabase = createClient(Supabase_Config?.SUPABASE_URL, Supabase_Config?.SUPABASE_CLIENT_API_KEY);
