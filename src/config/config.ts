import dotenv from 'dotenv';
dotenv?.config();

interface Supabase_Config_Object {
    SUPABASE_CLIENT_API_KEY: string;
    SUPABASE_URL: string;
}

export const Supabase_Config: Supabase_Config_Object = {
    SUPABASE_CLIENT_API_KEY: process?.env?.SUPABASE_CLIENT_API_KEY || 'default-supabase-api-key',
    SUPABASE_URL: process?.env?.SUPABASE_URL || 'default-supabase-url',
};
