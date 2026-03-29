/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Briefcase, 
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  MapPin, 
  DollarSign, 
  Phone, 
  Mail, 
  FileText, 
  ChevronRight, 
  X, 
  LogIn, 
  LogOut, 
  Filter,
  ArrowUpDown,
  TrendingUp,
  UserCheck,
  Map,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Job, Candidate, JobType, Gender } from './types';
import { BRAZIL_STATES, INITIAL_JOBS, INITIAL_CANDIDATES } from './constants';

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Helpers ---

const validateCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/[^\d]+/g, '');
  if (cleanCPF.length !== 11 || !!cleanCPF.match(/(\d)\1{10}/)) return false;
  
  let sum = 0;
  for (let i = 1; i <= 9; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cleanCPF.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cleanCPF.substring(10, 11))) return false;
  
  return true;
};

const calculateScore = (resume: string, jobDescription: string) => {
  const resumeWords = resume.toLowerCase().split(/\W+/);
  const jobWords = jobDescription.toLowerCase().split(/\W+/);
  
  // Filter out common small words
  const stopWords = ['de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'das', 'ao', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'depois', 'sem', 'mesmo', 'aos', 'seus', 'quem', 'nas', 'me', 'esse', 'eles', 'você', 'essa', 'num', 'nem', 'suas', 'meu', 'à', 'minha', 'numa', 'pelos', 'elas', 'qual', 'nós', 'lhe', 'deles', 'essas', 'esses', 'pelas', 'este', 'fosse', 'dele', 'tu', 'te', 'vocês', 'vos', 'lhes', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'nosso', 'nossa', 'nossos', 'nossas', 'dela', 'delas', 'esta', 'estes', 'estas', 'aquele', 'aquela', 'aqueles', 'aquelas', 'isto', 'aquilo', 'estou', 'está', 'estamos', 'estão', 'estive', 'esteve', 'estivemos', 'estiveram', 'estava', 'estávamos', 'estavam', 'estivera', 'estivéramos', 'esteja', 'estejamos', 'estejam', 'estivesse', 'estivéssemos', 'estivessem', 'estiver', 'estivermos', 'estiverem', 'tenho', 'tem', 'temos', 'tém', 'tinha', 'tínhamos', 'tinham', 'tive', 'teve', 'tivemos', 'tiveram', 'tivera', 'tivéramos', 'tenha', 'tenhamos', 'tenham', 'tivesse', 'tivéssemos', 'tivessem', 'tiver', 'tivermos', 'tiverem', 'terei', 'terá', 'teremos', 'terão', 'teria', 'teríamos', 'teriam', 'havia', 'houve', 'houvemos', 'houveram', 'houvera', 'houvéramos', 'haja', 'hajamos', 'hajam', 'houvesse', 'houvéssemos', 'houvessem', 'houver', 'houvermos', 'houverem', 'houverei', 'houverá', 'houveremos', 'houverão', 'houveria', 'houveríamos', 'houveriam', 'sou', 'somos', 'são', 'era', 'éramos', 'eram', 'fui', 'foi', 'fomos', 'foram', 'fora', 'fôramos', 'seja', 'sejamos', 'sejam', 'fosse', 'fôssemos', 'fossem', 'for', 'formos', 'forem', 'serei', 'será', 'seremos', 'serão', 'seria', 'seríamos', 'seriam', 'tenho', 'tem', 'temos', 'tém', 'tinha', 'tínhamos', 'tinham', 'tive', 'teve', 'tivemos', 'tiveram', 'tivera', 'tivéramos', 'tenha', 'tenhamos', 'tenham', 'tivesse', 'tivéssemos', 'tivessem', 'tiver', 'tivermos', 'tiverem', 'terei', 'terá', 'teremos', 'terão', 'teria', 'teríamos', 'teriam'];
  
  const filteredJobWords = jobWords.filter(w => w.length > 2 && !stopWords.includes(w));
  const uniqueJobWords = Array.from(new Set(filteredJobWords));
  
  if (uniqueJobWords.length === 0) return 0;
  
  let matches = 0;
  uniqueJobWords.forEach(word => {
    if (resumeWords.includes(word)) {
      matches++;
    }
  });
  
  return Math.round((matches / uniqueJobWords.length) * 100);
};

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'candidate' | 'recruiter'>('candidate');
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('rh_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('rh_candidates');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRecruiterLoggedIn, setIsRecruiterLoggedIn] = useState(false);
  const [recruiterTab, setRecruiterTab] = useState<'candidates' | 'jobs' | 'dashboard' | 'add_job'>('dashboard');
  const [dashboardUfFilter, setDashboardUfFilter] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  useEffect(() => {
    localStorage.setItem('rh_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('rh_candidates', JSON.stringify(candidates));
  }, [candidates]);

  // --- Candidate Area Logic ---
  const handleRegisterCandidate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cpf = formData.get('cpf') as string;
    
    if (!validateCPF(cpf)) {
      alert('CPF inválido!');
      return;
    }

    const resumeType = formData.get('resumeType') as string;
    let resumeText = '';
    if (resumeType === 'text') {
      resumeText = formData.get('resumeText') as string;
    } else {
      // Simulation of PDF upload
      resumeText = "Experiência extraída do PDF simulado. Habilidades em desenvolvimento e gestão.";
    }

    const score = calculateScore(resumeText, selectedJob?.description || '');

    const newCandidate: Candidate = {
      id: Math.random().toString(36).substr(2, 9),
      jobId: selectedJob!.id,
      fullName: formData.get('fullName') as string,
      city: formData.get('city') as string,
      uf: formData.get('uf') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      cpf: cpf,
      resume: resumeText,
      gender: formData.get('gender') as Gender,
      score: score,
      createdAt: new Date().toISOString(),
    };

    setCandidates([...candidates, newCandidate]);
    setIsRegisterModalOpen(false);
    alert('Cadastro realizado com sucesso!');
  };

  // --- Recruiter Area Logic ---
  const handleRecruiterLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = formData.get('user');
    const pass = formData.get('pass');
    
    if (user === 'admin' && pass === '1234') {
      setIsRecruiterLoggedIn(true);
    } else {
      alert('Credenciais inválidas! (Use admin / 1234)');
    }
  };

  const handleAddJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      city: formData.get('city') as string,
      uf: formData.get('uf') as string,
      salary: Number(formData.get('salary')),
      type: formData.get('type') as JobType,
      description: formData.get('description') as string,
      createdAt: new Date().toISOString(),
    };

    setJobs([newJob, ...jobs]);
    setRecruiterTab('jobs');
    alert('Vaga cadastrada com sucesso!');
  };

  const handleUpdateJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingJob) return;

    const formData = new FormData(e.currentTarget);
    
    const updatedJob: Job = {
      ...editingJob,
      title: formData.get('title') as string,
      city: formData.get('city') as string,
      uf: formData.get('uf') as string,
      salary: Number(formData.get('salary')),
      type: formData.get('type') as JobType,
      description: formData.get('description') as string,
    };

    setJobs(jobs.map(j => j.id === editingJob.id ? updatedJob : j));
    setEditingJob(null);
    alert('Vaga atualizada com sucesso!');
  };

  // --- Dashboard Data ---
  const dashboardStats = useMemo(() => {
    const totalJobs = jobs.length;
    const totalCandidates = candidates.length;
    
    // Data filtered for charts
    const filteredJobs = dashboardUfFilter ? jobs.filter(j => j.uf === dashboardUfFilter) : jobs;
    const filteredCandidates = dashboardUfFilter ? candidates.filter(c => c.uf === dashboardUfFilter) : candidates;

    // Vagas preenchidas (simulação: vagas com pelo menos 1 candidato)
    const filledJobs = jobs.filter(j => candidates.some(c => c.jobId === j.id)).length;
    const filledPercentage = totalJobs > 0 ? (filledJobs / totalJobs) * 100 : 0;

    // Vaga mais/menos procurada
    const jobCounts = candidates.reduce((acc, c) => {
      acc[c.jobId] = (acc[c.jobId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedJobCounts = Object.entries(jobCounts).sort((a, b) => (b[1] as number) - (a[1] as number));
    const mostWanted = sortedJobCounts[0];
    const leastWanted = sortedJobCounts[sortedJobCounts.length - 1];

    const mostWantedPercent = totalCandidates > 0 && mostWanted ? ((mostWanted[1] as number) / totalCandidates) * 100 : 0;
    const leastWantedPercent = totalCandidates > 0 && leastWanted ? ((leastWanted[1] as number) / totalCandidates) * 100 : 0;

    const mostWantedJob = mostWanted ? jobs.find(j => j.id === mostWanted[0])?.title : '-';
    const leastWantedJob = leastWanted ? jobs.find(j => j.id === leastWanted[0])?.title : '-';

    // UF com mais/menos vagas
    const ufCounts = jobs.reduce((acc, j) => {
      acc[j.uf] = (acc[j.uf] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedUfCounts = Object.entries(ufCounts).sort((a, b) => (b[1] as number) - (a[1] as number));
    const ufMost = sortedUfCounts[0]?.[0] || '-';
    const ufLeast = sortedUfCounts[sortedUfCounts.length - 1]?.[0] || '-';

    return {
      totalJobs,
      filledPercentage,
      totalCandidates,
      mostWantedPercent,
      leastWantedPercent,
      mostWantedJob,
      leastWantedJob,
      ufMost,
      ufLeast,
      ufCounts,
      genderDist: [
        { name: 'M', value: filteredCandidates.filter(c => c.gender === 'M').length },
        { name: 'F', value: filteredCandidates.filter(c => c.gender === 'F').length }
      ],
      candidatesPerJob: filteredJobs.map(j => ({
        name: j.title.substring(0, 15) + '...',
        count: filteredCandidates.filter(c => c.jobId === j.id).length
      })),
      jobsPerUf: Object.entries(dashboardUfFilter ? { [dashboardUfFilter]: ufCounts[dashboardUfFilter] || 0 } : ufCounts).map(([uf, count]) => ({ uf, count }))
    };
  }, [jobs, candidates, dashboardUfFilter]);

  // --- Renderers ---

  const renderCandidateArea = () => (
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
                  onClick={() => setIsRegisterModalOpen(true)}
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

      {/* Candidate Registration Modal */}
      <Modal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
        title={`Candidatura: ${selectedJob?.title}`}
      >
        <form onSubmit={handleRegisterCandidate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Nome Completo *</label>
              <input required name="fullName" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: João Silva" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">E-mail *</label>
              <input required type="email" name="email" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="joao@email.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Celular *</label>
              <input required name="phone" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="(00) 00000-0000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">CPF *</label>
              <input required name="cpf" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="000.000.000-00" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Cidade *</label>
              <input required name="city" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">UF *</label>
              <select required name="uf" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Gênero *</label>
              <select required name="gender" className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="M">Masculino (M)</option>
                <option value="F">Feminino (F)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700">Currículo *</label>
            <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
              <label className="flex-1">
                <input type="radio" name="resumeType" value="text" defaultChecked className="hidden peer" />
                <div className="p-2 text-center rounded-md cursor-pointer peer-checked:bg-white peer-checked:shadow-sm transition-all text-sm font-medium">Texto Livre</div>
              </label>
              <label className="flex-1">
                <input type="radio" name="resumeType" value="file" className="hidden peer" />
                <div className="p-2 text-center rounded-md cursor-pointer peer-checked:bg-white peer-checked:shadow-sm transition-all text-sm font-medium">Upload PDF</div>
              </label>
            </div>
            
            <div className="mt-2">
              <textarea 
                name="resumeText" 
                rows={4} 
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Descreva suas experiências, habilidades e formação..."
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all">
              Cadastrar Candidatura
            </button>
            <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );

  const renderRecruiterArea = () => {
    if (!isRecruiterLoggedIn) {
      return (
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
            <form onSubmit={handleRecruiterLogin} className="space-y-6">
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
    }

    return (
      <div className="space-y-8">
        {/* Recruiter Tabs */}
        <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'candidates', label: 'Candidatos', icon: Users },
            { id: 'jobs', label: 'Vagas', icon: Briefcase },
            { id: 'add_job', label: 'Nova Vaga', icon: PlusCircle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setRecruiterTab(tab.id as any);
                setSelectedCandidate(null);
              }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                recruiterTab === tab.id 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
              )}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
          <button 
            onClick={() => setIsRecruiterLoggedIn(false)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[60vh]">
          {recruiterTab === 'dashboard' && (
            <div className="space-y-8">
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total de Vagas', value: dashboardStats.totalJobs, icon: Briefcase, color: 'blue' },
                  { label: 'Vagas Preenchidas', value: `${dashboardStats.filledPercentage.toFixed(1)}%`, icon: UserCheck, color: 'green' },
                  { label: 'Total Candidatos', value: dashboardStats.totalCandidates, icon: Users, color: 'purple' },
                  { label: 'Vaga Mais Procurada', value: `${dashboardStats.mostWantedPercent.toFixed(1)}%`, subValue: dashboardStats.mostWantedJob, icon: TrendingUp, color: 'orange' },
                  { label: 'Vaga Menos Procurada', value: `${dashboardStats.leastWantedPercent.toFixed(1)}%`, subValue: dashboardStats.leastWantedJob, icon: TrendingUp, color: 'red', rotate: true },
                  { label: 'UF com Mais Vagas', value: dashboardStats.ufMost, icon: Map, color: 'indigo' },
                  { label: 'UF com Menos Vagas', value: dashboardStats.ufLeast, icon: Map, color: 'pink' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      stat.color === 'blue' && "bg-blue-50 text-blue-600",
                      stat.color === 'green' && "bg-green-50 text-green-600",
                      stat.color === 'purple' && "bg-purple-50 text-purple-600",
                      stat.color === 'orange' && "bg-orange-50 text-orange-600",
                      stat.color === 'red' && "bg-red-50 text-red-600",
                      stat.color === 'indigo' && "bg-indigo-50 text-indigo-600",
                      stat.color === 'pink' && "bg-pink-50 text-pink-600",
                    )}>
                      <stat.icon size={24} className={stat.rotate ? "rotate-180" : ""} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                      {stat.subValue && <p className="text-[10px] text-gray-500 font-medium truncate max-w-[120px]">{stat.subValue}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts Filter */}
              <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <Filter className="text-blue-500" size={20} />
                  <h3 className="text-lg font-bold text-gray-800">Filtro dos Gráficos</h3>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-500">Filtrar por UF:</label>
                  <select 
                    value={dashboardUfFilter}
                    onChange={(e) => setDashboardUfFilter(e.target.value)}
                    className="px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50 font-bold"
                  >
                    <option value="">Todos os Estados</option>
                    {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <BarChartIcon size={20} className="text-blue-500" /> Vagas por UF
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer key={recruiterTab} width="100%" height="100%" minWidth={0} minHeight={0} debounce={100}>
                      <BarChart data={dashboardStats.jobsPerUf}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="uf" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <PieChartIcon size={20} className="text-purple-500" /> Distribuição de Gênero
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer key={recruiterTab} width="100%" height="100%" minWidth={0} minHeight={0} debounce={100}>
                      <PieChart>
                        <Pie
                          data={dashboardStats.genderDist}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#ec4899" />
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <BarChartIcon size={20} className="text-green-500" /> Candidatos por Vaga
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer key={recruiterTab} width="100%" height="100%" minWidth={0} minHeight={0} debounce={100}>
                      <BarChart data={dashboardStats.candidatesPerJob} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                        <XAxis type="number" axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {recruiterTab === 'candidates' && (
            <div className="space-y-6">
              {selectedCandidate ? (
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
                    {/* Cartão 1: Currículo */}
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl shadow-sm">
                      <div className="flex items-center gap-2 mb-4 text-blue-600">
                        <FileText size={20} />
                        <h4 className="font-bold uppercase text-xs tracking-wider">Currículo do Candidato</h4>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-blue-50 text-sm text-gray-700 h-[400px] overflow-y-auto whitespace-pre-wrap scrollbar-thin scrollbar-thumb-blue-200">
                        {selectedCandidate.resume}
                      </div>
                    </div>

                    {/* Cartão 2: Avaliação da IA */}
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

                    {/* Cartão 3: Descrição da Vaga */}
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
              ) : (
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
                          <th className="px-6 py-4 cursor-pointer hover:text-blue-600 flex items-center gap-1">
                            Score <ArrowUpDown size={14} />
                          </th>
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
              )}
            </div>
          )}

          {recruiterTab === 'jobs' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-800">Vagas Cadastradas</h3>
                <div className="flex gap-2">
                  <select className="px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                    <option value="">Filtrar por UF</option>
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
                    {jobs.map(j => (
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
                            title="Editar Vaga"
                          >
                            <Edit size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {recruiterTab === 'add_job' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-3xl mx-auto"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Cadastrar Nova Vaga</h3>
              <form onSubmit={handleAddJob} className="space-y-6">
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
                  <button type="button" onClick={() => setRecruiterTab('jobs')} className="px-8 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Modal de Edição de Vaga */}
          <Modal 
            isOpen={!!editingJob} 
            onClose={() => setEditingJob(null)} 
            title="Editar Vaga"
          >
            {editingJob && (
              <form onSubmit={handleUpdateJob} className="space-y-6">
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navigation Header */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'candidate' ? renderCandidateArea() : renderRecruiterArea()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2026 RH Connect - Sistema de Gestão de Talentos</p>
        </div>
      </footer>
    </div>
  );
}
