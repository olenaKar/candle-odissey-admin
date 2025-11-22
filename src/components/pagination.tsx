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
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ totalPages, currentPage, onPageChange}: Props) {
    const getVisiblePages = () => {
        if (currentPage === 1 || currentPage === 2) {
            if(totalPages >= 3) {
                return [1, 2, 3];
            }
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }
        if (currentPage === totalPages) {
            return [totalPages - 2, totalPages - 1, totalPages];
        }
        return [currentPage - 1, currentPage, currentPage + 1];
    }

    return (
        <UiPagination>
            <PaginationContent>
                {totalPages > 1 &&
                    (<PaginationItem>
                        <PaginationPrevious href="#" className={currentPage === 1 ? "pointer-events-none opacity-50 cursor-pointer " : "cursor-pointer"} onClick={() => onPageChange(currentPage - 1)}/>
                    </PaginationItem>)
                }

                {getVisiblePages().map((page) => (
                        <PaginationItem>
                            <PaginationLink className="cursor-pointer" onClick={() => onPageChange(page)} isActive={currentPage === page}>{page}</PaginationLink>
                        </PaginationItem>
                    )
                )}
                {totalPages - currentPage > 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {totalPages > 1 &&
                    (<PaginationItem>
                        <PaginationNext href="#" className={currentPage === totalPages ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"} onClick={() => onPageChange(currentPage + 1)}/>
                    </PaginationItem>)
                }
            </PaginationContent>
        </UiPagination>
    )
}
