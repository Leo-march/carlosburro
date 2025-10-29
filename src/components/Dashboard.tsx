// src/components/Dashboard.tsx
'use client';

import { useWarehouse } from '@/context/WarehouseContext';
import { Problem } from '@/types';
import styles from './Dashboard.module.css';

interface DashboardProps {
  onProblemClick: (problem: Problem) => void;
}

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    'falta-estoque': 'Falta de Estoque',
    'quebrado': 'Quebrado',
    'manutencao': 'Manutenção',
    'outro': 'Outro',
  };
  return labels[tipo] || tipo;
};

const getTipoColor = (tipo: string) => {
  const colors: Record<string, string> = {
    'falta-estoque': '#ff9800',
    'quebrado': '#f44336',
    'manutencao': '#2196f3',
    'outro': '#9c27b0',
  };
  return colors[tipo] || '#666';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pendente': 'Pendente',
    'em-andamento': 'Em Andamento',
    'resolvido': 'Resolvido',
  };
  return labels[status] || status;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function Dashboard({ onProblemClick }: DashboardProps) {
  const { getTodayProblems, getPendingProblems } = useWarehouse();
  
  const todayProblems = getTodayProblems();
  const pendingProblems = getPendingProblems();

  const renderProblemCard = (problem: Problem) => (
    <div
      key={problem.id}
      className={styles.card}
      onClick={() => onProblemClick(problem)}
    >
      <div className={styles.cardHeader}>
        <span className={styles.column}>Coluna {problem.coluna}</span>
        <span
          className={styles.tipo}
          style={{ backgroundColor: getTipoColor(problem.tipo) }}
        >
          {getTipoLabel(problem.tipo)}
        </span>
      </div>
      
      <p className={styles.descricao}>{problem.descricao}</p>
      
      <div className={styles.cardFooter}>
        <span className={styles.status}>
          {getStatusLabel(problem.status)}
        </span>
        <span className={styles.date}>
          {formatDate(problem.criadoEm)}
        </span>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboard}>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{pendingProblems.length}</div>
          <div className={styles.statLabel}>Problemas Pendentes</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{todayProblems.length}</div>
          <div className={styles.statLabel}>Problemas Hoje</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Problemas Pendentes</h2>
        {pendingProblems.length === 0 ? (
          <div className={styles.empty}>
            <p>🎉 Nenhum problema pendente!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {pendingProblems.map(renderProblemCard)}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2>Problemas de Hoje</h2>
        {todayProblems.length === 0 ? (
          <div className={styles.empty}>
            <p>Nenhum problema reportado hoje.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {todayProblems.map(renderProblemCard)}
          </div>
        )}
      </div>
    </div>
  );
}