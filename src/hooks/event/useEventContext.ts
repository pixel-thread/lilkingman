import React from 'react';
import { EventContext } from '@lib/context/event';

export const useEventContext = () => {
  const context = React.useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within a EventContextProvider');
  }
  return context;
};
