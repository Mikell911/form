export interface API {
    country: string,
    date: string,
    day: string,
    iso: string,
    name: string,
    type: string,
    year: number,
}
export interface FormData {
    firstName?: string;
    lastName?: string;
    email?: string;
    age?: string;
    file?: File | undefined;
    date?: string;
    time?: string;
}



