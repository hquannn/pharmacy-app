
export interface InventoryMed {
    "id": string,
    "quantity": number,
    "expDate": string,
    "mfgDate": string,
    "isGettingExpire": string,
    locationRack: {
        id: string
        position: string
    },
    medicine: {
        "id": string,
        "name": string,
        "unit": any,
        "price": number,
        "categoryId": string,
        "createdDate": string,
        "createdBy": string,
        "updatedDate": string,
        "updatedBy": string,
    }
}

export interface CartItem extends InventoryMed {
    quantity: number;
}
