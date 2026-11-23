'use client';

import Link from 'next/link';
import { ArrowLeft, BadgeCheck, ShoppingBag, Users } from 'lucide-react';
import { CommunitySignupForm } from './components/UM6PStudentStep';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 lg:grid lg:grid-cols-2">
      <aside className="hidden lg:flex flex-col justify-center bg-[#009F9C] p-12 xl:p-20 text-white">
        <Link href="/" className="mb-14 text-3xl font-bold tracking-tight">XMarket</Link>
        <span className="mb-5 text-sm font-semibold uppercase tracking-widest text-white/75">UM6P community</span>
        <h1 className="max-w-lg text-5xl font-bold leading-tight">Your campus marketplace.</h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-white/90">
          A place for students and staff to find what they need and pass on what they no longer use.
        </p>
        <div className="mt-12 space-y-6">
          {[
            { icon: Users, text: 'A community of students and staff' },
            { icon: BadgeCheck, text: 'Membership verified with your community email' },
            { icon: ShoppingBag, text: 'Every member can buy and sell items' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-4">
              <Icon size={22} className="flex-shrink-0 text-white/90" />
              <p>{text}</p>
            </div>
          ))}
        </div>
      </aside>
      <main className="flex justify-center px-5 py-8 sm:px-10 lg:py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#009F9C]">
            <ArrowLeft size={18} /> Back to home
          </Link>
          <CommunitySignupForm onBack={() => undefined} />
          <p className="mt-8 text-center text-sm text-gray-600">
            Already a member? <Link href="/login" className="font-semibold text-[#007B78] hover:underline">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
