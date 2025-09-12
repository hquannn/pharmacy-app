export type TInfo = {
    id: string | null;
    position: string;
    createdDate: string;
    createdBy?: string;
    updatedDate?: string | null;
    updatedBy?: string | null;
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

export type TMutationResponse = {
    data: TInfo | null;
};