import FavoritesList from '../../components/FavoritesList';

export default function FavoritesPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex-shrink-0 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-900">Favorites</h1>
        <p className="text-gray-600 text-sm">Items you've saved for later</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          <FavoritesList />
        </div>
      </div>
    </div>
  );
}