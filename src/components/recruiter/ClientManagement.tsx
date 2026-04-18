import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Plus } from 'lucide-react';
import { Client } from '../../types';

interface ClientManagementProps {
  clients: Client[];
  onAddClient: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ClientManagement = ({ clients, onAddClient }: ClientManagementProps) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Building2 className="text-blue-500" />
          Clientes Cadastrados
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-colors"
        >
          {isAdding ? 'Cancelar' : <><Plus size={18} /> Novo Cliente</>}
        </button>
      </div>

      {/* Form */}
      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <form onSubmit={(e) => { onAddClient(e); setIsAdding(false); }} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <label className="text-sm font-bold text-gray-700">Nome da Empresa *</label>
              <input required name="name" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Tech Corp Solutions" />
            </div>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-green-200 w-full md:w-auto">
              Salvar Cliente
            </button>
          </form>
        </motion.div>
      )}

      {/* List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nome do Cliente (Empresa)</th>
                <th className="px-6 py-4 text-right">Cadastrado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">
                    Nenhum cliente cadastrado ainda.
                  </td>
                </tr>
              ) : (
                clients.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-400">{c.id.split('-')[0]}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{c.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-right">
                      {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
