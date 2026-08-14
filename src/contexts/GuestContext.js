import React, { createContext, useState, useCallback, useEffect } from 'react';

export const GuestContext = createContext();

export const GuestProvider = ({ children }) => {
  const [isGuest, setIsGuest] = useState(() => {
    try {
      return sessionStorage.getItem('isGuestMode') === 'true';
    } catch {
      return false;
    }
  });

  const [guestHasData, setGuestHasData] = useState(false);

  const startGuestMode = useCallback(() => {
    try {
      sessionStorage.setItem('isGuestMode', 'true');
      setIsGuest(true);
    } catch {
      console.error('Failed to set guest mode');
    }
  }, []);

  const exitGuestMode = useCallback(() => {
    try {
      sessionStorage.removeItem('isGuestMode');
      setIsGuest(false);
      setGuestHasData(false);
    } catch {
      console.error('Failed to exit guest mode');
    }
  }, []);

  const markGuestDataExists = useCallback(() => {
    setGuestHasData(true);
  }, []);

  // Wipe guest data on browser close (session storage clears automatically)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isGuest && guestHasData) {
        // Data will be automatically cleared by sessionStorage on browser close
        sessionStorage.removeItem('isGuestMode');
      }
    };

    if (isGuest) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isGuest, guestHasData]);

  return (
    <GuestContext.Provider
      value={{
        isGuest,
        guestHasData,
        startGuestMode,
        exitGuestMode,
        markGuestDataExists,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => {
  const context = React.useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within GuestProvider');
  }
  return context;
};
