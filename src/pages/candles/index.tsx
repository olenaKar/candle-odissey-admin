import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    // TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useEffect, useState} from "react";
import {fetchCandles} from "@/lib/axios";
import {Spinner} from "@/components/ui/shadcn-io/spinner";
import type {Candle} from "@/types/candle.ts";

const Candles = () => {
    const [candles, setCandles] = useState<Candle[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCandles()
                console.log("candles API response:", data)
                setCandles(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        void fetchData()
    }, [])

    if (loading) return <Spinner />
    return (
        <Table>
            <TableCaption>A list of candles.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Created at</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {candles.map((candle: Candle) => (
                    <TableRow key={candle.id}>
                        <TableCell className="font-medium">{candle.id}</TableCell>
                        <TableCell>{candle.name}</TableCell>
                        <TableCell>{candle.createdAt}</TableCell>
                        <TableCell className="text-right">{candle.quantity}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            {/*<TableFooter>*/}
            {/*    <TableRow>*/}
            {/*        <TableCell colSpan={3}>Total</TableCell>*/}
            {/*        <TableCell className="text-right">$2,500.00</TableCell>*/}
            {/*    </TableRow>*/}
            {/*</TableFooter>*/}
        </Table>
    )
}

export default Candles


