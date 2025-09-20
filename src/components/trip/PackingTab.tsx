import { useState } from "react";
import * as tripService from "../../services/tripService.firebase";
import type { Trip } from "../../Types/trip";

export default function PackingTab({ trip }: { trip: Trip }) {
  const [newPacking, setNewPacking] = useState("");

  const packedCount = trip.packingList?.filter(item => item.packed).length || 0;
  const totalCount = trip.packingList?.length || 0;
  const completionPercentage = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPacking.trim()) {
      await tripService.addPackingItem(trip.id, newPacking.trim());
      setNewPacking("");
    }
  };

  const getPackingIcon = (itemName: string) => {
    const name = itemName.toLowerCase();
    if (name.includes('cloth') || name.includes('shirt') || name.includes('pant') || name.includes('dress')) {
      return "👔";
    } else if (name.includes('shoe') || name.includes('sneaker') || name.includes('boot')) {
      return "👟";
    } else if (name.includes('phone') || name.includes('charger') || name.includes('laptop')) {
      return "📱";
    } else if (name.includes('medicine') || name.includes('pill') || name.includes('vitamin')) {
      return "💊";
    } else if (name.includes('book') || name.includes('notebook') || name.includes('journal')) {
      return "📚";
    } else if (name.includes('camera') || name.includes('photo')) {
      return "📷";
    } else if (name.includes('toothbrush') || name.includes('soap') || name.includes('shampoo')) {
      return "🧴";
    } else if (name.includes('sunglasses') || name.includes('glass')) {
      return "🕶️";
    } else if (name.includes('hat') || name.includes('cap')) {
      return "🧢";
    } else if (name.includes('bag') || name.includes('backpack')) {
      return "🎒";
    }
    return "📦";
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-600">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Packing List</h3>
            <p className="text-slate-400 text-sm">{totalCount} item{totalCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-slate-400 text-xs mb-1">Progress</div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-400">
              {completionPercentage}%
            </span>
            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Section */}
      <div className="p-6 border-b border-slate-600">
        <h4 className="text-white font-medium mb-4 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Packing Item
        </h4>
        
        <div className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={newPacking}
              onChange={(e) => setNewPacking(e.target.value)}
              placeholder="e.g., T-shirts, Phone charger, Sunglasses..."
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem(e)}
            />
          </div>
          <button
            onClick={handleAddItem}
            disabled={!newPacking.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Packing List */}
      <div className="p-6">
        {trip.packingList && trip.packingList.length > 0 ? (
          <div className="space-y-3">
            {/* Progress Summary */}
            {totalCount > 0 && (
              <div className="bg-slate-700/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    {packedCount} of {totalCount} items packed
                  </span>
                  <span className={`font-medium ${completionPercentage === 100 ? 'text-green-400' : 'text-blue-400'}`}>
                    {completionPercentage === 100 ? '🎉 All packed!' : `${totalCount - packedCount} remaining`}
                  </span>
                </div>
                <div className="mt-2 w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ease-out rounded-full ${
                      completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items List */}
            {trip.packingList.map((item) => (
              <div
                key={item.id}
                className={`bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border transition-all duration-200 p-4 ${
                  item.packed 
                    ? 'border-green-500/30 bg-green-500/10' 
                    : 'border-slate-600/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Custom Checkbox */}
                    <button
                      onClick={() => tripService.togglePackingItem(trip.id, item.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                        item.packed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-slate-500 hover:border-blue-400'
                      }`}
                    >
                      {item.packed && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    
                    {/* Item Content */}
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-xl">{getPackingIcon(item.name)}</span>
                      <span
                        onClick={() => tripService.togglePackingItem(trip.id, item.id)}
                        className={`cursor-pointer transition-all duration-200 ${
                          item.packed
                            ? "line-through text-slate-500"
                            : "text-white hover:text-blue-300"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    {/* Packed Status Badge */}
                    {item.packed && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
                        Packed ✓
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => tripService.removePackingItem(trip.id, item.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-slate-300 font-medium text-lg mb-2">No Items Yet</h3>
            <p className="text-slate-400 text-sm">Start building your packing list by adding your first item above</p>
          </div>
        )}
      </div>

      {/* Completion Footer */}
      {completionPercentage === 100 && totalCount > 0 && (
        <div className="p-6 border-t border-slate-600 bg-green-500/10">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl">🎉</span>
            <div className="text-center">
              <div className="text-green-400 font-semibold">All items packed!</div>
              <div className="text-slate-400 text-sm">You're ready for your trip</div>
            </div>
            <span className="text-2xl">🧳</span>
          </div>
        </div>
      )}
    </div>
  );
}