<div align="center">
<img width="1200" height="475" alt="RH Connect Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# RH Connect - Sistema de Gestão de Talentos

Plataforma moderna de recrutamento e seleção integrada com Inteligência Artificial para análise de currículos.

## 🚀 Melhorias Recentes (Abril 2026)

Realizamos uma série de otimizações técnicas e de interface para levar o projeto ao nível profissional:

- **Centralização de Configuração**: Toda a comunicação com a API foi centralizada em `src/constants.ts`, facilitando a manutenção e troca de ambientes.
- **Busca Funcional de Candidatos**: Implementação de filtro em tempo real por nome na visão do recrutador, com tratamento de imutabilidade de dados.
- **Novo Sistema de Notificações**: Substituição de alerts nativos por notificações "Toasts" fluidas via `react-hot-toast`, melhorando drasticamente a UX.
- **Otimização de Dependências**: Limpeza profunda do `package.json`, removendo 122 pacotes desnecessários e reduzindo o tamanho do projeto em ~32MB.
- **Correção de Estabilidade**: Sincronização ajustada para a porta `8001` do backend e tratamento de erros de conexão.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 4, Framer Motion, Lucide React, Recharts.
- **Backend**: FastAPI (Python), Supabase (PostgreSQL), Gemini AI / Ollama.

## 💻 Como Rodar Localmente

### Pré-requisitos
- Node.js (v18+)
- Backend rodando na porta `8001`

### Passo a Passo

1. **Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Configurar Variáveis**:
   Crie um arquivo `.env` (ou use os segredos do AI Studio) com sua `GEMINI_API_KEY`.

3. **Executar o App**:
   ```bash
   npm run dev
   ```
   Acesse: `http://localhost:3000`

---
*RH Connect - Conectando talentos ao futuro através da tecnologia.*
