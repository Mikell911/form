import axios, {AxiosError, AxiosResponse} from 'axios';
import {API, FormData} from "../common/types";

export async function fetch(country: string, year: number, type: string): Promise<API[]> {
    const url = `https://api.api-ninjas.com/v1/holidays?country=${country}&year=${year}&type=${type}`
    const apiKey = '8DX8eEe67njS1lbThFsdSw==rQQNpQ8PYbPZBjrx'

    try {
        const response = await axios.get(url, {
            headers: {
                'X-Api-Key': apiKey,
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export const submitFormData = async (FormData: FormData): Promise<void> => {
    try {
        const response: AxiosResponse = await axios.post('http://letsworkout.pl/submit', FormData)
        console.log('Success:', response.data)
    } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response) {
            console.error('Server responded with error status:', axiosError.response.status)
            console.error('Error data:', axiosError.response.data)
        } else if (axiosError.request) {
            console.error('No response received from the server')
        } else {
            console.error('Error during request setup:', axiosError.message)
        }
    }
}