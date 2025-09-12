import {InfoBaseContextInterface, ResponseListBaseInterface} from "@/types/CommonTypes.ts";

export interface CustomerInterface {
    id?: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    age: number;
    sex: string;
    address?: string;
    mail: string;
    phoneNo: string;
    updatedDate: string;
    createdDate: string;
}
export type InfoCustomerContextInterface = InfoBaseContextInterface<CustomerInterface>
export type ResponseListCustomerInterface = ResponseListBaseInterface<CustomerInterface>
