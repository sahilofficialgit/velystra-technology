import React, { useState } from 'react';
import API from '../services/api';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Velystra1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber2',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Alpha3',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Nexus4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Vertex5',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Matrix6',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Vector7',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Quantum8',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Pulsar9',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Zenith10'
];

export default function EditProfileModal({ currentAvatar, onClose, onUpdate }) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || PRESET_AVATARS[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const avatarToSave = customUrl.trim() ? customUrl.trim() : selectedAvatar;
      await API.patch('/student/profile', { avatarUrl: avatarToSave });
      setLoading(false);
      onUpdate(avatarToSave);
      onClose();
    } catch (err) {
      setError('Failed to update profile picture.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center p-4 z-50 font-sans">
      <div className="bg-black border border-neutral-800 p-8 rounded-2xl max-w-lg w-full relative">
        <h3 className="text-base font-bold uppercase tracking-wider mb-2 font-mono">Customize Profile Identity</h3>
        <p className="text-xs text-neutral-400 mb-6 font-mono">Select a curated avatar or provide an image link from your gallery.</p>

        {error && <div className="mb-4 p-3 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs rounded-xl font-mono">{error}</div>}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Preview */}
          <div className="flex items-center gap-4 bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
            <img 
              src={customUrl.trim() || selectedAvatar} 
              alt="Avatar Preview" 
              className="w-14 h-14 rounded-full border border-neutral-700 object-cover bg-neutral-900" 
              onError={(e) => { e.target.src = PRESET_AVATARS[0]; }}
            />
            <div>
              <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">Active Identity Preview</p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Will be displayed across institutional & global leaderboards.</p>
            </div>
          </div>

          {/* Preset Avatars Grid */}
          <div>
            <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-3 uppercase tracking-wider">Choose from Curated Avatars (1-10)</label>
            <div className="grid grid-cols-5 gap-3">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setSelectedAvatar(url); setCustomUrl(''); }}
                  className={`p-2 rounded-xl border transition ${selectedAvatar === url && !customUrl ? 'border-white bg-neutral-900' : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'}`}
                >
                  <img src={url} alt={`Avatar ${idx + 1}`} className="w-10 h-10 rounded-full mx-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom URL Input */}
          <div>
            <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Or Paste Custom Image URL (Gallery Link)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-white hover:bg-neutral-200 text-black py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition">
              {loading ? 'Saving...' : 'Save Identity ✓'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}