import {
    Pagination as UiPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

type Props = {
    totalPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ totalPage, currentPage, onPageChange}: Props) {
    const getVisiblePages = () => {
        if (currentPage === 1 || currentPage === 2) {
            if(totalPage >= 3) {
                return [1, 2, 3];
            }
            return Array.from({ length: totalPage }, (_, index) => index + 1);
        }
        if (currentPage === totalPage) {
            return [totalPage - 2, totalPage - 1, totalPage];
        }
        return [currentPage - 1, currentPage, currentPage + 1];
    }

    return (
        <UiPagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" className={currentPage === 1 ? "pointer-events-none opacity-50 cursor-pointer " : "cursor-pointer"} onClick={() => onPageChange(currentPage - 1)}/>
                </PaginationItem>
                {getVisiblePages().map((page) => (
                        <PaginationItem>
                            <PaginationLink className="cursor-pointer" onClick={() => onPageChange(page)} isActive={currentPage === page}>{page}</PaginationLink>
                        </PaginationItem>
                    )
                )}
                {totalPage - currentPage > 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationNext href="#" className={currentPage === totalPage ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"} onClick={() => onPageChange(currentPage + 1)}/>
                </PaginationItem>
            </PaginationContent>
        </UiPagination>
    )
}
