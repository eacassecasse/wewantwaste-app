import { useState, useMemo, useCallback } from 'react';
import { AlertCircle, PackageSearch } from "lucide-react";
import { Button } from "../../components/ui/button";
import useApi from '../../hooks/use-api';
import { SkipFilters } from "./components/skip-filters";
import { SkipSort } from "./components/skip-sort";
import { SkipGrid } from "./components/skip-grid";
import { SkipPagination } from "./components/skip-pagination";
import { type SkipProps } from "./components/skip-card";
import { Skeleton } from '../../components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { useProgressStore } from '../../stores/useProgressStore';

const ITEMS_PER_PAGE = 8;

const SkipPage = () => {
    const { fetch } = useApi();
    const { data: skips = [], isLoading, error } = useQuery<SkipProps[]>({
        queryKey: ['skips', "NR32", "Lowestoft"],
        queryFn: () => fetch("/skips/by-location?postcode=NR32&area=Lowestoft"),
        select: (data: SkipProps[]) => data.map((skip: any) => ({
            ...skip,
            size: `${skip.size} Yard`,
            img_src: skip.img_src || getSkipImage(`${skip.size} Yard`)
        })),
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState("latest");
    const [filterOption, setFilterOption] = useState("all");
    const address = useProgressStore((state) => state.address)

    const processedSkips = useMemo(() => {
        let result = [...skips];

        if (filterOption !== "all") {
            if (filterOption === "road_allowed") {
                result = result.filter(skip => skip.allowed_on_road);
            } else {
                const sizeFilter = parseInt(filterOption);
                result = result.filter(skip => skip.size.includes(`${sizeFilter} Yard`));
            }
        }

        switch (sortOption) {
            case "latest":
                result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case "oldest":
                result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                break;
            case "price_low":
                result.sort((a, b) => a.price_before_vat - b.price_before_vat);
                break;
            case "price_high":
                result.sort((a, b) => b.price_before_vat - a.price_before_vat);
                break;
        }

        return result;
    }, [skips, sortOption, filterOption]);

    const paginatedSkips = useMemo(() => (
        processedSkips.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        )
    ), [processedSkips, currentPage]);

    const totalPages = Math.ceil(processedSkips.length / ITEMS_PER_PAGE);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        document.getElementById('skip-results')?.scrollTo(0, 0);
    }, []);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4 text-destructive">
                <AlertCircle className="h-12 w-12" />
                <p className="text-lg text-center max-w-md">{error.message}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    }

    if (!isLoading && processedSkips.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                <PackageSearch className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg">No skips available matching your criteria</p>
                <Button
                    variant="outline"
                    onClick={() => {
                        setFilterOption('all');
                        setSortOption('latest');
                    }}
                >
                    Reset Filters
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-full max-w-screen overflow-x-hidden">
            <div className="bg-background p-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    {isLoading ? (
                        <Skeleton className="h-5 w-32" />
                    ) : (
                        <p className="text-sm">Found {processedSkips.length} in {address?.fullAddress}
                        </p>
                    )}


                    <div className="flex flex-row gap-3">
                        <SkipSort
                            sortOption={sortOption}
                            setSortOption={setSortOption}
                            loading={isLoading}
                        />

                        {/* Filter dropdown can be similarly extracted */}
                    </div>
                </div>

                <SkipFilters
                    skips={processedSkips}
                    filterOption={filterOption}
                    setFilterOption={setFilterOption}
                    loading={isLoading}
                />
            </div>

            <SkipGrid skips={paginatedSkips} loading={isLoading} />

            <SkipPagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                loading={isLoading}
            />
        </div>
    );
};

export default SkipPage;

// Helper function (can be moved to separate file)
function getSkipImage(size: string): string {
    const imageMap: Record<string, string> = {
        "4 Yard": "https://unsplash.com/photos/a-green-trash-can-with-graffiti-on-it-vq6-y04qI1M",
        "6 Yard": "https://unsplash.com/photos/three-red-and-green-containers-beside-graffiti-wall-cr0RdG_rU4A",
        "8 Yard": "https://unsplash.com/photos/two-black-trash-bins-beside-wall-UBU_pM78yxQ",
        "10 Yard": "https://unsplash.com/photos/a-green-trash-can-with-graffiti-on-it-vq6-y04qI1M",
        "12 Yard": "https://unsplash.com/photos/three-red-and-green-containers-beside-graffiti-wall-cr0RdG_rU4A",
        "14 Yard": "https://unsplash.com/photos/two-black-trash-bins-beside-wall-UBU_pM78yxQ",
        "16 Yard": "https://unsplash.com/photos/a-green-trash-can-with-graffiti-on-it-vq6-y04qI1M",
        "20 Yard": "https://unsplash.com/photos/three-red-and-green-containers-beside-graffiti-wall-cr0RdG_rU4A",
        "40 Yard": "https://unsplash.com/photos/two-black-trash-bins-beside-wall-UBU_pM78yxQ",
    };
    return imageMap[size] || "https://unsplash.com/photos/white-printer-paper-on-black-plastic-trash-bin-uzf0WWBJ9wo";
}