export interface Project{
id : string;
projectName : string;
billingType : BillingType;
currency : Currency;
contactName : string;
customerName : string;
projectStatus : projectStatus;
customerId? : string;
contactId? : string;
}

export enum projectStatus{
    Onboarded = "Onboarded",
    Available = "Available",
    Replacement = "Replacement",
    NeedToHire = "NeedToHire"
}

export enum Currency
{
INR = "INR",
USD = "USD"

}

export enum BillingType
{
    Hourly ='Hourly',
    Monthly = 'Monthly'
}

