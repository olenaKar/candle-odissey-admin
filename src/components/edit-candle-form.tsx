import {CandleForm} from "@/components/candle-form.tsx";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {fetchCandleById} from "@/lib/axios.ts";
import type {Candle, Media} from "@/types/candle.ts";

const CandleEditPage = () => {
    const { id } = useParams()
    const [candle, setCandle] = useState<Candle | null>(null)
    const [loading, setLoading] = useState(true)

    const getContent = (locale: "en" | "ru" | "ua") => {
        const content = candle?.product.productContent.find(p => p.locale === locale)
        return {
            name: content?.name ?? "",
            description: content?.description ?? "",
        };
    };

    const media: Media[] = candle?.product.media?.map(m => ({
        id: m.id,
        url: m.url,
        type: m.type,
        altText: m.altText,
        productId: m.productId,
    })) ?? [];

    const candleToFormValues = {
        content: {
            en: getContent("en"),
            ru: getContent("ru"),
            ua: getContent("ua"),
        },
        images: [],
        media,
        quantity: candle?.product.quantity ?? 0,
        price: candle?.product.price ?? 0,
        aroma: candle?.aroma ?? '',
        color: candle?.color ?? '',
        wick: candle?.wick ?? '',
        size: candle?.size ?? '',
    }


    useEffect(() => {
        const fetchData = async (id: string) => {
            try {
                const data = await fetchCandleById(id)
                console.log("candleId API response:", data)
                setCandle(data)
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
    if (!candle) return <div>Candle not found</div>
    return (
        <div>
            <h1 className='font-medium text-xl pb-8'>Edit candle</h1>
            <CandleForm defaultValues={candleToFormValues}/>
        </div>
    )
}

export default CandleEditPage