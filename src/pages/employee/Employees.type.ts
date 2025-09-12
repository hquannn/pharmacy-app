import {InfoBaseContextInterface, ResponseListBaseInterface} from "@/types/CommonTypes.ts";
import {a} from "vite/dist/node/types.d-aGj9QkWt";

export interface EmployeeInterface {
    id?: string;
    username: string;
    role: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: a;
    age: number;
    sex: string;
    type: string;
    address: string;
    mail: string;
    phoneNo: string;
    updatedDate: string;
    createdDate: string;
    salary: number;
}
export type InfoEmployeeContextInterface = InfoBaseContextInterface<EmployeeInterface>
export type ResponseListEmployeeInterface = ResponseListBaseInterface<EmployeeInterface>
