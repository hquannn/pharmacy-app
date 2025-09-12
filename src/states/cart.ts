import { atom } from "jotai"
import {CartItem} from "@/types/CartTypes.ts";

export const stateCart = atom<CartItem[]>([])
