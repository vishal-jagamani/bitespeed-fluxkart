export interface contactArray {
    id: number;
    email: string | null;
    phoneNumber: string | null;
    linkedId: number | null;
    linkPrecedence: string;
    createdAt: string;
    updatedAt: Date | string;
    deletedAt: string | null;
}

export interface identifyPayload {
    email?: string;
    phoneNumber?: string;
}

export interface insertNewContactInterface {
    email?: string;
    phoneNumber?: string;
    linkPrecedence?: string;
    primaryContactId?: number;
}

export interface Supabase_Config_Object {
    SUPABASE_CLIENT_API_KEY: string;
    SUPABASE_URL: string;
}

export interface error {
    stack: string;
    name: string;
    status: number;
    message: string;
    cause: string;
}
