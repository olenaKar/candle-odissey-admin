import type {ColumnDef} from "@tanstack/react-table";
import type {ProductVariantsResponse} from "@/types/candle.ts";
import {ActionsCells} from "@/components/product-variant-action-cells.tsx";

const attributesColumns = (attrs: any) => {
    const res = attrs.map(item => {
        console.log('item ', item)

        return item
    })

    return res
}

export const getProductVariantsColumns = (data: ProductVariantsResponse[]): ColumnDef<ProductVariantsResponse>[] => {
    const firstItem = data[0]
    // console.log(firstItem)
    attributesColumns(firstItem.variantAttributeValues)

    return [
        {
            accessorKey: "id",
            header: "id",
        },
        {
            header: "Image",
            cell: info => {
                const url = info.row.original.media[0] ? info.row.original.media[0].url : ''
                return <img src={url} alt="product" className="w-10 h-10 object-cover rounded-md"/>
            },
        },
        {
            accessorFn: (row) =>
                row.product.productContent.find((p) => p.locale === 'en')?.name || '',
            header: "Name",
        },
        {
            accessorKey: "createdAt",
            header: "CreatedAt",
        },
        {
            accessorKey: "quantity",
            header: "Quantity",
        },
        // ...attributesColumns(firstItem.variantAttributeValues),
        {
            header: "Actions",
            cell: ({ row }) => <ActionsCells row={row}/>,
        },
    ]
}
