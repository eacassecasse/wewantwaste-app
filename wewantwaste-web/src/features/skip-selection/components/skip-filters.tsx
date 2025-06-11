import { useMemo } from "react";
import { Button } from "../../../components/ui/button";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { Skeleton } from "../../../components/ui/skeleton";
import type { SkipProps } from "./skip-card";

export const SkipFilters = ({
  skips,
  filterOption,
  setFilterOption,
  loading
}: {
  skips: SkipProps[];
  filterOption: string;
  setFilterOption: (value: string) => void;
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
      hasRoadAllowed
    };
  }, [skips]);

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
          variant={filterOption === "all" ? "default" : "outline"}
          className="whitespace-nowrap rounded-full px-4"
          onClick={() => setFilterOption("all")}
        >
          All
        </Button>

        {/* Size filters */}
        {availableFilters.sizes.map((size) => (
          <Button
            key={size}
            variant={filterOption === size.toLowerCase().replace(' ', '_')
              ? "default"
              : "outline"}
            className="whitespace-nowrap rounded-full px-4"
            onClick={() => setFilterOption(size.toLowerCase().replace(' ', '_'))}
          >
            {size}
          </Button>
        ))}

        {/* Road allowed filter (only shown if relevant) */}
        {availableFilters.hasRoadAllowed && (
          <Button
            key="road_allowed"
            variant={filterOption === "road_allowed"
              ? "default"
              : "outline"}
            className="whitespace-nowrap rounded-full px-4"
            onClick={() => setFilterOption("road_allowed")}
          >
            Road Allowed
          </Button>
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};