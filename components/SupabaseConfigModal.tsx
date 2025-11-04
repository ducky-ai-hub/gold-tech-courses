import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
// FIX: Update import path for Database type to resolve Supabase client type inference issues.
import type { Database } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';

interface SupabaseConfigModalProps {
  onConnect: (client: SupabaseClient<Database>) => void;
  onUseStaticData: () => void;
}

const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ onConnect, onUseStaticData }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleConnect = () => {
    if (!url || !key) {
      setError('Please provide both a URL and an Anon Key.');
      return;
    }
    setError('');
    const client = createClient<Database>(url, key);
    onConnect(client);
  };

  return (
    <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-700 m-4">
        <h2 className="text-2xl font-bold text-white mb-2">Connect to Supabase</h2>
        <p className="text-slate-400 mb-6">
          Supabase environment variables were not found. Please enter your project details to connect, or use the sample data.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="supabaseUrl" className="block text-sm font-medium text-slate-300 mb-1">Project URL</label>
            <input
              type="text"
              name="supabaseUrl"
              id="supabaseUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project-id.supabase.co"
              className="w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            />
          </div>
          <div>
            <label htmlFor="supabaseKey" className="block text-sm font-medium text-slate-300 mb-1">Anon (Public) Key</label>
            <input
              type="password"
              name="supabaseKey"
              id="supabaseKey"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="your-anon-key"
              className="w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <div className="pt-6 space-y-3">
          <button
            onClick={handleConnect}
            className="w-full text-center flex justify-center bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out"
          >
            Connect
          </button>
          <button
            onClick={onUseStaticData}
            className="w-full text-center flex justify-center bg-transparent border border-slate-700 hover:border-amber-400 hover:text-amber-400 text-slate-300 font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Use Sample Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupabaseConfigModal;
