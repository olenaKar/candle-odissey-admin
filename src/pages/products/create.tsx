
import ProductForm from "@/components/product-form.tsx";
import {useEffect, useState} from "react";
import {fetchCategoryVariants} from "@/lib/axios.ts";
import type {Category} from "@/types/candle.ts";

const ProductsCreate = () => {
    const [categories, setCategories] = useState<Category[] | null>(null)

    useEffect(() => {
        fetchCategories()
        console.log('fetch')
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await fetchCategoryVariants()
            console.log('API response:', data)
            setCategories(data)
        } catch (e) {
            console.error("Error fetch attributes", e)
        }
    }
    return (
        <div>
            <h1 className='font-medium text-xl pb-8'>Create a new product</h1>
            {categories && <ProductForm categories={categories}/>}
        </div>
    )
}

export default ProductsCreate