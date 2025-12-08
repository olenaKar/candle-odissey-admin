import {ProductVariantForm} from "@/components/product-variant-form.tsx";
import {useParams} from "react-router";

const ProductVariantCreatePage = () => {
    const { category } = useParams()

    return (
        <div>
            <h1 className='font-medium text-xl pb-8'>Create a new item ({category})</h1>
            <ProductVariantForm/>
        </div>
    )
}

export default ProductVariantCreatePage