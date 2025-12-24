import {ProductVariantForm} from "@/components/product-variant-form.tsx";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {fetchProductVariantById} from "@/lib/axios.ts";
import type {Media, ProductVariantsResponse} from "@/types/candle.ts";

const ProductVariantEditPage = () => {
    const { id } = useParams()
    const [productVariant, setProductVariant] = useState<ProductVariantsResponse | null>(null)
    const [loading, setLoading] = useState(true)

    const getProductVariantFormValues = (p: ProductVariantsResponse) => {
        const media: Media[] = p?.media?.map(m => ({
            id: m.id,
            url: m.url,
            type: m.type,
            altText: m.altText,
            productId: m.productId,
        })) ?? [];

        const attributes = p.variantAttributeValues.reduce((acc, v) =>
            ({...acc, [v.attributeValue.attribute.name]: v.attributeValueId}), {})

        return {
            media,
            images: [],
            product: +p.product.id,
            quantity: p.quantity,
            prices: p.prices,
            attributes
        }
    }


    useEffect(() => {
        const fetchData = async (id: string) => {
            try {
                const data = await fetchProductVariantById(+id)
                console.log("candleId API response:", data)
                setProductVariant(data)
            } catch (err) {
                console.error(err)
            }
            finally {
                setLoading(false)
            }
        }
        if (id) {
            fetchData(id)
        }

    }, [id])

    if (loading) return <div>Loading...</div>
    if (!productVariant) return <div>Not found</div>

    return (
        <div>
            <h1 className='font-medium text-xl pb-8'>Edit candle</h1>
            <ProductVariantForm defaultValues={getProductVariantFormValues(productVariant)}/>
        </div>
    )
}

export default ProductVariantEditPage