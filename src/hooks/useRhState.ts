import { useReducer, useEffect, useState } from 'react';
import { Job, Candidate, Gender } from '../types';
import { API_URL } from '../constants';

type Tab = 'dashboard' | 'candidates' | 'jobs' | 'add_job';
type View = 'candidate' | 'recruiter';

interface RhState {
  jobs: Job[];
  candidates: Candidate[];
}

type RhAction = 
  | { type: 'SET_JOBS', payload: Job[] }
  | { type: 'SET_CANDIDATES', payload: Candidate[] }
  | { type: 'ADD_JOB', payload: Job }
  | { type: 'UPDATE_JOB', payload: Job }
  | { type: 'REGISTER_CANDIDATE', payload: Candidate };

const rhReducer = (state: RhState, action: RhAction): RhState => {
  switch (action.type) {
    case 'SET_JOBS':
      return { ...state, jobs: action.payload };
    case 'SET_CANDIDATES':
      return { ...state, candidates: action.payload };
    case 'ADD_JOB':
      return { ...state, jobs: [action.payload, ...state.jobs] };
    case 'UPDATE_JOB':
      return { 
        ...state, 
        jobs: state.jobs.map(j => j.id === action.payload.id ? action.payload : j) 
      };
    case 'REGISTER_CANDIDATE':
      return { ...state, candidates: [action.payload, ...state.candidates] };
    default:
      return state;
  }
};


export function useRhState() {
  const [state, dispatch] = useReducer(rhReducer, {
    jobs: [],
    candidates: []
  });

  const [view, setView] = useState<View>('candidate');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRecruiterLoggedIn, setIsRecruiterLoggedIn] = useState(false);
  const [recruiterTab, setRecruiterTab] = useState<Tab>('dashboard');
  const [dashboardUfFilter, setDashboardUfFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Sync com o Backend no Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, candidatesRes] = await Promise.all([
          fetch(`${API_URL}/jobs`),
          fetch(`${API_URL}/candidates`)
        ]);

        if (jobsRes.ok && candidatesRes.ok) {
          const jobsData = await jobsRes.json();
          const candidatesData = await candidatesRes.json();

          // Mapear Jobs
          const mappedJobs = jobsData.map((j: any) => ({
            id: j.id,
            title: j.title,
            description: j.description,
            salary: j.salary,
            city: j.city,
            uf: j.uf,
            type: j.type,
            createdAt: j.created_at
          }));

          // Mapear Candidatos
          const mappedCandidates = candidatesData.map((c: any) => ({
            id: c.id,
            jobId: c.job_id,
            fullName: c.name,
            email: c.email,
            phone: c.phone || '(00) 00000-0000',
            city: c.city || '-',
            uf: c.uf,
            cpf: c.cpf_encrypted ? '***.***.***-**' : '-',
            gender: c.gender as Gender,
            score: c.ai_score,
            aiJustification: c.ai_justification,
            aiStrengths: c.ai_strengths || [],
            aiWeaknesses: c.ai_weaknesses || [],
            resume: c.resume_text,
            createdAt: c.created_at
          }));

          dispatch({ type: 'SET_JOBS', payload: mappedJobs });
          dispatch({ type: 'SET_CANDIDATES', payload: mappedCandidates });
        }
      } catch (error) {
        console.error("Erro ao sincronizar com backend:", error);
      }
    };


    fetchData();

    // Polling inteligente: atualiza a cada 15s enquanto algum candidato
    // ainda estiver com análise pendente
    const interval = setInterval(async () => {
      const candidatesRes = await fetch(`${API_URL}/candidates`).catch(() => null);
      if (!candidatesRes?.ok) return;
      const data = await candidatesRes.json();
      const hasPending = data.some(
        (c: any) => c.ai_justification === 'Análise em andamento...'
      );
      if (hasPending) {
        await fetchData();
      } else {
        // Para o polling assim que todas as análises terminarem
        clearInterval(interval);
        await fetchData();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    dispatch,
    view, setView,
    selectedJob, setSelectedJob,
    isRegisterModalOpen, setIsRegisterModalOpen,
    isRecruiterLoggedIn, setIsRecruiterLoggedIn,
    recruiterTab, setRecruiterTab,
    dashboardUfFilter, setDashboardUfFilter,
    selectedCandidate, setSelectedCandidate,
    editingJob, setEditingJob
  };
}
