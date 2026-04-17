import React, { useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = candidates.filter(c => 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {/* Coluna 1: Currículo */}
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <FileText size={20} />
              <h4 className="font-bold uppercase text-xs tracking-wider">Currículo do Candidato</h4>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-blue-50 text-sm text-gray-700 h-[400px] overflow-y-auto whitespace-pre-wrap scrollbar-thin scrollbar-thumb-blue-200">
              {selectedCandidate.resume}
            </div>
          </div>

          {/* Coluna 2: Descrição da Vaga */}
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

          {/* Coluna 3: Análise da IA */}
          <div className="bg-green-50 border border-green-100 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp size={20} />
                <h4 className="font-bold uppercase text-xs tracking-wider">Análise de Perfil (IA)</h4>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-black",
                selectedCandidate.score >= 80 ? "bg-green-100 text-green-700" :
                selectedCandidate.score >= 50 ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              )}>
                {selectedCandidate.score}% Match
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-green-50 text-sm text-gray-700 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 space-y-4">
              {/* Avaliação Geral */}
              <div>
                <p className="font-semibold text-gray-900 mb-1 italic text-xs uppercase tracking-wider">Avaliação Geral</p>
                <p className="leading-relaxed text-gray-600">
                  {selectedCandidate.aiJustification || "Aguardando análise..."}
                </p>
              </div>

              {/* Pontos Fortes */}
              {selectedCandidate.aiStrengths && selectedCandidate.aiStrengths.length > 0 && (
                <div>
                  <p className="font-semibold text-green-700 mb-2 text-xs uppercase tracking-wider flex items-center gap-1">
                    <span>✅</span> Pontos Fortes
                  </p>
                  <ul className="space-y-1">
                    {selectedCandidate.aiStrengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 bg-green-50 rounded-lg px-3 py-1.5">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">▸</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pontos Fracos */}
              {selectedCandidate.aiWeaknesses && selectedCandidate.aiWeaknesses.length > 0 && (
                <div>
                  <p className="font-semibold text-red-600 mb-2 text-xs uppercase tracking-wider flex items-center gap-1">
                    <span>⚠️</span> Pontos a Desenvolver
                  </p>
                  <ul className="space-y-1">
                    {selectedCandidate.aiWeaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 bg-red-50 rounded-lg px-3 py-1.5">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">▸</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Estado pendente */}
              {(!selectedCandidate.aiStrengths || selectedCandidate.aiStrengths.length === 0) &&
               (!selectedCandidate.aiWeaknesses || selectedCandidate.aiWeaknesses.length === 0) && 
               selectedCandidate.aiJustification === "Análise em andamento..." && (
                <p className="text-gray-400 italic text-xs text-center pt-4">⏳ A análise detalhada estará disponível em instantes...</p>
              )}
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
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
              placeholder="Buscar por nome..." 
            />
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
              <th className="px-6 py-4">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...filteredCandidates].sort((a, b) => b.score - a.score).map(c => (
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
