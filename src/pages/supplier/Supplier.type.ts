
export type TInfo = {
    id: string | null;
    name?: string;
    address?: string;
    phoneNo?: string;
    mail?: string;
    createdDate?: string;
    createdBy?: string;
    updatedDate?: string;
    updatedBy?: string;
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