
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  note?: string;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export type AuthFormMode = 'signin' | 'signup';
