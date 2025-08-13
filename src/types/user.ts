export interface UserI {
  id: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
  email: string;
  hasImage: boolean;
  imageUrl: string;
}
