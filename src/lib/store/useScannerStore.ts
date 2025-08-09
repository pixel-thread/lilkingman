import { create } from 'zustand';

type UseScannerStoreT = {
  open: boolean;
  onValueChange: (value: boolean) => void;
};

export const useScannerStore = create<UseScannerStoreT>((set) => ({
  open: false,
  onValueChange: (value) => set({ open: value }),
}));
