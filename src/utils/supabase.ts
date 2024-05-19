import { supabase } from '../config/dbConnection.js';

export const getContactByColumn = async (email: string[], phoneNumber: string[]) => {
    try {
        const { data: Contact } = await supabase.from('Contact').select('*').or(`email.eq.${email},phoneNumber.eq.${phoneNumber}`).order('updatedAt');
        return Contact;
    } catch (err) {
        console.log('Error in getContactByEmailOrPhoneNumber service', err);
        throw err;
    }
};

export const insertNewContactInDB = async (data: object) => {
    try {
        const { data: Contact } = await supabase.from('Contact').insert(data).select();
        return Contact;
    } catch (err) {
        console.log('Error in insertNewContactInDB service', err);
        throw err;
    }
};

export const updateExistingContactInDB = async (data: object, ids: number[]) => {
    try {
        const { data: Contact } = await supabase.from('Contact').update(data).in('id', ids);
        return Contact;
    } catch (err) {
        console.log('Error in updateExistingContactInDB service', err);
        throw err;
    }
};
