import { contactArray, identifyPayload, insertNewContactInterface } from '../types/fluxkartType.js';
import { getContactByColumn, insertNewContactInDB, updateExistingContactInDB } from '../utils/supabase.js';

export const identify = async (details: identifyPayload) => {
    try {
        const { email, phoneNumber } = details;
        if (!email && !phoneNumber) return { status: false, message: 'Contact details not found' };
        else {
            const contacts = await getContactByColumn(email ? [email] : [], phoneNumber ? [phoneNumber] : []);
            if (!contacts?.length) {
                // Create new contact
                return await insertNewContact({ email, phoneNumber });
            } else {
                // Existing contact
                return await handleExistingContact(email || '', phoneNumber || '', contacts);
            }
        }
    } catch (err) {
        console.log('Error in fluxkartService.identify service', err);
        return { status: false, message: 'Error in service' };
    }
};

// Function to insert new contact details in db
const insertNewContact = async ({ email, phoneNumber, linkPrecedence, primaryContactId }: insertNewContactInterface) => {
    try {
        if (!email && !phoneNumber) return { status: false, message: 'Contact details not found' };
        else {
            const json = {
                email: email || null,
                phoneNumber: phoneNumber || null,
                linkedId: primaryContactId || null,
                linkPrecedence: linkPrecedence || 'primary',
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
        console.log('Error in fluxkartService.upsertNewContact service', err);
        throw err;
    }
};

// Function which handles the functionalities for the existing contact
const handleExistingContact = async (email: string, phoneNumber: string, contacts: contactArray[]) => {
    try {
        const emailContact = contacts?.find((val) => val?.email === email);
        const phoneContact = contacts?.find((val) => val?.phoneNumber === phoneNumber);
        const sortedContact = contacts
            ?.sort((a: any, b: any) => b?.updatedAt - a?.updatedAt)
            ?.filter((val) => val.linkPrecedence !== 'secondary')
            ?.slice(1);
        if (emailContact?.id === phoneContact?.id) {
            // same one old contact details
            return await getDefaultContactResponse(contacts);
        } else if (sortedContact?.length) {
            //Update the contact with secondary
            return await updateContactWithSecondaryPrecedence(email, phoneNumber, sortedContact);
        } else if (emailContact && phoneContact) {
            // same one old contact details
            return await getDefaultContactResponse(contacts);
        }
        if (email && phoneNumber) {
            // Create new contact details if new information is found
            return await createNewContactIfNewInformationFound(email, phoneNumber, contacts);
        } else {
            let newContacts: contactArray[] = contacts;
            if (email) {
                const phoneNumber: any = contacts?.map((val) => val?.phoneNumber)?.filter((val) => val);
                const phoneContactsByEmails = (await getContactByColumn(email ? [email] : [], phoneNumber ? [phoneNumber] : [])) || [];
                newContacts = newContacts?.concat(phoneContactsByEmails);
            }
            if (phoneNumber) {
                const emails: any = contacts?.map((val) => val?.email)?.filter((val) => val);
                const emailContactsByPhoneNumber = (await getContactByColumn(email ? [email] : [], phoneNumber ? [phoneNumber] : [])) || [];
                newContacts = newContacts?.concat(emailContactsByPhoneNumber);
            }
            return await getDefaultContactResponse(newContacts);
        }
    } catch (err) {
        console.log('Error in fluxkartService.handleExistingContact service', err);
        throw err;
    }
};

// Function to return the default response mapped from contacts
const getDefaultContactResponse = async (contacts: contactArray[]) => {
    try {
        return {
            contact: {
                primaryContactId: contacts?.find((val) => val?.linkPrecedence === 'primary')?.id,
                emails: [...new Set(contacts?.map((val) => val?.email))].filter((val) => val),
                phoneNumbers: [...new Set(contacts?.map((val) => val?.phoneNumber))]?.filter((val) => val),
                secondaryContactIds: [...new Set(contacts?.filter((val) => val?.linkPrecedence === 'secondary').map((val) => val?.id))],
            },
        };
    } catch (err) {
        console.log('Error in fluxkartService.handleExistingContact service', err);
        throw err;
    }
};

// Function to update the contact with secondary precedence
const updateContactWithSecondaryPrecedence = async (email: string, phoneNumber: string, sortedContact: contactArray[]) => {
    try {
        const ids = sortedContact?.map((val) => val?.id);
        await updateExistingContactInDB({ linkPrecedence: 'secondary', updatedAt: new Date().toISOString().replace('T', ' ') }, ids);
        const newContacts = (await getContactByColumn(email ? [email] : [], phoneNumber ? [phoneNumber] : [])) || [];
        return {
            contact: {
                primaryContactId: newContacts?.find((val) => val?.linkPrecedence === 'primary')?.id,
                emails: [...new Set(newContacts?.map((val) => val?.email))].filter((val) => val),
                phoneNumbers: [...new Set(newContacts?.map((val) => val?.phoneNumber))]?.filter((val) => val),
                secondaryContactIds: [...new Set(newContacts?.filter((val) => val?.linkPrecedence === 'secondary').map((val) => val?.id))],
            },
        };
    } catch (err) {
        console.log('Error in fluxkartService.handleExistingContact service', err);
        throw err;
    }
};

// Function to create new contact details if new information is found
const createNewContactIfNewInformationFound = async (email: string, phoneNumber: string, contacts: contactArray[]) => {
    try {
        const newContact = contacts?.some((val) => {
            return (val.phoneNumber === phoneNumber || val.email === email) && (val.phoneNumber !== phoneNumber || val.email !== email);
        });
        const primaryContactId = contacts?.find((val) => val?.linkPrecedence === 'primary')?.id;
        if (newContact) {
            const insertSecondaryContact = await insertNewContact({ email, phoneNumber, linkPrecedence: 'secondary', primaryContactId });
            const newContacts = (await getContactByColumn(email ? [email] : [], phoneNumber ? [phoneNumber] : [])) || [];
            return {
                contact: {
                    primaryContactId: newContacts?.find((val) => val?.linkPrecedence === 'primary')?.id,
                    emails: [...new Set(newContacts?.map((val) => val?.email))].filter((val) => val),
                    phoneNumbers: [...new Set(newContacts?.map((val) => val?.phoneNumber))]?.filter((val) => val),
                    secondaryContactIds: [...new Set(newContacts?.filter((val) => val?.linkPrecedence === 'secondary').map((val) => val?.id))],
                },
            };
        }
    } catch (err) {
        console.log('Error in fluxkartService.handleExistingContact service', err);
        throw err;
    }
};
