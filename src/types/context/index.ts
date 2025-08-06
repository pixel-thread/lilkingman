import { UserI } from '@/types/user';

export interface AuthContextI {
  user: UserI | null;
  refresh: () => void;
  isAuthLoading: boolean;
}
