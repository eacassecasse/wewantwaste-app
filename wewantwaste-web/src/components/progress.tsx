import { Calendar, ClipboardCheck, CreditCard, MapPin, Package, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useProgressStore } from "../stores/useProgressStore";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export const stepIcons = [
    { id: 1, icon: MapPin, label: 'Address' },
    { id: 2, icon: Trash2, label: 'Waste Type' },
    { id: 3, icon: Package, label: 'Skip Size' },
    { id: 4, icon: ClipboardCheck, label: 'Permit' },
    { id: 5, icon: Calendar, label: 'Delivery' },
    { id: 6, icon: CreditCard, label: 'Payment' }
];

// const steps = [
//     { id: 1, name: 'Address', description: 'Enter your location' },
//     { id: 2, name: 'Waste Type', description: 'What type of waste are you disposing of?' },
//     { id: 3, name: 'Skip Size', description: 'Choose Your Skip Size' },
//     { id: 4, name: 'Permit Check', description: 'Where will the skip be place?' },
//     { id: 5, name: 'Delivery Date', description: 'Choose Your Delivery Date' },
//     { id: 6, name: 'Payment', description: 'Complete payment' }
// ];

const Progress = () => {
    const currentStep = useProgressStore((state) => state.currentStep);
    const setCurrentStep = useProgressStore((state) => state.setCurrentStep);
    const isStepComplete = (stepId: number) => stepId <= currentStep;

    return (
        <div className="w-full m-auto py-8 bg-gray-100 max-w-screen">
            <ScrollArea className="w-full max-w-screen whitespace-nowrap">
                <div className="flex items-center relative">
                    <div className="absolute left-0 right-0 h-2 bg-gray-200 top-1/2 transform -translate-y-1/2 mx-16 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary progress-line rounded-full"
                            style={{
                                width: `${((currentStep - 1) / (stepIcons.length - 1)) * 100}%`,
                                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                            }}
                        />
                    </div>

                    <div className="relative flex justify-between w-full max-w-screen px-12">
                        {stepIcons.map((step, index) => {
                            const Icon = step.icon;
                            const completed = isStepComplete(step.id);
                            const active = currentStep === step.id;

                            return (
                                <div key={step.id} className="flex flex-col items-center z-10" style={{ flex: 1 }}>
                                    <div className="relative">
                                        <button
                                            onClick={() => completed && setCurrentStep(step.id)}
                                            className={cn(
                                                "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all progress-step",
                                                active
                                                    ? 'border-primary bg-primary text-white scale-110 shadow-lg active-step'
                                                    : completed
                                                        ? 'border-green-500 bg-green-500 text-white'
                                                        : 'border-gray-300 bg-white text-gray-400',
                                                "relative z-10"
                                            )}
                                        >
                                            <Icon className={cn(
                                                "h-5 w-5 transition-all",
                                                active ? 'text-white' : completed ? 'text-white' : 'text-gray-400'
                                            )} />
                                        </button>

                                        {/* {index < stepIcons.length - 1 && (
                                            <div className={cn(
                                                "absolute top-1/2 left-full w-16 h-1 -translate-y-1/2 -ml-8",
                                                completed ? 'bg-green-500' : 'bg-gray-200'
                                            )} />
                                        )} */}
                                    </div>

                                    {active && (
                                        <span className={cn(
                                            "mt-3 text-sm font-medium transition-colors",
                                            active ? 'text-primary font-semibold' :
                                                completed ? 'text-green-600' : 'text-gray-500'
                                        )}>
                                            {step.label}
                                        </span>
                                    )
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
};

export default Progress;