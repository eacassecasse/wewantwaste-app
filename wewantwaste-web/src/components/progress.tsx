import {
  Calendar,
  ClipboardCheck,
  CreditCard,
  MapPin,
  Package,
  Trash2,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useProgressStore } from "../stores/useProgressStore";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const stepIcons = [
  { id: 1, icon: MapPin, label: "Address" },
  { id: 2, icon: Trash2, label: "Waste Type" },
  { id: 3, icon: Package, label: "Skip Size" },
  { id: 4, icon: ClipboardCheck, label: "Permit" },
  { id: 5, icon: Calendar, label: "Delivery" },
  { id: 6, icon: CreditCard, label: "Payment" },
];

const Progress = () => {
  const currentStep = useProgressStore((state) => state.currentStep);
  const setCurrentStep = useProgressStore((state) => state.setCurrentStep);
  const isStepComplete = (stepId: number) => stepId <= currentStep;

  return (
    <div className="w-full m-auto py-8 bg-off-white-100 max-w-screen">
      <ScrollArea className="w-full max-w-screen whitespace-nowrap">
        <div className="flex items-center relative py-2">
          {/* Progress line */}
          <div className="absolute left-0 right-0 h-2 bg-medium-gray-200 top-1/2 transform -translate-y-1/2 mx-4 md:mx-16 rounded-full overflow-hidden">
            <div
              className="h-full bg-apple-green-500 progress-line rounded-full"
              style={{
                width: `${((currentStep - 1) / (stepIcons.length - 1)) * 100}%`,
                boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
              }}
            />
          </div>

          {/* Steps container */}
          <div className="relative w-full max-w-screen px-4 md:px-12">
            <div className="flex justify-between w-full mx-auto max-w-md md:max-w-none">
              {stepIcons.map((step) => {
                const Icon = step.icon;
                const completed = isStepComplete(step.id);
                const active = currentStep === step.id;

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center z-10"
                  >
                    {/* Button with label container */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => completed && setCurrentStep(step.id)}
                        className={cn(
                          "flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all progress-step mb-2",
                          active
                            ? "border-apple-green-500 bg-apple-green-500 text-white scale-110 shadow-lg active-step"
                            : completed
                            ? "border-apple-green-400 bg-apple-green-400 text-white"
                            : "border-medium-gray-300 bg-white text-medium-gray-400",
                          "relative z-10"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 md:h-5 md:w-5 transition-all",
                            active
                              ? "text-white"
                              : completed
                              ? "text-white"
                              : "text-medium-gray-400"
                          )}
                        />
                      </button>

                      <span
                        className={cn(
                          "text-xs md:text-sm font-medium transition-all whitespace-nowrap",
                          "inline-block min-w-max",
                          active
                            ? "text-apple-green-600 font-semibold opacity-100 translate-y-0"
                            : completed
                            ? "hidden md:inline-block text-apple-green-500 opacity-70"
                            : "hidden md:inline-block text-medium-gray-500 opacity-0 md:opacity-70",
                          "transform transition duration-300 ease-in-out"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Progress;
