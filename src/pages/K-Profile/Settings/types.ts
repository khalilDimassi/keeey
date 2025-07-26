export type MenuItem = {
    id: string;
    label: string;
    icon: React.ReactNode;
    component: React.ReactNode;
}

export interface PasswordChangePayload {
    current_password: string;
    new_password: string;
}

export interface alertesSettings {
    newMatchingOffer: boolean;
    newContactOffer: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
}

export type NotificationSetting = 'newMatchingOffer'
    | 'newContactOffer'
    | 'email'
    | 'sms'
    | 'push';

export type NotificationIds = 'new-offer-toggle'
    | 'contact-offer-toggle'
    | 'email-toggle'
    | 'sms-toggle'
    | 'push-toggle';

export interface confidalitySettings {
    everyone: boolean;
    platform: boolean;
    contacts: boolean;
    company: boolean;
}

export type ConfidalitySetting = 'everyone'
    | 'platform'
    | 'contacts'
    | 'company';

export type ConfidalityIds = 'everyone-toggle'
    | 'platform-toggle'
    | 'contacts-toggle'
    | 'company-toggle';

export interface supportTicket {
    subject: string;
    body: string;
}