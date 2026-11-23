'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle, GraduationCap, MessageCircle, Package, RefreshCw, ShoppingBag, Users } from 'lucide-react';
import { usersApi, CommunityProfile } from '../../../lib/api/users';
import { useUser } from '../../../contexts/UserContext';

function imageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('data:image/')) return url;
  if (!url.startsWith('/')) return undefined;
  return `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}${url}`;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = String(params?.id || '');
  const { user: currentUser } = useUser();
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    setPage(1);
    setAvatarFailed(false);
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    if (!/^[1-9]\d*$/.test(userId)) {
      setProfile(null);
      setError('This community member could not be found.');
      setLoading(false);
      return;
    }
    usersApi.getCommunityProfile(userId, page)
      .then(response => { if (!cancelled) setProfile(response.data); })
      .catch(error => {
        if (!cancelled) {
          setProfile(null);
          setError(error.status === 404
            ? 'This community member could not be found.'
            : 'We could not load this profile. Please try again.');
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId, page, retry]);

  const member = profile?.user;
  const isOwnProfile = String(currentUser?.id) === userId;
  const joined = member?.createdAt ? new Date(member.createdAt) : null;
  const joinedLabel = joined && !Number.isNaN(joined.getTime())
    ? joined.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : null;
  const avatar = imageUrl(member?.profileImageUrl);
  const phone = member?.whatsappNumber?.replace(/\D/g, '');

  return (
    <div className="min-h-full bg-[#F5F8F8] pb-10">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/marketplace" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#007B78]">
            <ArrowLeft size={18} /> Marketplace
          </Link>
          <span className="flex items-center gap-2 text-sm font-medium text-[#007B78]"><Users size={17} /> Community profile</span>
        </div>
      </header>

      {loading ? (
        <div role="status" className="mx-auto max-w-5xl space-y-6 px-5 py-8 sm:px-8">
          <span className="sr-only">Loading community profile</span>
          <div className="h-64 animate-pulse rounded-3xl bg-gray-200" />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {[1, 2, 3].map(key => <div key={key} className="h-56 animate-pulse rounded-2xl bg-gray-200" />)}
          </div>
        </div>
      ) : error || !member || !profile ? (
        <div className="mx-auto max-w-lg px-5 py-20 text-center" role="alert">
          <Users size={40} className="mx-auto mb-5 text-[#009F9C]" />
          <h1 className="text-2xl font-bold text-gray-900">Profile unavailable</h1>
          <p className="mt-3 leading-7 text-gray-600">{error || 'This profile is not available.'}</p>
          <button onClick={() => setRetry(value => value + 1)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#007B78] px-5 py-3 font-semibold text-white hover:bg-[#006663]">
            <RefreshCw size={17} /> Try again
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="h-28 bg-gradient-to-r from-[#006C69] via-[#009F9C] to-[#43C8B3] sm:h-36" />
            <div className="px-6 pb-7 sm:px-8">
              <div className="-mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-teal-50 text-3xl font-bold text-[#007B78] shadow-sm sm:h-28 sm:w-28">
                  {avatar && !avatarFailed
                    ? <img src={avatar} alt={`${member.fullName || 'Member'} profile photo`} className="h-full w-full object-cover" onError={() => setAvatarFailed(true)} />
                    : <span>{(member.fullName || 'M').charAt(0).toUpperCase()}</span>}
                </div>
                {isOwnProfile ? (
                  <Link href="/profile" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Manage my profile <ArrowRight size={16} /></Link>
                ) : phone ? (
                  <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#007B78] px-5 py-3 text-sm font-semibold text-white hover:bg-[#006663]"><MessageCircle size={18} /> Contact on WhatsApp</a>
                ) : null}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{member.fullName || 'Community member'}</h1>
                {member.isVerified && <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-[#007B78]"><CheckCircle size={14} /> Verified member</span>}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2"><GraduationCap size={17} /> {member.userRole === 'staff' ? 'Staff' : 'Student'}{member.department ? ` · ${member.department}` : ''}</span>
                {joinedLabel && <span className="inline-flex items-center gap-2"><CalendarDays size={16} /> Joined {joinedLabel}</span>}
                <span className="inline-flex items-center gap-2"><Package size={16} /> {profile.stats.activeListingsCount} active {profile.stats.activeListingsCount === 1 ? 'listing' : 'listings'}</span>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-gray-500">Part of the UM6P community. Students and staff can buy and sell items here.</p>
            </div>
          </section>

          <section className="mt-10" aria-labelledby="member-listings">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <h2 id="member-listings" className="text-xl font-bold text-gray-900">Items from this member</h2>
                <p className="mt-1 text-sm text-gray-500">Available items shared with the community.</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#007B78]">{profile.stats.activeListingsCount}</span>
            </div>
            {profile.items.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
                {profile.items.map(item => (
                  <Link key={item.id} href={`/item/${item.id}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gray-100">
                      {imageUrl(item.photos[0]) ? <img src={imageUrl(item.photos[0])} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" /> : <ShoppingBag size={34} className="text-gray-300" />}
                      <span className="absolute left-2 top-2 rounded-lg bg-white/95 px-2 py-1 text-xs font-medium text-gray-700">{item.condition}</span>
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="font-bold text-[#007B78]">{Number(item.price).toLocaleString('en-MA')} DH</p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-medium text-gray-900">{item.title}</h3>
                      <p className="mt-2 truncate text-xs text-gray-500">{item.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
                <Package size={32} className="mx-auto text-gray-400" />
                <h3 className="mt-4 font-semibold text-gray-900">No items available right now</h3>
                <p className="mt-2 text-sm text-gray-500">This member has no active listings to display.</p>
              </div>
            )}
            {profile.pagination.totalPages > 1 && (
              <nav aria-label="Member listings pages" className="mt-7 flex items-center justify-between gap-3">
                <button disabled={page <= 1} onClick={() => setPage(value => value - 1)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 disabled:opacity-40">Previous</button>
                <span className="text-sm text-gray-500">Page {page} of {profile.pagination.totalPages}</span>
                <button disabled={!profile.pagination.hasMore} onClick={() => setPage(value => value + 1)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 disabled:opacity-40">Next</button>
              </nav>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
