import type {ColumnDef} from "@tanstack/react-table";
import type {ProductVariantsResponse} from "@/types/candle.ts";
import {ActionsCells} from "@/components/product-variant-action-cells.tsx";

export const getProductVariantsColumns = (): ColumnDef<ProductVariantsResponse>[] => {
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
            accessorFn: (row) =>
                row.variantAttributeValues.map((attr) => attr.attributeValue.value).join(', '),
            header: "Attributes",
        },
        {
            accessorKey: "quantity",
            header: "Quantity",
        },
        {
            accessorKey: "createdAt",
            header: "CreatedAt",
            cell: ({ getValue }) => {
                const date = new Date(getValue() as string);
                return date.toLocaleDateString("ru-RU");
            },
        },
        {
            header: "Actions",
            cell: ({ row }) => <ActionsCells row={row}/>,
        },
    ]
}
