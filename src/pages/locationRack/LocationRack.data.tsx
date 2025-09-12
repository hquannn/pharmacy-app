import {Field} from "@/types/FieldTypes.ts";

export const fields: Field[] = [
  {
    label: "Position",
    name: "position",
    type: "text",
    placeholder: "Position",
    rules: [{ required: true, message: "Position is required" }],
  },
]