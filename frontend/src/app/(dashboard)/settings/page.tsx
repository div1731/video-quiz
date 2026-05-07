'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Shield, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your profile and subscription preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-lg font-semibold text-white">Profile Information</h3>
          <p className="text-sm text-zinc-400">Your basic account details.</p>
        </div>
        
        <div className="md:col-span-2 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl font-bold border border-indigo-500/30">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium">Profile Photo</p>
              <div className="mt-1 flex gap-2">
                <button className="text-sm text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors">Change</button>
                <button className="text-sm text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors">Remove</button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full px-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white opacity-70 cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white opacity-70 cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Account Role
              </label>
              <div className="px-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-400 capitalize">
                {user?.role || 'User'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden border-t border-zinc-800/50 pt-8 grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-lg font-semibold text-white">Subscription</h3>
          <p className="text-sm text-zinc-400">Manage your billing and tier.</p>
        </div>
        
        <div className="md:col-span-2 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-xl">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Free Plan</h4>
                  <p className="text-sm text-zinc-400">Up to 3 active quizzes</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors">
                Upgrade
              </button>
           </div>
        </div>
      </div>

    </div>
  );
}
