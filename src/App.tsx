import React from 'react';
import { Layout } from './components/common/Layout';
import { JobBoard } from './components/candidate/JobBoard';
import { RecruiterDashboard } from './components/recruiter/Dashboard';
import { JobManagement, JobForm } from './components/recruiter/JobManagement';
import { CandidateManagement } from './components/recruiter/CandidateManagement';
import { RecruiterLogin } from './components/recruiter/Login';
import { ApplyModal } from './components/candidate/ApplyModal';
import { useRhState } from './hooks/useRhState';

const API_URL = 'http://localhost:8001';

export default function App() {
  const {
    jobs,
    candidates,
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
      recruiter_id: "00000000-0000-0000-0000-000000000000" // Mock
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
      recruiter_id: "00000000-0000-0000-0000-000000000000" // Mock
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
      {view === 'candidate' ? (
        <JobBoard 
          jobs={jobs} 
          selectedJob={selectedJob}
          setSelectedJob={setSelectedJob}
          onApply={() => setIsRegisterModalOpen(true)} 
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
              {recruiterTab === 'jobs' && (
                <JobManagement 
                  jobs={jobs} 
                  candidates={candidates}
                  editingJob={editingJob}
                  setEditingJob={setEditingJob}
                  onUpdateJob={handleUpdateJob}
                />
              )}
              {recruiterTab === 'candidates' && (
                <CandidateManagement 
                  candidates={candidates} 
                  jobs={jobs}
                  selectedCandidate={selectedCandidate}
                  setSelectedCandidate={setSelectedCandidate}
                />
              )}
              {recruiterTab === 'add_job' && (
                <JobForm 
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
