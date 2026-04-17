import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  TrendingUp, 
  Map, 
  Filter,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from 'lucide-react';
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
  Legend,
  LabelList
} from 'recharts';
import { Job, Candidate } from '../../types';
import { BRAZIL_STATES } from '../../constants';
import { cn } from '../../utils/helpers';

interface DashboardProps {
  jobs: Job[];
  candidates: Candidate[];
  ufFilter: string;
  setUfFilter: (uf: string) => void;
}

const KpiCard = ({ label, value, subValue, icon: Icon, color, delay, rotate = false }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
  >
    <div className={cn(
      "w-12 h-12 rounded-xl flex items-center justify-center",
      color === 'blue' && "bg-blue-50 text-blue-600",
      color === 'green' && "bg-green-50 text-green-600",
      color === 'purple' && "bg-purple-50 text-purple-600",
      color === 'orange' && "bg-orange-50 text-orange-600",
      color === 'red' && "bg-red-50 text-red-600",
      color === 'indigo' && "bg-indigo-50 text-indigo-600",
      color === 'pink' && "bg-pink-50 text-pink-600",
    )}>
      <Icon size={24} className={rotate ? "rotate-180" : ""} />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      {subValue && <p className="text-[10px] text-gray-500 font-medium truncate max-w-[120px]">{subValue}</p>}
    </div>
  </motion.div>
);

export const RecruiterDashboard = ({ jobs, candidates, ufFilter, setUfFilter }: DashboardProps) => {
  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const totalCandidates = candidates.length;
    
    const filteredJobs = ufFilter ? jobs.filter(j => j.uf === ufFilter) : jobs;
    const filteredCandidates = ufFilter ? candidates.filter(c => c.uf === ufFilter) : candidates;

    const filledJobs = jobs.filter(j => candidates.some(c => c.jobId === j.id)).length;
    const filledPercentage = totalJobs > 0 ? (filledJobs / totalJobs) * 100 : 0;

    const jobCounts = candidates.reduce((acc, c) => {
      acc[c.jobId] = (acc[c.jobId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedJobCounts = Object.entries(jobCounts).sort((a, b) => b[1] - a[1]);
    const mostWanted = sortedJobCounts[0];
    const leastWanted = sortedJobCounts[sortedJobCounts.length - 1];

    const mostWantedPercent = totalCandidates > 0 && mostWanted ? (mostWanted[1] / totalCandidates) * 100 : 0;
    const leastWantedPercent = totalCandidates > 0 && leastWanted ? (leastWanted[1] / totalCandidates) * 100 : 0;

    const mostWantedJob = mostWanted ? jobs.find(j => j.id === mostWanted[0])?.title : '-';
    const leastWantedJob = leastWanted ? jobs.find(j => j.id === leastWanted[0])?.title : '-';

    const ufCounts = jobs.reduce((acc, j) => {
      acc[j.uf] = (acc[j.uf] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedUfCounts = Object.entries(ufCounts).sort((a, b) => b[1] - a[1]);
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
      genderDist: [
        { name: 'M', value: filteredCandidates.filter(c => c.gender === 'M').length },
        { name: 'F', value: filteredCandidates.filter(c => c.gender === 'F').length }
      ],
      candidatesPerJob: filteredJobs.map(j => {
        const count = candidates.filter(c => c.jobId === j.id).length;
        const pct = candidates.length > 0
          ? ((count / candidates.length) * 100).toFixed(1)
          : '0';
        return { name: j.title, count, percent: `${pct}%` };
      }),
      jobsPerUf: Object.entries(ufFilter ? { [ufFilter]: ufCounts[ufFilter] || 0 } : ufCounts).map(([uf, count]) => ({ uf, count }))
    };
  }, [jobs, candidates, ufFilter]);

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total de Vagas" value={stats.totalJobs} icon={Briefcase} color="blue" delay={0} />
        <KpiCard label="Vagas Preenchidas" value={`${stats.filledPercentage.toFixed(1)}%`} icon={UserCheck} color="green" delay={0.05} />
        <KpiCard label="Total Candidatos" value={stats.totalCandidates} icon={Users} color="purple" delay={0.1} />
        <KpiCard label="Vaga Mais Procurada" value={`${stats.mostWantedPercent.toFixed(1)}%`} subValue={stats.mostWantedJob} icon={TrendingUp} color="orange" delay={0.15} />
        <KpiCard label="Vaga Menos Procurada" value={`${stats.leastWantedPercent.toFixed(1)}%`} subValue={stats.leastWantedJob} icon={TrendingUp} color="red" delay={0.2} rotate />
        <KpiCard label="UF com Mais Vagas" value={stats.ufMost} icon={Map} color="indigo" delay={0.25} />
        <KpiCard label="UF com Menos Vagas" value={stats.ufLeast} icon={Map} color="pink" delay={0.3} />
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
            value={ufFilter}
            onChange={(e) => setUfFilter(e.target.value)}
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.jobsPerUf}>
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
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.genderDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => {
                    const total = stats.genderDist.reduce((s, d) => s + d.value, 0);
                    const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                    return `${name} - ${pct}%`;
                  }}
                  labelLine={true}
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#ec4899" />
                </Pie>
                <Tooltip formatter={(value: number) => {
                  const total = stats.genderDist.reduce((s, d) => s + d.value, 0);
                  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                  return [`${value} (${pct}%)`, 'Candidatos'];
                }} />
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.candidatesPerJob} layout="vertical" margin={{ left: 10, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} hide />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]}>
                  <LabelList 
                    dataKey="name" 
                    position="insideLeft" 
                    offset={12}
                    style={{ fill: '#fff', fontSize: '11px', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }} 
                  />
                  <LabelList
                    dataKey="percent"
                    position="right"
                    style={{ fill: '#10b981', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
