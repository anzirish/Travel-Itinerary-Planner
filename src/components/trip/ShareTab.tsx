import { useState } from "react";
import * as tripService from "../../services/tripService.firebase";
import type { Trip } from "../../Types/trip";

export default function ShareTab({ trip }: { trip: Trip }) {
  const [newCollaborator, setNewCollaborator] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollaborator.trim()) return;
    
    setIsAdding(true);
    setError("");
    
    try {
      await tripService.addCollaboratorByEmail(trip.id, newCollaborator.trim());
      setNewCollaborator("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Could not add collaborator");
    } finally {
      setIsAdding(false);
    }
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getRoleColor = (isOwner: boolean) => {
    return isOwner 
      ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
      : "bg-green-500/20 text-green-400 border-green-500/30";
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-600">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Share Trip</h3>
            <p className="text-slate-400 text-sm">{trip.collaborators?.length || 0} collaborator{(trip.collaborators?.length || 0) !== 1 ? 's' : ''}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-slate-400 text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secure sharing</span>
        </div>
      </div>



      {/* Add Collaborator Section */}
      <div className="p-6 border-b border-slate-600">
        <h4 className="text-white font-medium mb-4 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Collaborator
        </h4>
        
        <div className="space-y-3">
          <div className="flex space-x-3">
            <div className="flex-1">
              <input
                type="email"
                value={newCollaborator}
                onChange={(e) => {
                  setNewCollaborator(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter email address..."
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCollaborator(e)}
              />
            </div>
            <button
              onClick={handleAddCollaborator}
              disabled={isAdding || !newCollaborator.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collaborators List */}
      <div className="p-6">
        {trip.collaborators && trip.collaborators.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-white font-medium mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Team Members ({trip.collaborators.length})
            </h4>
            
            {trip.collaborators.map((collaborator) => {
              const isOwner = collaborator.uid === trip.ownerId;
              return (
                <div
                  key={collaborator.uid}
                  className="bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600/50 p-4 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        isOwner 
                          ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                          : 'bg-gradient-to-br from-green-500 to-blue-600'
                      }`}>
                        {getInitials(collaborator.email)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <span className="text-white font-medium">
                            {collaborator.email.split('@')[0]}
                          </span>
                          <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getRoleColor(isOwner)}`}>
                            {isOwner ? '👑 Owner' : '🤝 Collaborator'}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mt-1">
                          {collaborator.email}
                        </p>
                      </div>
                    </div>
                    
                    {/* Remove Button (only for non-owners) */}
                    {!isOwner && (
                      <button
                        onClick={() => tripService.removeCollaborator(trip.id, collaborator.uid)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove collaborator"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-slate-300 font-medium text-lg mb-2">No Collaborators Yet</h3>
            <p className="text-slate-400 text-sm">Add team members to collaborate on this trip planning</p>
          </div>
        )}
      </div>

      {/* Tips Footer */}
      <div className="p-4 border-t border-slate-600 bg-slate-700/20">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="text-slate-300 font-medium mb-1">🚀 Collaboration Tips</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Collaborators can edit itinerary, add expenses, upload documents, and leave reviews. Only owners can manage team members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}