import { PaymentI, PaymentStatusT } from './payment';

export interface ImageI {
  id: string;
  photoId: string;
  path: string; // URL to the file
  name: string; // e.g., "1744798018751.jpg"
  mimeType: string; // e.g., "image/jpeg"
  sizeOriginal: number; // size in bytes
  chunksTotal: number;
  chunksUploaded: number;
  status: 'ACTIVE' | 'DELETED' | string; // constrain if known
  isFeatured: boolean;
  isPaid: boolean;
  price: number;
  paymentStatus: PaymentStatusT;
  thumbnailUrl: string;
  blurUrl: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt: string | null; // ISO date string or null
  userId: string | null;
  eventId: string | null;
  payment: PaymentI | null;
}
