"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

type UIContextValue = {
  hideNavbar: boolean;
  setHideNavbar: (v: boolean) => void;
};

const UIContext: any = React.createContext();

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [hideNavbar, setHideNavbar] = useState(false);

  const handleSetHideNavbar = useCallback((v: boolean) => {
    setHideNavbar(v);
  }, []);

  const value = useMemo(() => ({
    hideNavbar,
    setHideNavbar: handleSetHideNavbar,
  }), [hideNavbar, handleSetHideNavbar]);

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI(): any {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
