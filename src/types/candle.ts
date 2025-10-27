
type Locale = 'en' | 'ru' | 'ua';

export interface ProductContent {
    id: number;
    name: string;
    description: string;
    locale: Locale;
    productId: number;
}

export type CandlePayload = {
    content: {
        en: { name: string; description: string };
        ru: { name: string; description: string };
        ua: { name: string; description: string };
    };
    quantity: number;
    price: number;
    media: {
        url: string;
        sortOrder: number;
        altText?: string;
        meta?: string;
    }[];
    aroma: string;
    color: string;
    wick: string;
    size: string;
};


export type Media = {
    id: number;
    url: string;
    type: 'image' | 'video'; // можно уточнить
    altText: string;
    productId: number;
}

export interface Product {
    id: number;
    createdAt: string;
    price: number;
    productContent: ProductContent[];
    quantity: number;
    slug: string;
    status: 'ACTIVE' | 'INACTIVE';
    type: 'CANDLE' | string;
    updatedAt: string;
    media: Media[]
}

export interface Candle {
    id: number;
    aroma: string;
    color: string;
    createdAt: string;
    updatedAt: string;
    size: string;
    wick: string;
    quantity: number;
    price: number;
    productId: number;
    product: Product;
}