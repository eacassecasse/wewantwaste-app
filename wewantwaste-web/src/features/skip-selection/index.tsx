import { useState, useMemo, useCallback } from "react";
import { AlertCircle, PackageSearch } from "lucide-react";
import { Button } from "../../components/ui/button";
import useApi from "../../hooks/use-api";
import { SkipFilters } from "./components/skip-filters";
import { SkipSort } from "./components/skip-sort";
import { SkipGrid } from "./components/skip-grid";
import { SkipPagination } from "./components/skip-pagination";
import { type SkipProps } from "./components/skip-card";
import { Skeleton } from "../../components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useProgressStore } from "../../stores/useProgressStore";

const ITEMS_PER_PAGE = 8;

const SkipPage = () => {
  const { fetch } = useApi();
  const {
    data: skips = [],
    isLoading,
    error,
  } = useQuery<SkipProps[]>({
    queryKey: ["skips", "NR32", "Lowestoft"],
    queryFn: () => fetch("/skips/by-location?postcode=NR32&area=Lowestoft"),
    select: (data: SkipProps[]) =>
      data.map((skip: any) => ({
        ...skip,
        size: `${skip.size} Yard`,
        image_url: skip.image_url || getSkipImage(`${skip.size} Yard`),
      })),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("latest");
  const address = useProgressStore((state) => state.address);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["all"]);

  const filteredSkips = skips.filter((skip) => {
    if (selectedFilters.length === 0) return true;

    return selectedFilters.some((filter) => {
      if (filter === "road_allowed") return skip.allowed_on_road;
      return skip.size.toLowerCase().replace(" ", "_") === filter;
    });
  });

  const processedSkips = useMemo(() => {
    let result = [...skips];

    if (!selectedFilters.includes("all")) {
      if (selectedFilters.includes("road_allowed")) {
        result = result.filter((skip) => skip.allowed_on_road);
      } else {
        selectedFilters.forEach((filterOption) => {
          const sizeFilter = parseInt(filterOption);

          result.push(
            result.filter((skip) => skip.size.includes(`${sizeFilter} Yard`))
          );
        });
      }
    }

    switch (sortOption) {
      case "latest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "price_low":
        result.sort((a, b) => a.price_before_vat - b.price_before_vat);
        break;
      case "price_high":
        result.sort((a, b) => b.price_before_vat - a.price_before_vat);
        break;
    }

    return result;
  }, [skips, sortOption, selectedFilters]);

  const paginatedSkips = useMemo(
    () =>
      processedSkips.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [processedSkips, currentPage]
  );

  const totalPages = Math.ceil(processedSkips.length / ITEMS_PER_PAGE);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document.getElementById("skip-results")?.scrollTo(0, 0);
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 text-warm-orange-600">
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
        <PackageSearch className="h-12 w-12 text-medium-gray-400" />
        <p className="text-lg">No skips available matching your criteria</p>
        <Button
          variant="outline"
          onClick={() => {
            setFilterOption("all");
            setSortOption("latest");
          }}
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-screen overflow-hidden p-0">
      <div className="bg-background p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {isLoading ? (
            <Skeleton className="h-5 w-32" />
          ) : (
            <p className="text-sm">
              Found {processedSkips.length} in {address?.fullAddress}
            </p>
          )}

          <div className="flex flex-row gap-3">
            <SkipSort
              sortOption={sortOption}
              setSortOption={setSortOption}
              loading={isLoading}
            />
          </div>
        </div>

        <SkipFilters
          skips={processedSkips}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
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
    "4 Yard":
      "https://images.unsplash.com/photo-1715066660662-90aa88234e04?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "6 Yard":
      "https://images.unsplash.com/photo-1539558457237-404a2ecf3a22?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "8 Yard":
      "https://images.unsplash.com/photo-1577010768912-19874598a38e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "10 Yard":
      "https://images.unsplash.com/photo-1715066660662-90aa88234e04?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "12 Yard":
      "https://images.unsplash.com/photo-1539558457237-404a2ecf3a22?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "14 Yard":
      "https://images.unsplash.com/photo-1577010768912-19874598a38e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "16 Yard":
      "https://images.unsplash.com/photo-1715066660662-90aa88234e04?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "20 Yard":
      "https://images.unsplash.com/photo-1539558457237-404a2ecf3a22?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "40 Yard":
      "https://images.unsplash.com/photo-1577010768912-19874598a38e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };
  return (
    imageMap[size] ||
    "https://images.unsplash.com/photo-1592618220264-00ba04c4b8ec?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
}
