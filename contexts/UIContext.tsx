"use client";

import React, { createContext, useContext, useState } from 'react';

type UIContextValue = {
  hideNavbar: boolean;
  setHideNavbar: (v: boolean) => void;
};

const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [hideNavbar, setHideNavbar] = useState(false);
  return (
    <UIContext.Provider value={{ hideNavbar, setHideNavbar }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
