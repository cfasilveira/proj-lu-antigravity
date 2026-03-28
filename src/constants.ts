/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Job, Candidate } from './types';

export const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Desenvolvedor Frontend React Sênior',
    description: 'Buscamos um desenvolvedor com sólida experiência em React, TypeScript e Tailwind CSS. Conhecimento em testes unitários e arquitetura de componentes é essencial. Experiência com Next.js e consumo de APIs REST/GraphQL será um diferencial.',
    city: 'São Paulo',
    uf: 'SP',
    salary: 12000,
    type: 'Remoto',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Analista de RH Pleno',
    description: 'Responsável pelo recrutamento e seleção de talentos técnicos. Necessário experiência em triagem de currículos, entrevistas por competências e integração de novos colaboradores. Conhecimento em ferramentas de gestão de RH.',
    city: 'Rio de Janeiro',
    uf: 'RJ',
    salary: 6500,
    type: 'Híbrido',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Gerente de Projetos Ágeis',
    description: 'Liderança de times multidisciplinares utilizando frameworks Scrum e Kanban. Foco em entrega de valor e melhoria contínua. Gestão de stakeholders e planejamento de sprints.',
    city: 'Belo Horizonte',
    uf: 'MG',
    salary: 15000,
    type: 'Presencial',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Designer UX/UI',
    description: 'Criação de interfaces intuitivas e centradas no usuário. Domínio de Figma e princípios de design system. Capacidade de realizar pesquisas com usuários e prototipagem de alta fidelidade.',
    city: 'Curitiba',
    uf: 'PR',
    salary: 8000,
    type: 'Remoto',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Engenheiro de Dados',
    description: 'Construção e manutenção de pipelines de dados. Experiência com Python, SQL e tecnologias de Big Data (Spark, Hadoop). Conhecimento em arquiteturas de Data Warehouse e Data Lake.',
    city: 'Florianópolis',
    uf: 'SC',
    salary: 11000,
    type: 'Remoto',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    jobId: '1',
    fullName: 'João Silva',
    city: 'São Paulo',
    uf: 'SP',
    phone: '(11) 98888-7777',
    email: 'joao.silva@email.com',
    cpf: '123.456.789-00',
    resume: 'Desenvolvedor React com 5 anos de experiência. Especialista em TypeScript, Tailwind e arquitetura de software.',
    gender: 'M',
    score: 95,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c2',
    jobId: '1',
    fullName: 'Maria Oliveira',
    city: 'Campinas',
    uf: 'SP',
    phone: '(19) 97777-6666',
    email: 'maria.oliveira@email.com',
    cpf: '234.567.890-11',
    resume: 'Experiência com desenvolvimento frontend usando Vue.js e React. Conhecimento básico de TypeScript.',
    gender: 'F',
    score: 70,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c3',
    jobId: '2',
    fullName: 'Ana Costa',
    city: 'Niterói',
    uf: 'RJ',
    phone: '(21) 96666-5555',
    email: 'ana.costa@email.com',
    cpf: '345.678.901-22',
    resume: 'Psicóloga com especialização em RH. 3 anos de experiência em recrutamento e seleção de perfis técnicos.',
    gender: 'F',
    score: 85,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c4',
    jobId: '3',
    fullName: 'Pedro Santos',
    city: 'Belo Horizonte',
    uf: 'MG',
    phone: '(31) 95555-4444',
    email: 'pedro.santos@email.com',
    cpf: '456.789.012-33',
    resume: 'Gerente de Projetos certificado PMP e Scrum Master. Experiência em grandes empresas de tecnologia.',
    gender: 'M',
    score: 90,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c5',
    jobId: '4',
    fullName: 'Carla Lima',
    city: 'Porto Alegre',
    uf: 'RS',
    phone: '(51) 94444-3333',
    email: 'carla.lima@email.com',
    cpf: '567.890.123-44',
    resume: 'Designer apaixonada por criar experiências incríveis. Domínio total de Figma e Adobe XD.',
    gender: 'F',
    score: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c6',
    jobId: '5',
    fullName: 'Lucas Mendes',
    city: 'Recife',
    uf: 'PE',
    phone: '(81) 93333-2222',
    email: 'lucas.mendes@email.com',
    cpf: '678.901.234-55',
    resume: 'Engenheiro de Dados com foco em Python e Spark. Experiência em migração de dados para nuvem.',
    gender: 'M',
    score: 75,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c7',
    jobId: '1',
    fullName: 'Roberto Souza',
    city: 'Curitiba',
    uf: 'PR',
    phone: '(41) 92222-1111',
    email: 'roberto.souza@email.com',
    cpf: '789.012.345-66',
    resume: 'Desenvolvedor Frontend focado em performance e acessibilidade. React e CSS-in-JS.',
    gender: 'M',
    score: 65,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c8',
    jobId: '2',
    fullName: 'Fernanda Rocha',
    city: 'Salvador',
    uf: 'BA',
    phone: '(71) 91111-0000',
    email: 'fernanda.rocha@email.com',
    cpf: '890.123.456-77',
    resume: 'Analista de RH com foco em treinamento e desenvolvimento. Experiência em dinâmicas de grupo.',
    gender: 'F',
    score: 60,
    createdAt: new Date().toISOString()
  }
];
