import { ReactNode } from "react";
import type {Rule} from "rc-field-form/lib/interface";

export interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'select-api' | 'date';
  placeholder?: string;
  fetchOptions?: (search: string) => Promise<any[]>;
  showButtonAdd?: boolean,
  disable?: boolean,
  hide?: boolean,
  onAdd?: () => void,
  options?: { label: string; value: string }[];
  rules?: Rule[];
  prefix?: ReactNode
  suffix?: ReactNode
  selectorState?: string;
}
