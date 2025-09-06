"use client";

import dynamic from 'next/dynamic';
import SkeletonCard from './SkeletonCard';

const Chat = dynamic(() => import('./Chat'), {
  loading: () => (
    <div className="p-6">
      <SkeletonCard />
    </div>
  ),
  ssr: false,
});

export default function ChatClient(props: any) {
  return <Chat {...props} />;
}
