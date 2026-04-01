import React from 'react';
import { Modal } from '../common/Modal';
import { BRAZIL_STATES } from '../../constants';
import { Job, Gender, Candidate } from '../../types';
import { validateCPF } from '../../utils/validation';
import { calculateScore } from '../../utils/scoring';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJob: Job | null;
  onRegister: (candidate: Candidate) => void;
}

export const ApplyModal = ({ isOpen, onClose, selectedJob, onRegister }: ApplyModalProps) => {
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

    onRegister(newCandidate);
    onClose();
    alert('Cadastro realizado com sucesso!');
  };

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
          <button type="button" onClick={onClose} className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};
