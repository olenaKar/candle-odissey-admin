import type {ColumnDef} from "@tanstack/react-table";
import type {ProductsResponseItem} from "@/types/candle.ts";
// import {ProductActionsCells} from "@/components/product-action-cells.tsx";

export const columnsProducts: ColumnDef<ProductsResponseItem>[] = [
    {
        accessorKey: "id",
        header: "id",
    },
    {
        accessorFn: (row) =>
            row.productContent?.find((p) => p.locale === 'en')?.name || '',

        header: "Name",
    },
    {
        accessorKey: "createdAt",
        header: "CreatedAt",
    },
    // {
    //     header: "Actions",
    //     cell: ({ row }) => <ProductActionsCells row={row}/>,
    // },
]