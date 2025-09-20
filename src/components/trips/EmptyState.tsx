export const EmptyState = () => {
  return (
    <div className="text-center py-16 bg-slate-800/70 rounded-2xl backdrop-blur-sm">
      <div className="text-6xl mb-4">🌍</div>
      <h3 className="text-xl font-semibold text-gray-200 mb-2">
        No scheduled trips yet!
      </h3>
      <p className="text-gray-300">
        Create your first trip above and start planning your next journey.
      </p>
    </div>
  );
};