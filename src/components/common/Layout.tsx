import React from 'react';
import { Users, Briefcase } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface HeaderProps {
  view: 'candidate' | 'recruiter';
  setView: (view: 'candidate' | 'recruiter') => void;
}

export const Header = ({ view, setView }: HeaderProps) => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl">
          <Briefcase className="text-white" size={28} />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">RH<span className="text-blue-600">Connect</span></h1>
      </div>

      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl">
        <button 
          onClick={() => setView('candidate')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            view === 'candidate' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Users size={18} /> Candidato
        </button>
        <button 
          onClick={() => setView('recruiter')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            view === 'recruiter' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Briefcase size={18} /> Recrutador
        </button>
      </div>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="bg-white border-t border-gray-200 py-10 mt-20">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="text-gray-400 text-sm">© 2026 RH Connect - Sistema de Gestão de Talentos</p>
    </div>
  </footer>
);
