// src/components/ProblemModal.tsx
'use client';

import { useState } from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { ProblemType } from '@/types';
import styles from './ProblemModal.module.css';

interface ProblemModalProps {
  columnId: string;
  onClose: () => void;
}

export default function ProblemModal({ columnId, onClose }: ProblemModalProps) {
  const { addProblem } = useWarehouse();
  const [tipo, setTipo] = useState<ProblemType>('falta-estoque');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (descricao.trim()) {
      addProblem(columnId, tipo, descricao);
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Reportar Problema - Coluna {columnId}</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="tipo">Tipo de Problema:</label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as ProblemType)}
              className={styles.select}
            >
              <option value="falta-estoque">Falta de Estoque</option>
              <option value="quebrado">Quebrado</option>
              <option value="manutencao">Manutenção</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="descricao">Descrição:</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className={styles.textarea}
              placeholder="Descreva o problema..."
              rows={5}
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn}>
              Reportar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}