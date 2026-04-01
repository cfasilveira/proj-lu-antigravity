export type JobType = 'Remoto' | 'Presencial' | 'Híbrido';
export type Gender = 'M' | 'F' | 'Outro';

export interface Job {
  id: string;
  title: string;
  description: string;
  city: string;
  uf: string;
  salary: number;
  type: JobType;
  createdAt: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  fullName: string;
  city: string;
  uf: string;
  phone: string;
  email: string;
  cpf: string;
  resume: string; // Text content for scoring
  gender: Gender;
  score: number;
  aiJustification?: string;
  createdAt: string;
}

export interface User {
  role: 'candidate' | 'recruiter';
}
