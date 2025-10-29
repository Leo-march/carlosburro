// src/context/WarehouseContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Problem, ProblemType, ProblemStatus } from '@/types';

interface WarehouseContextType {
  problems: Problem[];
  addProblem: (coluna: string, tipo: ProblemType, descricao: string) => void;
  updateProblemStatus: (id: string, status: ProblemStatus) => void;
  deleteProblem: (id: string) => void;
  getProblemsByColumn: (coluna: string) => Problem[];
  getTodayProblems: () => Problem[];
  getPendingProblems: () => Problem[];
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

export function WarehouseProvider({ children }: { children: ReactNode }) {
  const [problems, setProblems] = useState<Problem[]>([]);

  // Carregar problemas do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('warehouse-problems');
    if (stored) {
      setProblems(JSON.parse(stored));
    }
  }, []);

  // Salvar problemas no localStorage
  useEffect(() => {
    if (problems.length > 0) {
      localStorage.setItem('warehouse-problems', JSON.stringify(problems));
    }
  }, [problems]);

  const addProblem = (coluna: string, tipo: ProblemType, descricao: string) => {
    const newProblem: Problem = {
      id: Date.now().toString(),
      coluna,
      tipo,
      descricao,
      status: 'pendente',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    setProblems(prev => [...prev, newProblem]);
  };

  const updateProblemStatus = (id: string, status: ProblemStatus) => {
    setProblems(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              status,
              atualizadoEm: new Date().toISOString(),
              resolvidoEm: status === 'resolvido' ? new Date().toISOString() : p.resolvidoEm,
            }
          : p
      )
    );
  };

  const deleteProblem = (id: string) => {
    setProblems(prev => prev.filter(p => p.id !== id));
  };

  const getProblemsByColumn = (coluna: string) => {
    return problems.filter(p => p.coluna === coluna && p.status !== 'resolvido');
  };

  const getTodayProblems = () => {
    const today = new Date().toDateString();
    return problems.filter(p => new Date(p.criadoEm).toDateString() === today);
  };

  const getPendingProblems = () => {
    return problems.filter(p => p.status === 'pendente');
  };

  return (
    <WarehouseContext.Provider
      value={{
        problems,
        addProblem,
        updateProblemStatus,
        deleteProblem,
        getProblemsByColumn,
        getTodayProblems,
        getPendingProblems,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse must be used within WarehouseProvider');
  }
  return context;
}