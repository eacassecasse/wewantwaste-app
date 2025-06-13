import { useState } from "react";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { useProgressStore } from "../../../stores/useProgressStore";
import SkipCard, { type SkipProps } from "./skip-card";
import { Button } from "../../../components/ui/button";

export const SkipGrid = ({
  skips,
  loading,
}: {
  skips: SkipProps[];
  loading: boolean;
}) => {
  const [selectedSkip, setSelectedSkip] = useState<SkipProps | null>(null);
  const setSkip = useProgressStore((state) => state.setSkip);
  const nextStep = useProgressStore((state) => state.nextStep);

  const handleSkipToggle = (skip: SkipProps) => {
    if (selectedSkip?.id === skip.id) {
      setSelectedSkip(null); // Deselect
    } else {
      setSelectedSkip(skip); // Select new
    }
  };

  const handleSubmit = () => {
    if (!selectedSkip) return;
    setSkip(selectedSkip);
    nextStep();
  };

  return (
    <div className="px-2 bg-off-white-50">
      <ScrollArea className="h-[360px] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skips.map((skip) => (
            <SkipCard
              key={skip.id}
              skip={skip}
              isSelected={selectedSkip?.id === skip.id}
              onClick={() => handleSkipToggle(skip)}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-center">
        <Button
          onClick={handleSubmit}
          disabled={!selectedSkip}
          className="my-4 bg-warm-orange-500 hover:bg-warm-orange-400 text-foreground"
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};
