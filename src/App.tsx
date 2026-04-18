import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/common/Layout';
import { JobBoard } from './components/candidate/JobBoard';
import { RecruiterDashboard } from './components/recruiter/Dashboard';
import { JobManagement, JobForm } from './components/recruiter/JobManagement';
import { CandidateManagement } from './components/recruiter/CandidateManagement';
import { ClientManagement } from './components/recruiter/ClientManagement';
import { RecruiterLogin } from './components/recruiter/Login';
import { ApplyModal } from './components/candidate/ApplyModal';
import { useRhState } from './hooks/useRhState';
import { API_URL } from './constants';

export default function App() {
  const {
    jobs,
    candidates,
    clients,
    dispatch,
    view, setView,
    selectedJob, setSelectedJob,
    isRegisterModalOpen, setIsRegisterModalOpen,
    isRecruiterLoggedIn, setIsRecruiterLoggedIn,
    recruiterTab, setRecruiterTab,
    dashboardUfFilter, setDashboardUfFilter,
    selectedCandidate, setSelectedCandidate,
    editingJob, setEditingJob,
  } = useRhState();

  const handleCreateClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const clientData = {
      name: formData.get('name'),
    };

    try {
      const response = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      if (response.ok) {
        const newClient = await response.json();
        dispatch({ type: 'ADD_CLIENT', payload: newClient });
      }
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jobData = {
      title: formData.get('title'),
      description: formData.get('description'),
      salary: parseFloat(formData.get('salary') as string),
      city: formData.get('city'),
      uf: formData.get('uf'),
      type: formData.get('type'),
      client_id: formData.get('client_id'),
      start_date: formData.get('start_date') || null,
      end_date: formData.get('end_date') || null,
      recruiter_id: "00000000-0000-0000-0000-000000000001" // ID do Admin no BD
    };

    try {
      const response = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      if (response.ok) {
        const newJob = await response.json();
        dispatch({ type: 'ADD_JOB', payload: newJob });
        setRecruiterTab('jobs');
      }
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const handleUpdateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingJob) return;

    const formData = new FormData(e.currentTarget);
    const jobData = {
      title: formData.get('title'),
      description: formData.get('description'),
      salary: parseFloat(formData.get('salary') as string),
      city: formData.get('city'),
      uf: formData.get('uf'),
      type: formData.get('type'),
      client_id: formData.get('client_id'),
      start_date: formData.get('start_date') || null,
      end_date: formData.get('end_date') || null,
      recruiter_id: "00000000-0000-0000-0000-000000000001" // ID do Admin no BD
    };

    try {
      const response = await fetch(`${API_URL}/jobs/${editingJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      if (response.ok) {
        const updatedJob = await response.json();
        dispatch({ type: 'UPDATE_JOB', payload: updatedJob });
        setEditingJob(null);
        setRecruiterTab('jobs');
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/jobs/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        dispatch({ type: 'SET_JOBS', payload: jobs.filter(j => j.id !== id) });
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <Layout 
      view={view} 
      setView={setView} 
      isRecruiterLoggedIn={isRecruiterLoggedIn}
      onLogout={() => setIsRecruiterLoggedIn(false)}
    >
      <Toaster position="top-right" reverseOrder={false} />
      {view === 'candidate' ? (
        <JobBoard 
          jobs={jobs} 
          selectedJob={selectedJob}
          setSelectedJob={setSelectedJob}
          onApply={() => setIsRegisterModalOpen(true)} 
          onApplyBanco={() => {
            setSelectedJob(null);
            setIsRegisterModalOpen(true);
          }}
        />
      ) : (
        <>
          {!isRecruiterLoggedIn ? (
            <div className="max-w-md mx-auto py-12">
              <RecruiterLogin onLogin={(e) => {
                e.preventDefault();
                setIsRecruiterLoggedIn(true);
              }} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4 border-b pb-4">
                <button 
                  onClick={() => setRecruiterTab('dashboard')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${recruiterTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setRecruiterTab('clients')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${recruiterTab === 'clients' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  Clientes
                </button>
                <button 
                  onClick={() => setRecruiterTab('jobs')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${recruiterTab === 'jobs' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  Vagas
                </button>
                <button 
                  onClick={() => setRecruiterTab('candidates')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${recruiterTab === 'candidates' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  Candidatos
                </button>
                <button 
                  onClick={() => {
                    setEditingJob(null);
                    setRecruiterTab('add_job');
                  }}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${recruiterTab === 'add_job' ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  + Nova Vaga
                </button>
              </div>

              {recruiterTab === 'dashboard' && (
                <RecruiterDashboard 
                  jobs={jobs} 
                  candidates={candidates} 
                  ufFilter={dashboardUfFilter}
                  setUfFilter={setDashboardUfFilter}
                />
              )}
              {recruiterTab === 'clients' && (
                <ClientManagement 
                  clients={clients} 
                  onAddClient={handleCreateClient}
                />
              )}
              {recruiterTab === 'jobs' && (
                <JobManagement 
                  jobs={jobs} 
                  candidates={candidates}
                  clients={clients}
                  editingJob={editingJob}
                  setEditingJob={setEditingJob}
                  onUpdateJob={handleUpdateJob}
                />
              )}
              {recruiterTab === 'candidates' && (
                <CandidateManagement 
                  candidates={candidates} 
                  jobs={jobs}
                  clients={clients}
                  selectedCandidate={selectedCandidate}
                  setSelectedCandidate={setSelectedCandidate}
                />
              )}
              {recruiterTab === 'add_job' && (
                <JobForm 
                  clients={clients}
                  onAddJob={handleCreateJob}
                  onCancel={() => setRecruiterTab('jobs')}
                />
              )}

            </div>
          )}
        </>
      )}

      <ApplyModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        selectedJob={selectedJob}
        onRegister={(candidate) => dispatch({ type: 'REGISTER_CANDIDATE', payload: candidate })}
      />
    </Layout>
  );
}
