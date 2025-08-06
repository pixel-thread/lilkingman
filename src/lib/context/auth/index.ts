import React from 'react';
import { AuthContextI } from '@/types/context/index';

export const AuthContext = React.createContext<AuthContextI | null>(null);
