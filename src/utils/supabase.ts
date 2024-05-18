import { supabase } from '../config/dbConnection.js';

export const getContactByEmailOrPhoneNumber = async (email?: string, phoneNumber?: string) => {
    try {
        const { data: Contact } = await supabase.from('Contact').select('*').eq('email', email);
        return Contact;
    } catch (err) {
        console.log('Error in getContactByEmailOrPhoneNumber service', err);
        throw err;
    }
};
