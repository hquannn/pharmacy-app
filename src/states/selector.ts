import { atom } from "jotai"

export const atomSelector = atom<any>({
  categories: [],
  meds: [],
  suppliers: [],
  locationRacks: [],
})
