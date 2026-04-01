import React from 'react';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';

interface RecruiterLoginProps {
  onLogin: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const RecruiterLogin = ({ onLogin }: RecruiterLoginProps) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LogIn className="text-blue-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Acesso Recrutador</h2>
        <p className="text-gray-500">Entre com suas credenciais para gerenciar</p>
      </div>
      <form onSubmit={onLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Usuário</label>
          <input name="user" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="admin" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Senha</label>
          <input type="password" name="pass" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••" />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200">
          Entrar no Painel
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-gray-400">Dica: admin / 1234</p>
    </motion.div>
  </div>
);
