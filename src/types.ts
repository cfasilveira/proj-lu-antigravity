export type JobType = 'Remoto' | 'Presencial' | 'Híbrido';
export type Gender = 'M' | 'F' | 'Outro';

export interface Client {
  id: string;
  name: string;
  createdAt: string;
}

export interface Job {
  id: string;
  clientId: string;
  clientName?: string;
  title: string;
  description: string;
  city: string;
  uf: string;
  salary: number;
  type: JobType;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface WhatsAppMessage {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  jobId: string | null;
  fullName: string;
  city: string;
  uf: string;
  phone: string;
  email: string;
  cpf: string;
  salaryExpectation?: number;
  resume: string; // Text content for scoring
  gender: Gender;
  score: number;
  aiJustification?: string;
  aiStrengths?: string[];
  aiWeaknesses?: string[];
  notes?: string;
  whatsappSent?: boolean;
  hired?: boolean;
  createdAt: string;
}

export interface User {
  role: 'candidate' | 'recruiter';
}
