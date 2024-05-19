import { getContactByColumn, insertNewContactInDB } from '../utils/supabase.js';

interface identifyPayload {
    email?: string;
    phoneNumber?: string;
}

export const identify = async (details: identifyPayload) => {
    try {
        const { email, phoneNumber } = details;
        if (!(email && phoneNumber)) return { status: false, message: 'Contact details not found' };
        else {
            const contactByEmail = await getContactByColumn('email', email || '');
            const contactByPhone = await getContactByColumn('phoneNumber', phoneNumber || '');
            if (!(contactByEmail && contactByPhone && contactByEmail?.length && contactByPhone?.length)) {
                // Create new contact
                return await insertNewContact(email, phoneNumber);
            } else {
                // Existing contact
                return { status: false, message: 'Existing contact' };
            }
        }
    } catch (err) {
        console.log('Error in biteSpeedService.identify service', err);
        return { status: false, message: 'Error in service' };
    }
};

// Function to insert new contact details in db
const insertNewContact = async (email?: string, phoneNumber?: string) => {
    try {
        if (!(email && phoneNumber)) return { status: false, message: 'Contact details not found' };
        else {
            const json = {
                email: email || null,
                phoneNumber: phoneNumber || null,
                linkPrecedence: 'primary',
                createdAt: new Date().toISOString().replace('T', ' '),
                updatedAt: new Date().toISOString().replace('T', ' '),
            };
            const insertContact = await insertNewContactInDB(json);
            if (insertContact && insertContact?.length) {
                return {
                    contact: {
                        primaryContactId: null,
                        emails: [email],
                        phoneNumbers: [phoneNumber],
                        secondaryContactIds: [],
                    },
                };
            } else {
                return { status: false, message: 'New contact not inserted' };
            }
        }
    } catch (err) {
        console.log('Error in biteSpeedService.upsertNewContact service', err);
        return { status: false, message: 'Error in service' };
    }
};
