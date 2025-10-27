import type {ColumnDef} from "@tanstack/react-table";
import type {Candle} from "@/types/candle.ts";
import {ActionsCells} from "@/components/candles-table-columns.tsx";

export const columns: ColumnDef<Candle>[] = [
    {
        accessorKey: "id",
        header: "id",
    },
    {
        header: "Image",
        cell: info => {
            const url = info.row.original.product.media[0].url
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
        accessorKey: "product.quantity",
        header: "Quantity",
    },
    {
        header: "Actions",
        cell: ({ row }) => <ActionsCells row={row}/>,
},
]