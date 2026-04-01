import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit, Users } from 'lucide-react';
import { Job, Candidate, JobType } from '../../types';
import { BRAZIL_STATES } from '../../constants';
import { Modal } from '../common/Modal';

interface JobManagementProps {
  jobs: Job[];
  candidates: Candidate[];
  editingJob: Job | null;
  setEditingJob: (job: Job | null) => void;
  onUpdateJob: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const JobManagement = ({ jobs, candidates, editingJob, setEditingJob, onUpdateJob }: JobManagementProps) => {
  const [ufFilter, setUfFilter] = useState('');

  const filteredJobs = ufFilter 
    ? jobs.filter(j => j.uf === ufFilter)
    : jobs;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-800">Vagas Cadastradas</h3>
        <div className="flex gap-2">
          <select 
            value={ufFilter}
            onChange={(e) => setUfFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white font-medium"
          >
            <option value="">Filtrar por UF (Tudo)</option>
            {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Título</th>
              <th className="px-6 py-4">Localização</th>
              <th className="px-6 py-4">Salário</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Candidatos</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                  Nenhuma vaga encontrada para este filtro.
                </td>
              </tr>
            ) : (
              filteredJobs.map(j => (
                <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{j.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{j.city}, {j.uf}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(j.salary)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                      {j.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Users size={16} /> {candidates.filter(c => c.jobId === j.id).length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingJob(j)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={!!editingJob} 
        onClose={() => setEditingJob(null)} 
        title="Editar Vaga"
      >
        {editingJob && (
          <form onSubmit={onUpdateJob} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Título da Vaga *</label>
                <input required name="title" defaultValue={editingJob.title} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Cidade *</label>
                <input required name="city" defaultValue={editingJob.city} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">UF *</label>
                <select required name="uf" defaultValue={editingJob.uf} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Salário (R$) *</label>
                <input required type="number" name="salary" defaultValue={editingJob.salary} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Tipo de Vaga *</label>
                <select required name="type" defaultValue={editingJob.type} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="Presencial">Presencial</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Descrição da Vaga *</label>
                <textarea 
                  required 
                  name="description" 
                  defaultValue={editingJob.description}
                  rows={6} 
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                ></textarea>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200">
                Salvar Alterações
              </button>
              <button type="button" onClick={() => setEditingJob(null)} className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export const JobForm = ({ onAddJob, onCancel }: { onAddJob: (e: React.FormEvent<HTMLFormElement>) => void, onCancel: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-3xl mx-auto"
  >
    <h3 className="text-2xl font-bold text-gray-800 mb-8">Cadastrar Nova Vaga</h3>
    <form onSubmit={onAddJob} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700">Título da Vaga *</label>
          <input required name="title" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Desenvolvedor Fullstack" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Cidade *</label>
          <input required name="city" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">UF *</label>
          <select required name="uf" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Salário (R$) *</label>
          <input required type="number" name="salary" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Tipo *</label>
          <select required name="type" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value="Remoto">Remoto</option>
            <option value="Presencial">Presencial</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Descrição Completa *</label>
        <textarea required name="description" rows={6} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Descreva as responsabilidades, requisitos e benefícios..."></textarea>
      </div>
      <div className="flex gap-4 pt-4">
        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200">
          Publicar Vaga
        </button>
        <button type="button" onClick={onCancel} className="px-8 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
          Cancelar
        </button>
      </div>
    </form>
  </motion.div>
);
