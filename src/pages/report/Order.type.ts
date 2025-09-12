export type TInfo = {
    id: string | null;
    totalAmount: number;
    orderItems: [];
    type: string;
    code: string;
    createdDate: string;
    createdBy: string;
    refundMedicineName: 'string' | null;
};

export type TGetData = {
    content: TInfo[];
    size: number;
    number: number;
    totalElement: number;
};

export type TGetResponse = {
    data: TGetData | null;
};