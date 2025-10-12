import axios from 'axios'
import type {Candle} from "@/types/candle.ts";

const BASE_URL = import.meta.env.VITE_API_URL

export async function fetchCandles() {
    try {
        const response = await axios.get<Candle[]>(`${BASE_URL}/candles`)
        return response.data
    } catch (err) {
        console.error('Failed to fetch candles', err)
        throw err
    }
}
export const createCandle = async () => {

}
