import { IDashboardData } from "@/types";
import { create } from "zustand";

interface IDashboardStore {
  data: IDashboardData | null;
  copied: boolean;

  setData: (data: IDashboardData) => void;
  setCopied: (isCopied: boolean) => void;
}

export const useDashboardStore = create<IDashboardStore>((set) => ({
  data: null,
  copied: false,

  setData: (data) => {
    set({ data });
  },
  setCopied: (isCopied) => {
    set({ copied: isCopied });
  },
}));
