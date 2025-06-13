import { useMemo } from "react";
import { Button } from "../../../components/ui/button";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { Skeleton } from "../../../components/ui/skeleton";
import type { SkipProps } from "./skip-card";

export const SkipFilters = ({
  skips,
  selectedFilters,
  setSelectedFilters,
  loading,
}: {
  skips: SkipProps[];
  selectedFilters: string[]; // Now an array
  setSelectedFilters: (filters: string[]) => void;
  loading: boolean;
}) => {
  const availableFilters = useMemo(() => {
    const sizes = new Set<string>();
    let hasRoadAllowed = false;

    skips.forEach((skip) => {
      sizes.add(skip.size);
      if (skip.allowed_on_road) hasRoadAllowed = true;
    });

    return {
      sizes: Array.from(sizes).sort(),
      hasRoadAllowed,
    };
  }, [skips]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(
      selectedFilters.includes(filter)
        ? selectedFilters.filter((f) => f !== filter)
        : [...selectedFilters, filter]
    );
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex space-x-2 pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full max-w-screen">
      <div className="flex space-x-2 pb-2">
        <Button
          key="all"
          variant={selectedFilters.length === 0 ? "default" : "outline"}
          className="whitespace-nowrap rounded-full px-4"
          onClick={() => setSelectedFilters([])}
        >
          All
        </Button>

        {availableFilters.sizes.map((size) => {
          const filterValue = size.toLowerCase().replace(" ", "_");
          return (
            <Button
              key={size}
              variant={
                selectedFilters.includes(filterValue) ? "default" : "outline"
              }
              className="whitespace-nowrap rounded-full px-4"
              onClick={() => toggleFilter(filterValue)}
            >
              {size}
            </Button>
          );
        })}

        {availableFilters.hasRoadAllowed && (
          <Button
            key="road_allowed"
            variant={
              selectedFilters.includes("road_allowed") ? "default" : "outline"
            }
            className="whitespace-nowrap rounded-full px-4"
            onClick={() => toggleFilter("road_allowed")}
          >
            Road Allowed
          </Button>
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
