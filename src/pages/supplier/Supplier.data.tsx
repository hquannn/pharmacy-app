import {Field} from "@/types/FieldTypes.ts";

export const fields: Field[] = [
  {
    label: "Name",
    name: "name",
    type: "text",
    placeholder: "Name",
    rules: [{ required: true, message: "Name is required" }],
  },
  {
    label: "Address",
    name: "address",
    type: "text",
    placeholder: "Address",
    rules: [{ required: true, message: "Address is required" }],
  },
  {
    label: "Phone Number",
    name: "phoneNo",
    type: "text",
    placeholder: "Phone Number",
    rules: [{ required: true, message: "Phone number is required" }],
  },
  {
    label: "Email",
    name: "mail",
    type: "email",
    placeholder: "Email",
    rules: [{ type: "email", message: "Invalid email" }],
  },
]