import {useParams} from "react-router";
import {useEffect, useState} from "react";
import type {ProductsResponseItem} from "@/types/candle.ts";
import {fetchProducts} from "@/lib/axios.ts";
import {DEFAULT_PAGE_SIZE} from "@/constants/global.ts";
import {Spinner} from "@/components/ui/shadcn-io/spinner";
import {SearchForm} from "@/components/search-form.tsx";
import {DataTable} from "@/components/candles-table.tsx";
import {Pagination} from "@/components/pagination.tsx";
import {columnsProducts} from "@/components/products-table-columns-data.tsx";

const Products = () => {
    const { category } = useParams()

    const [products, setProducts] = useState<ProductsResponseItem[]>([])
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
            const res = await fetchProducts({
                category,
                page: currentPage,
                pageSize: DEFAULT_PAGE_SIZE,
                query,
            })

            setProducts(res.data)
            setTotalPages(Math.ceil(res.count / DEFAULT_PAGE_SIZE))
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    if (loading) return <Spinner />
    return (
        <div className="container mx-auto py-10">
            <SearchForm onSearch={handleSearch} loading={loading} value={searchQuery} />
            <div className="pb-6">
                <DataTable columns={columnsProducts} data={products}/>
            </div>

            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}/>
        </div>
    )
}

export default Products