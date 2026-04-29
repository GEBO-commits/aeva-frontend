import React, { createContext, useState } from 'react';

export const PlanBuilderContext = createContext({
  eventId: null,
  setEventId: () => {}
});

export function PlanBuilderProvider({ children, initialEventId = null }) {
  const [eventId, setEventId] = useState(initialEventId);

  return (
    <PlanBuilderContext.Provider value={{ eventId, setEventId }}>
      {children}
    </PlanBuilderContext.Provider>
  );
}
