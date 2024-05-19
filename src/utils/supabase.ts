import { supabase } from '../config/dbConnection.js';

export const getContactByColumn = async (columnName: string, columnValue: string) => {
    try {
        const { data: Contact } = await supabase.from('Contact').select('*').eq(columnName, columnValue);
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
        console.log('Error in insertNewContact service', err);
        throw err;
    }
};
