import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BRAZIL_STATES } from '../../constants';
import { Job, Gender, Candidate } from '../../types';
import { validateCPF } from '../../utils/validation';
import { CheckCircle2 } from 'lucide-react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJob: Job | null;
  onRegister: (candidate: Candidate) => void;
}

export const ApplyModal = ({ isOpen, onClose, selectedJob, onRegister }: ApplyModalProps) => {
  const [resumeType, setResumeType] = useState<'text' | 'file'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegisterCandidate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedJob) return;

    const formData = new FormData(e.currentTarget);
    const cpf = formData.get('cpf') as string;
    
    if (!validateCPF(cpf)) {
      alert('CPF inválido! Certifique-se de digitar os 11 dígitos corretamente.');
      return;
    }

    setIsLoading(true);
    try {
      // Preparar payload para o backend
      const payload = new FormData();
      payload.append('job_id', selectedJob.id);
      payload.append('name', formData.get('fullName') as string);
      payload.append('email', formData.get('email') as string);
      payload.append('phone', formData.get('phone') as string);
      payload.append('cpf', cpf);
      payload.append('city', formData.get('city') as string);
      payload.append('uf', formData.get('uf') as string);
      payload.append('gender', formData.get('gender') as string);

      if (resumeType === 'text') {
        const text = formData.get('resumeText') as string;
        if (!text) throw new Error('Por favor, preencha o currículo.');
        payload.append('resume_text', text);
      } else {
        const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput.files?.[0]) {
          payload.append('resume_file', fileInput.files[0]);
        } else {
          throw new Error('Por favor, selecione o arquivo PDF.');
        }
      }

      // Chamada real para o Backend FastAPI
      const response = await fetch('http://localhost:8001/candidates', {
        method: 'POST',
        body: payload
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Erro ao cadastrar candidatura no servidor.');
      }

      const data = await response.json();

      // Mapear retorno do backend para o tipo do Frontend
      const newCandidate: Candidate = {
        id: data.id,
        jobId: data.job_id,
        fullName: data.name,
        city: data.city || formData.get('city'),
        uf: data.uf,
        phone: formData.get('phone') as string,
        email: data.email,
        cpf: cpf,
        resume: data.resume_text,
        gender: data.gender as Gender,
        score: data.ai_score,
        aiJustification: data.ai_justification,
        createdAt: data.created_at,
      };

      onRegister(newCandidate);
      setIsSuccess(true);
      
      // Auto-fechamento após 2 segundos
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2000);

    } catch (error: any) {
      console.error('Erro detalhado na candidatura:', error);
      const errorMessage = error.message === 'Failed to fetch' 
        ? 'Erro de conexão com o servidor. Verifique se o backend está rodando na porta 8000.'
        : error.message;
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Sucesso!">
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Candidatura Enviada!</h3>
          <p className="text-gray-500 max-w-xs">
            Sua inscrição para <strong>{selectedJob?.title}</strong> foi processada e analisada pela nossa IA.
          </p>
          <div className="text-xs text-blue-500 font-bold animate-pulse pt-4">
            Fechando em instantes...
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
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
              <option value="Outro">Outro / Prefiro não responder</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700">Currículo *</label>
          <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
            <button 
              type="button"
              onClick={() => setResumeType('text')}
              className={`flex-1 p-2 text-center rounded-md transition-all text-sm font-medium ${resumeType === 'text' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              Texto Livre
            </button>
            <button 
              type="button"
              onClick={() => setResumeType('file')}
              className={`flex-1 p-2 text-center rounded-md transition-all text-sm font-medium ${resumeType === 'file' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >
              Upload PDF
            </button>
          </div>
          
          <div className="mt-2">
            {resumeType === 'text' ? (
              <textarea 
                name="resumeText" 
                rows={4} 
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Descreva suas experiências, habilidades e formação..."
              ></textarea>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-500 transition-all">
                <input type="file" name="resumeFile" accept=".pdf" className="hidden" id="pdf-upload" />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <div className="text-blue-600 font-bold mb-2">Clique para selecionar seu PDF</div>
                  <div className="text-xs text-gray-400">Apenas arquivos .pdf são aceitos</div>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all ${isLoading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
          >
            {isLoading ? 'Analisando Currículo...' : 'Cadastrar Candidatura'}
          </button>
          <button type="button" onClick={onClose} className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};
