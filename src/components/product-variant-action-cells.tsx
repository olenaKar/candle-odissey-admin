"use client"

import type {Row} from "@tanstack/react-table";
import {type ProductVariantsResponse, Status} from "@/types/candle.ts";
import {Archive, PencilIcon} from "lucide-react";
import {useNavigate} from "react-router";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {changeProductVariantStatus} from "@/lib/axios.ts";
import {toast} from "sonner";

export const ActionsCells = ({ row }: {row: Row<ProductVariantsResponse>}) => {
    const navigate = useNavigate()
    const { id } = row.original
    const {category} = row.original.product

    const handleArchive = async () => {
        console.log("Archive candle", id)
        await toast.promise(
            changeProductVariantStatus(id, Status.ARCHIVED),
            {
                loading: "Loading...",
                success: "Candle has been archived",
                error: "Error",
            }
        )
        window.location.reload()
    }
    return (
        <div className="flex gap-2">
            <div>
                <PencilIcon className='w-5 h-5 cursor-pointer stroke-green-700 hover:scale-120' onClick={() =>
                    navigate(`/product-variants/${category.slug}/edit/${id}`)}/>
            </div>
            <div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Archive className='w-5 h-5 cursor-pointer stroke-yellow-600 hover:scale-120'/>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to archive this candle?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You can return it back later.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleArchive}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

        </div>
    )
}