'use client';

import { useUser } from '../../contexts/UserContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-semibold">Account</h3>
          <p className="text-sm text-gray-600 mt-1">Manage your account details and preferences.</p>
          <button onClick={() => router.push('/settings/profile')} className="mt-3 text-[#006666]">Edit profile</button>
        </div>

        <div className="bg-white rounded-xl p-4">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-sm text-gray-600 mt-1">Manage notification preferences.</p>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
}
