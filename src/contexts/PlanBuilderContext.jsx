import React, { createContext, useState } from 'react';

export const PlanBuilderContext = createContext({
  eventId: null,
  setEventId: () => {},
  eventDate: '',
  setEventDate: () => {}
});

export function PlanBuilderProvider({ children, initialEventId = null }) {
  const [eventId, setEventId] = useState(initialEventId);
  const [eventDate, setEventDate] = useState('');

  return (
    <PlanBuilderContext.Provider value={{ eventId, setEventId, eventDate, setEventDate }}>
      {children}
    </PlanBuilderContext.Provider>
  );
}
