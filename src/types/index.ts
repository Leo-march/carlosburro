// src/types/index.ts

export type ProblemType = 'falta-estoque' | 'quebrado' | 'manutencao' | 'outro';

export type ProblemStatus = 'pendente' | 'em-andamento' | 'resolvido';

export interface Problem {
  id: string;
  coluna: string;
  tipo: ProblemType;
  descricao: string;
  status: ProblemStatus;
  criadoEm: string;
  atualizadoEm: string;
  resolvidoEm?: string;
}

export interface WarehouseColumn {
  id: string;
  nome: string;
  x: number;
  y: number;
  width: number;
  height: number;
  problemasAtivos: number;
}