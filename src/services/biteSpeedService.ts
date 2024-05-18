import { getContactByEmailOrPhoneNumber } from '../utils/supabase.js';

interface identifyPayload {
    email?: string;
    phoneNumber?: string;
}

export const identify = async (details: identifyPayload) => {
    try {
        const { email, phoneNumber } = details;
        if (!(email || phoneNumber)) return { status: false, message: 'Contact details not found' };
        else {
            const result = await getContactByEmailOrPhoneNumber(email, phoneNumber);
            return result;
        }
    } catch (err) {
        console.log('Error in biteSpeedService.identify service', err);
        return { status: false, message: 'Error in service' };
    }
};
