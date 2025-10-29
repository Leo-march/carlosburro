// src/components/WarehouseMap.tsx
'use client';

import { useState } from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import styles from './WarehouseMap.module.css';

// Definição das colunas do depósito (você pode ajustar conforme seu layout)
const columns = [
  // Linha 1
  { id: 'A1', nome: 'A1', x: 50, y: 100, width: 80, height: 150 },
  { id: 'A2', nome: 'A2', x: 150, y: 100, width: 80, height: 150 },
  { id: 'A3', nome: 'A3', x: 250, y: 100, width: 80, height: 150 },
  { id: 'A4', nome: 'A4', x: 350, y: 100, width: 80, height: 150 },
  { id: 'A5', nome: 'A5', x: 450, y: 100, width: 80, height: 150 },
  { id: 'A6', nome: 'A6', x: 550, y: 100, width: 80, height: 150 },
  
  // Linha 2
  { id: 'B1', nome: 'B1', x: 50, y: 300, width: 80, height: 150 },
  { id: 'B2', nome: 'B2', x: 150, y: 300, width: 80, height: 150 },
  { id: 'B3', nome: 'B3', x: 250, y: 300, width: 80, height: 150 },
  { id: 'B4', nome: 'B4', x: 350, y: 300, width: 80, height: 150 },
  { id: 'B5', nome: 'B5', x: 450, y: 300, width: 80, height: 150 },
  { id: 'B6', nome: 'B6', x: 550, y: 300, width: 80, height: 150 },
];

interface WarehouseMapProps {
  onColumnClick: (columnId: string) => void;
}

export default function WarehouseMap({ onColumnClick }: WarehouseMapProps) {
  const { getProblemsByColumn } = useWarehouse();
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <h2>Mapa do Depósito</h2>
      <svg className={styles.map} viewBox="0 0 700 500">
        {/* Fundo do depósito */}
        <rect x="0" y="0" width="700" height="500" fill="#f5f5f5" />
        
        {/* Corredores */}
        <rect x="0" y="270" width="700" height="10" fill="#ddd" />
        
        {/* Colunas */}
        {columns.map(col => {
          const problemCount = getProblemsByColumn(col.id).length;
          const isHovered = hoveredColumn === col.id;
          
          return (
            <g
              key={col.id}
              onMouseEnter={() => setHoveredColumn(col.id)}
              onMouseLeave={() => setHoveredColumn(null)}
              onClick={() => onColumnClick(col.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Coluna */}
              <rect
                x={col.x}
                y={col.y}
                width={col.width}
                height={col.height}
                fill={problemCount > 0 ? '#ff6b6b' : isHovered ? '#555' : '#333'}
                stroke={isHovered ? '#000' : '#222'}
                strokeWidth="2"
                opacity={isHovered ? 0.9 : 0.8}
              />
              
              {/* Nome da coluna */}
              <text
                x={col.x + col.width / 2}
                y={col.y + col.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="18"
                fontWeight="bold"
              >
                {col.nome}
              </text>
              
              {/* Indicador de problemas */}
              {problemCount > 0 && (
                <>
                  <circle
                    cx={col.x + col.width - 15}
                    cy={col.y + 15}
                    r="12"
                    fill="#fff"
                  />
                  <text
                    x={col.x + col.width - 15}
                    y={col.y + 15}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ff6b6b"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {problemCount}
                  </text>
                </>
              )}
            </g>
          );
        })}
        
        {/* Legenda */}
        <g>
          <text x="20" y="30" fill="#666" fontSize="14" fontWeight="bold">
            Legenda:
          </text>
          <rect x="20" y="40" width="30" height="15" fill="#333" opacity="0.8" />
          <text x="55" y="52" fill="#666" fontSize="12">
            Sem problemas
          </text>
          <rect x="150" y="40" width="30" height="15" fill="#ff6b6b" opacity="0.8" />
          <text x="185" y="52" fill="#666" fontSize="12">
            Com problemas
          </text>
        </g>
      </svg>
    </div>
  );
}