import axios from 'axios'
import type {Candle, CandlePayload} from "@/types/candle.ts";

const BASE_URL = import.meta.env.VITE_API_URL

export async function fetchCandles({page, pageSize}: { page: number, pageSize: number}) {
    try {
        const response = await axios.get<{ data: Candle[], count: number  }>(`${BASE_URL}/candles?page=${page}&pageSize=${pageSize}`)
        return response.data
    } catch (err) {
        console.error('Failed to fetch candles', err)
        throw err
    }
}
export const createCandle = async (data: CandlePayload) => {
    return await axios.post(`${BASE_URL}/candles`, data)
}

export const updateCandle = async (id: string, data: CandlePayload) => {
    return await axios.put(`${BASE_URL}/candles/${id}`, data)
}

export const changeCandleStatus = async (id: number, status: string) => {
    return await axios.patch(`${BASE_URL}/candles/${id}/change-status`, {status})
}

export const fetchCandleById = async (id: number | string) => {
    try {
        const response = await axios.get<Candle>(`${BASE_URL}/candles/${id}`)
        return response.data
    } catch (err) {
        console.error('Failed to fetch candle', err)
        throw err
    }
}
