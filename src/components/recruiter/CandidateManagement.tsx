import React from 'react';
import { motion } from 'motion/react';
import { X, FileText, TrendingUp, Briefcase, Search, ArrowUpDown, Phone, Mail } from 'lucide-react';
import { Candidate, Job } from '../../types';
import { cn } from '../../utils/helpers';

interface CandidateManagementProps {
  candidates: Candidate[];
  jobs: Job[];
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (c: Candidate | null) => void;
}

export const CandidateManagement = ({ candidates, jobs, selectedCandidate, setSelectedCandidate }: CandidateManagementProps) => {
  if (selectedCandidate) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800">Detalhes do Candidato: {selectedCandidate.fullName}</h3>
          <button 
            onClick={() => setSelectedCandidate(null)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
          >
            <X size={18} /> Voltar para Lista
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <FileText size={20} />
              <h4 className="font-bold uppercase text-xs tracking-wider">Currículo do Candidato</h4>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-blue-50 text-sm text-gray-700 h-[400px] overflow-y-auto whitespace-pre-wrap scrollbar-thin scrollbar-thumb-blue-200">
              {selectedCandidate.resume}
            </div>
          </div>

          <div className={cn(
            "p-6 rounded-3xl shadow-sm border",
            selectedCandidate.score >= 80 ? "bg-green-50 border-green-100" : 
            selectedCandidate.score >= 50 ? "bg-yellow-50 border-yellow-100" : 
            "bg-red-50 border-red-100"
          )}>
            <div className={cn(
              "flex items-center gap-2 mb-4",
              selectedCandidate.score >= 80 ? "text-green-600" : 
              selectedCandidate.score >= 50 ? "text-yellow-600" : 
              "text-red-600"
            )}>
              <TrendingUp size={20} />
              <h4 className="font-bold uppercase text-xs tracking-wider">Avaliação da IA</h4>
            </div>
            <div className="flex flex-col items-center justify-center h-[350px] gap-6">
              <div className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center font-bold text-3xl border-8 bg-white shadow-inner",
                selectedCandidate.score >= 80 ? "border-green-200 text-green-600" : 
                selectedCandidate.score >= 50 ? "border-yellow-200 text-yellow-600" : 
                "border-red-200 text-red-600"
              )}>
                {selectedCandidate.score}%
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800 text-lg mb-2">
                  {selectedCandidate.score >= 80 ? "Altamente Recomendado" : 
                   selectedCandidate.score >= 50 ? "Potencial Compatível" : 
                   "Baixa Compatibilidade"}
                </p>
                <p className="text-sm text-gray-600 px-4">
                  A IA analisou as palavras-chave do currículo em relação aos requisitos da vaga e determinou um score de {selectedCandidate.score}%.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-100 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-purple-600">
              <Briefcase size={20} />
              <h4 className="font-bold uppercase text-xs tracking-wider">Descrição da Vaga</h4>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-purple-50 text-sm text-gray-700 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200">
              <h5 className="font-bold text-gray-900 mb-2">
                {jobs.find(j => j.id === selectedCandidate.jobId)?.title || 'Vaga Removida'}
              </h5>
              <p className="whitespace-pre-wrap">
                {jobs.find(j => j.id === selectedCandidate.jobId)?.description || 'Descrição não disponível.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-800">Lista de Candidatos</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input className="pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Buscar por nome..." />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Vaga</th>
              <th className="px-6 py-4">Local-Vaga/Candidato</th>
              <th className="px-6 py-4">Contato</th>
              <th className="px-6 py-4">CPF</th>
              <th className="px-6 py-4 flex items-center gap-1">Score <ArrowUpDown size={14} /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {candidates.sort((a, b) => b.score - a.score).map(c => (
              <tr 
                key={c.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => setSelectedCandidate(c)}
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{c.fullName}</div>
                  <div className="text-xs text-gray-500">{c.gender === 'M' ? 'Masculino' : 'Feminino'}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {jobs.find(j => j.id === c.jobId)?.title || 'Vaga Removida'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {(() => {
                    const job = jobs.find(j => j.id === c.jobId);
                    const jobLoc = job ? `${job.city}, ${job.uf}` : '-';
                    return `${jobLoc} / ${c.city}, ${c.uf}`;
                  })()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1"><Phone size={14} /> {c.phone}</div>
                  <div className="flex items-center gap-1"><Mail size={14} /> {c.email}</div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-gray-500">{c.cpf}</td>
                <td className="px-6 py-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-4",
                    c.score >= 80 ? "border-green-100 text-green-600" : 
                    c.score >= 50 ? "border-yellow-100 text-yellow-600" : 
                    "border-red-100 text-red-600"
                  )}>
                    {c.score}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
