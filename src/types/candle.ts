
type Locale = 'en' | 'ru' | 'ua';

export interface AttributeValue {
    id: number;
    value: string;
}

export interface Attribute {
    id: number;
    name: string;
    attributeValues: AttributeValue[];
}

export type CategoryAttributesResponse =  Attribute[]

export interface ProductContent {
    id: number;
    name: string;
    description: string;
    locale: Locale;
    productId: number;
}

export type CategoriesResponse = Category[]

export type ProductVariantPayload = {
    quantity: number;
    price: number;
    productId: number;
    media: {
        url: string;
        sortOrder: number;
        altText?: string;
        meta?: string;
    }[];
    attributes: number[];
};

export type ProductPayload = {
    categoryId: number;
    content: {
        en: { name: string; description: string };
        ru: { name: string; description: string };
        ua: { name: string; description: string };
    },
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
    productContent: ProductContent[];
    status: 'ACTIVE' | 'INACTIVE';
    updatedAt: string;
}

export interface ProductVariant {
    id: number;
    createdAt: string;
    updatedAt: string;
    sku: string
    quantity: number;
    price: number;
    productId: number;
}

export interface Category {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    slug: string;
}

export type ProductVariantsResponse = ProductVariant & {
    product: Product & {
        category: Category;
        productContent: ProductContent[];
    }
    media: Media[];
    variantAttributeValues: {
        productVariantId: number
        attributeValueId: number
         attributeValue: {
             id: number
             value: string;
             attribute: Attribute
         };
    }[]
}

export type ProductsResponseItem =
     Product & {
        categoryId: Category["id"];
        productContent: ProductContent[];
    }
