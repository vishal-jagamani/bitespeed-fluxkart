import dotenv from 'dotenv';
import { Supabase_Config_Object } from '../types/fluxkartType';

dotenv?.config();

export const Supabase_Config: Supabase_Config_Object = {
    SUPABASE_CLIENT_API_KEY: process?.env?.SUPABASE_CLIENT_API_KEY || 'default-supabase-api-key',
    SUPABASE_URL: process?.env?.SUPABASE_URL || 'default-supabase-url',
};
