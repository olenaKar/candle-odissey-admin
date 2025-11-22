import axios from 'axios'
import type {
    CandlePayload, CategoriesResponse,
    CategoryAttributesResponse, ProductPayload, ProductsResponseItem,
    ProductVariant,
    ProductVariantsResponse
} from "@/types/candle.ts";

const BASE_URL = import.meta.env.VITE_API_URL

export async function fetchProductVariants({page, pageSize, query, category}: { page: number, pageSize: number, query?: string, category?: string}) {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        })
        if (query) params.append("query", query)
        if (category) params.append("category", category)

        const response = await axios.get<{ data: ProductVariantsResponse[], count: number }>(`${BASE_URL}/variants?${params.toString()}`)

        return response.data
    } catch (err) {
        console.error('Failed to fetch product variants', err)
        throw err
    }
}

export async function fetchProducts({page, pageSize, query, category}: { page: number, pageSize: number, query?: string, category?: string}) {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        })
        if (query) params.append("query", query)
        if (category) params.append("category", category)

        const response = await axios.get<{ data: ProductsResponseItem[], count: number }>(`${BASE_URL}/products?${params.toString()}`)

        return response.data
    } catch (err) {
        console.error('Failed to fetch products', err)
        throw err
    }
}

export async function fetchCategoryAttributes({slug}: {slug: string}): Promise<CategoryAttributesResponse> {
    const {data} = await axios.get(`${BASE_URL}/categories/${slug}/attributes`)
    return data
}
export async function fetchCategoryVariants(): Promise<CategoriesResponse> {
    const {data} = await axios.get(`${BASE_URL}/categories`)
    return data
}
export const createCandle = async (data: CandlePayload) => {
    return await axios.post(`${BASE_URL}/candles`, data)
}

export const updateCandle = async (id: number, data: CandlePayload) => {
    return await axios.put(`${BASE_URL}/candles/${id}`, data)
}

export const changeCandleStatus = async (id: number, status: string) => {
    return await axios.patch(`${BASE_URL}/candles/${id}/change-status`, {status})
}

export const fetchCandleById = async (id: number | string) => {
    try {
        const response = await axios.get<ProductVariant>(`${BASE_URL}/candles/${id}`)
        return response.data
    } catch (err) {
        console.error('Failed to fetch candle', err)
        throw err
    }
}

export const createProduct = async (data: ProductPayload) => {
    return await axios.post(`${BASE_URL}/products`, data)
}