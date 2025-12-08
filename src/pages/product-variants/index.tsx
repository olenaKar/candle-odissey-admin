import {useEffect, useState} from "react";
import {fetchProductVariants} from "@/lib/axios";
import {Spinner} from "@/components/ui/shadcn-io/spinner";
import type {ProductVariantsResponse} from "@/types/candle.ts";
import {DataTable} from "@/components/candles-table.tsx";
import {Pagination} from "@/components/pagination.tsx";
import {getProductVariantsColumns} from "@/components/product-variants-table-columns-data.tsx";
import {DEFAULT_PAGE_SIZE} from "@/constants/global.ts";
import {SearchForm} from "@/components/search-form.tsx";
import {useParams} from "react-router";


const ProductVariants = () => {
    const { category } = useParams()

    const [productVariants, setProductVariants] = useState<ProductVariantsResponse[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        void fetchData(searchQuery)
    }, [currentPage, searchQuery])

    const fetchData = async (query?: string) => {
        try {
            setLoading(true)
            const res = await fetchProductVariants({
                category,
                page: currentPage,
                pageSize: DEFAULT_PAGE_SIZE,
                query,
            })
            setProductVariants(res.data)
            setTotalPages(Math.ceil(res.count / DEFAULT_PAGE_SIZE))
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (query: string) => {
        // setSearching(true)
        setSearchQuery(query)
        setCurrentPage(1)
        // setSearching(false)
    }

    if (loading) return <Spinner />
    return (
        <div className="container mx-auto py-10">
            <SearchForm onSearch={handleSearch} loading={loading} />
            <div className="pb-6">
                <DataTable columns={getProductVariantsColumns(productVariants)} data={productVariants}/>
            </div>

            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}/>
        </div>
    )
}

export default ProductVariants


