
export interface Customer{
    id: string;
    appUserId: string;
    name: string;
    email: string;
    phoneNumber: string;
    appUser: any;
    contactsList: any[];
}

export interface CustomerData{
    name: string;
    email: string;
    phoneNumber: string;
}