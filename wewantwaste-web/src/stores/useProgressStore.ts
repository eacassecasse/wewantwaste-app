import { create } from "zustand";
import type { SkipProps } from "../features/skip-selection/components/skip-card";

type ProgressState = {
  currentStep: number;
  address: {
    postcode: string;
    fullAddress: string;
  } | null;
  wasteType: {
    type: string;
    hasHeavyWaste: boolean;
    hasPlasterboard: boolean;
  } | null;
  skip: SkipProps | null;
  permitRequired: boolean | null;
  deliveryDate: Date | null;
  paymentComplete: boolean;

  setAddress: (address: { postcode: string; fullAddress: string }) => void;
  setWasteType: (waste: {
    type: string;
    hasHeavyWaste: boolean;
    hasPlasterboard: boolean;
  }) => void;
  setSkip: (skip: SkipProps) => void;
  setPermitRequired: (required: boolean) => void;
  setDeliveryDate: (date: Date) => void;
  setPaymentComplete: (complete: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setCurrentStep: (step: number) => void;
  isStepComplete: (stepId: number) => boolean;
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  currentStep: 3,
  address: { postcode: "LE10 1SH",
    fullAddress: "Hinckley" },
  wasteType: {
    type: "Garden Waste",
    hasHeavyWaste: false,
    hasPlasterboard: false,
  },
  skip: null,
  permitRequired: null,
  deliveryDate: null,
  paymentComplete: false,

  setAddress: (address) => set({ address }),
  setWasteType: (wasteType) => set({ wasteType }),
  setSkip: (skip: SkipProps | null) => set({ skip }),
  setPermitRequired: (permitRequired) => set({ permitRequired }),
  setDeliveryDate: (deliveryDate) => set({ deliveryDate }),
  setPaymentComplete: (paymentComplete) => set({ paymentComplete }),

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  reset: () =>
    set({
      currentStep: 1,
      address: null,
      wasteType: null,
      skip: null,
      permitRequired: null,
      deliveryDate: null,
      paymentComplete: false,
    }),
  setCurrentStep: (step) => set({ currentStep: step }),
  isStepComplete: (stepId: number) => {
    const state = get();
    switch (stepId) {
      case 1:
        return !!state.address;
      case 2:
        return !!state.wasteType;
      case 3:
        return state.skip !== undefined;
      case 4:
        return state.permitRequired !== null;
      case 5:
        return !!state.deliveryDate;
      case 6:
        return state.paymentComplete;
      default:
        return false;
    }
  },
}));
