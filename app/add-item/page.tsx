'use client';

import { useState, useEffect } from 'react';
import { AddItemForm } from './components';
import TypeSelectionScreen from './components/TypeSelectionScreen';
import AddServiceForm from './components/AddServiceForm';

type SelectionType = 'none' | 'product' | 'service';

export default function AddItemPage() {
  const [selection, setSelection] = useState<SelectionType>('none');

  // Reset scroll position when page mounts to ensure centered view
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (selection === 'none') {
    return (
      <TypeSelectionScreen
        onSelectProduct={() => setSelection('product')}
        onSelectService={() => setSelection('service')}
      />
    );
  }

  if (selection === 'service') {
    return <AddServiceForm onBack={() => setSelection('none')} />;
  }

  return <AddItemForm onCancel={() => setSelection('none')} />;
}
