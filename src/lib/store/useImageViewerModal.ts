import { create } from 'zustand';
import { ImageI } from '~/src/types/Image';

export interface ImageViewModalStore {
  open: boolean;
  onValueChange: (value: boolean) => void;
  image: ImageI | null;
  images: ImageI[];
  onImageChange: (image: ImageI) => void;
  onImagesChange: (images: ImageI[]) => void;
}

export const useImageViewModalStore = create<ImageViewModalStore>((set) => ({
  open: false,
  onValueChange: (value) => set({ open: value, image: null }),
  image: null,
  onImageChange: (image) => set({ image, open: true }),
  images: [] as ImageI[],
  onImagesChange: (images) => set({ images }),
}));
