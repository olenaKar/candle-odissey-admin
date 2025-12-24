import axios from 'axios'
import {
    type ProductVariantPayload, type CategoriesResponse,
    type CategoryAttributesResponse, type ProductPayload, type ProductsResponseItem,
    type ProductVariant,
    type ProductVariantsResponse, Status
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

export async function fetchProductsByCategory(categoryId: number) {
    try {
        const response = await axios.get(`${BASE_URL}/products/category/${categoryId}`)
        return response.data
    } catch (error) {
        console.error("Failed to fetch products by category", error)
        throw error
    }
}

export async function fetchProductVariantById(id: number) {
    try {
        const response = await axios.get(`${BASE_URL}/variants/${id}`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error("Failed to fetch product by id", error)
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

    console.log('data ', data)
    return data
}
export async function fetchCategoryVariants(): Promise<CategoriesResponse> {
    const {data} = await axios.get(`${BASE_URL}/categories`)
    return data
}

export const createProductVariant = async (data: ProductVariantPayload) => {
    return await axios.post(`${BASE_URL}/variants`, data)
}

export const updateCandle = async (id: number, data: ProductVariantPayload) => {
    return await axios.put(`${BASE_URL}/variants/${id}`, data)
}

export const changeProductVariantStatus = async (id: number, status: Status) => {
    return await axios.patch(`${BASE_URL}/variants/${id}/change-status`, {status})
}

export const fetchCandleById = async (id: number | string) => {
    try {
        const response = await axios.get<ProductVariant>(`${BASE_URL}/candles/${id}`)
        return response.data
    } catch (err) {
        console.error('Failed to fetch product variant', err)
        throw err
    }
}

export const createProduct = async (data: ProductPayload) => {
    return await axios.post(`${BASE_URL}/products`, data)
}