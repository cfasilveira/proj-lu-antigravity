import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, DollarSign, UserCheck } from 'lucide-react';
import { Job } from '../../types';
import { cn } from '../../utils/helpers';

interface JobBoardProps {
  jobs: Job[];
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  onApply: () => void;
}

export const JobBoard = ({ jobs, selectedJob, setSelectedJob, onApply }: JobBoardProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-120px)]">
      {/* Left Column: Job List */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Briefcase className="text-blue-600" /> Vagas Disponíveis
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {jobs.length} vagas
          </span>
        </div>
        <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          {jobs.map(job => (
            <motion.div
              key={job.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedJob(job)}
              className={cn(
                "p-5 rounded-xl border-2 transition-all cursor-pointer shadow-sm",
                selectedJob?.id === job.id 
                  ? "border-blue-500 bg-blue-50 shadow-md" 
                  : "border-gray-100 bg-white hover:border-blue-200"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                <span className="text-blue-600 font-semibold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(job.salary)}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{job.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={14} /> {job.city}, {job.uf}</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-medium">{job.type}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Column: Job Details */}
      <div className="w-full lg:w-1/2">
        <AnimatePresence mode="wait">
          {selectedJob ? (
            <motion.div
              key={selectedJob.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 sticky top-4"
            >
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{selectedJob.title}</h2>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                    <MapPin size={16} /> {selectedJob.city}, {selectedJob.uf}
                  </span>
                  <span className="flex items-center gap-1 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-semibold">
                    <DollarSign size={16} /> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedJob.salary)}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedJob.type}
                  </span>
                </div>
              </div>

              <div className="prose prose-blue max-w-none mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-2">Descrição da Vaga</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <button 
                  onClick={onApply}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <UserCheck size={20} /> Candidatar-se
                </button>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
                alt="Equipe consultando oportunidades" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent flex flex-col items-center justify-end p-12 text-center">
                <p className="text-white text-2xl font-black tracking-tight drop-shadow-xl">
                  Selecione uma vaga para ver os detalhes e começar sua jornada!
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
