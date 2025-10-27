import {useEffect, useState} from "react";
import {fetchCandles} from "@/lib/axios";
import {Spinner} from "@/components/ui/shadcn-io/spinner";
import type {Candle} from "@/types/candle.ts";
import {DataTable} from "@/components/candles-table.tsx";
import {Pagination} from "@/components/pagination.tsx";
import {columns} from "@/components/candle-table-columns-data.tsx";


const Candles = () => {
    const [candles, setCandles] = useState<Candle[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const countRecordsOnPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchCandles({page:currentPage, pageSize: countRecordsOnPage})
                setCandles(res.data)
                setTotalPage(Math.ceil(res.count / countRecordsOnPage))

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        void fetchData()
    }, [currentPage, countRecordsOnPage, totalPage])

    if (loading) return <Spinner />
    return (
        <div className="container mx-auto py-10">
            <div className="pb-6">
                <DataTable columns={columns} data={candles}/>
            </div>

            <Pagination totalPage={totalPage} currentPage={currentPage} onPageChange={setCurrentPage}/>
        </div>
    )
}

export default Candles


