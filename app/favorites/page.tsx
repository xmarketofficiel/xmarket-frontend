import FavoritesList from '../../components/FavoritesList';

export default function FavoritesPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <h1 className="text-xl font-bold text-gray-900">Favorites</h1>
        <p className="text-sm text-gray-600 mt-1">Items you&apos;ve saved</p>
      </div>

      {/* Content */}
      <FavoritesList />
    </div>
  );
}