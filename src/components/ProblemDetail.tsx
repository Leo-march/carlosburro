// src/components/ProblemDetail.tsx
'use client';

import { useWarehouse } from '@/context/WarehouseContext';
import { Problem, ProblemStatus } from '@/types';
import styles from './ProblemDetail.module.css';

interface ProblemDetailProps {
  problem: Problem;
  onClose: () => void;
  onNavigateToMap: (columnId: string) => void;
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

const formatFullDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ProblemDetail({
  problem,
  onClose,
  onNavigateToMap,
}: ProblemDetailProps) {
  const { updateProblemStatus, deleteProblem } = useWarehouse();

  const handleStatusChange = (status: ProblemStatus) => {
    updateProblemStatus(problem.id, status);
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este problema?')) {
      deleteProblem(problem.id);
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Detalhes do Problema</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.mainInfo}>
            <div className={styles.column}>
              <span className={styles.label}>Coluna:</span>
              <span className={styles.value}>{problem.coluna}</span>
            </div>
            <div
              className={styles.tipo}
              style={{ backgroundColor: getTipoColor(problem.tipo) }}
            >
              {getTipoLabel(problem.tipo)}
            </div>
          </div>

          <div className={styles.section}>
            <h3>Descrição</h3>
            <p className={styles.descricao}>{problem.descricao}</p>
          </div>

          <div className={styles.section}>
            <h3>Status Atual</h3>
            <div className={styles.statusButtons}>
              <button
                className={`${styles.statusBtn} ${
                  problem.status === 'pendente' ? styles.active : ''
                }`}
                onClick={() => handleStatusChange('pendente')}
              >
                Pendente
              </button>
              <button
                className={`${styles.statusBtn} ${
                  problem.status === 'em-andamento' ? styles.active : ''
                }`}
                onClick={() => handleStatusChange('em-andamento')}
              >
                Em Andamento
              </button>
              <button
                className={`${styles.statusBtn} ${
                  problem.status === 'resolvido' ? styles.active : ''
                }`}
                onClick={() => handleStatusChange('resolvido')}
              >
                Resolvido
              </button>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Informações</h3>
            <div className={styles.info}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Criado em:</span>
                <span>{formatFullDate(problem.criadoEm)}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Atualizado em:</span>
                <span>{formatFullDate(problem.atualizadoEm)}</span>
              </div>
              {problem.resolvidoEm && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Resolvido em:</span>
                  <span>{formatFullDate(problem.resolvidoEm)}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.mapBtn}
              onClick={() => {
                onNavigateToMap(problem.coluna);
                onClose();
              }}
            >
              📍 Ver no Mapa
            </button>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              🗑️ Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}