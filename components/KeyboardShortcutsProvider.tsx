'use client';

import { useKeyboardShortcuts, KeyboardShortcutsHelp } from '../hooks/useKeyboardShortcuts';

export default function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  
  return (
    <>
      {children}
      <KeyboardShortcutsHelp />
    </>
  );
}
