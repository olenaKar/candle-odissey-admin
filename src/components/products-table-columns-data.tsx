import type {ColumnDef} from "@tanstack/react-table";
import type {ProductsResponseItem} from "@/types/candle.ts";
import {ActionsCells} from "@/components/candles-table-columns.tsx";

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
    {
        header: "Actions",
        cell: ({ row }) => <ActionsCells row={row}/>,
    },
]