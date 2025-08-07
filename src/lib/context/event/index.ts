import React from 'react';
import { EventContextI } from '~/src/types/context/event';

export const EventContext = React.createContext<EventContextI | null>(null);
