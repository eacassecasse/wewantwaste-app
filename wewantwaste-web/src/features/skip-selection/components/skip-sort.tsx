import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Skeleton } from "../../../components/ui/skeleton";

export const SkipSort = ({
  sortOption,
  setSortOption,
  loading
}: {
  sortOption: string;
  setSortOption: (value: string) => void;
  loading: boolean;
}) => {
  if (loading) {
    return <Skeleton className="h-10 w-[180px]" />;
  }

  return (
    <Select value={sortOption} onValueChange={setSortOption}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="bg-white border-0">
        <SelectItem value="latest">Latest</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
        <SelectItem value="price_low">Price: Low to High</SelectItem>
        <SelectItem value="price_high">Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  );
};