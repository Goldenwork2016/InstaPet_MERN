
import axios from 'axios';

export interface IOptions {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body: any;
    headers: any;
}

export async function tryCatchStandarize({ url, method, body, headers }: IOptions) {
    try {
        const { data } = await axios({
            url,
            method,
            data: body,
            headers
        });
        return [data, null];
    } catch (error) {
        console.error(error);
        return [null, error];
    }
}