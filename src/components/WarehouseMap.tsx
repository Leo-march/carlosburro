// src/components/WarehouseMap.tsx
'use client';

import { useState } from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import styles from './WarehouseMap.module.css';

// Definição das colunas do depósito
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
      <h2>🗺️ Mapa do Depósito</h2>
      <svg className={styles.map} viewBox="0 0 700 500">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f8f9fa', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#e9ecef', stopOpacity: 1 }} />
          </linearGradient>
          
          <linearGradient id="columnNormal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#495057', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#343a40', stopOpacity: 1 }} />
          </linearGradient>
          
          <linearGradient id="columnHover" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#6c757d', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#495057', stopOpacity: 1 }} />
          </linearGradient>
          
          <linearGradient id="columnProblem" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ff8787', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ff6b6b', stopOpacity: 1 }} />
          </linearGradient>
          
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3"/>
          </filter>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Fundo do depósito */}
        <rect x="0" y="0" width="700" height="500" fill="url(#bgGradient)" />
        
        {/* Corredores com gradiente */}
        <rect x="0" y="270" width="700" height="10" fill="#dee2e6" opacity="0.6" />
        
        {/* Grid de fundo */}
        <g opacity="0.1">
          {Array.from({ length: 14 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 50}
              y1="0"
              x2={i * 50}
              y2="500"
              stroke="#999"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 50}
              x2="700"
              y2={i * 50}
              stroke="#999"
              strokeWidth="1"
            />
          ))}
        </g>
        
        {/* Colunas */}
        {columns.map((col, index) => {
          const problemCount = getProblemsByColumn(col.id).length;
          const isHovered = hoveredColumn === col.id;
          const hasProblem = problemCount > 0;
          
          return (
            <g
              key={col.id}
              onMouseEnter={() => setHoveredColumn(col.id)}
              onMouseLeave={() => setHoveredColumn(null)}
              onClick={() => onColumnClick(col.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Sombra da coluna */}
              {isHovered && (
                <rect
                  x={col.x - 2}
                  y={col.y - 2}
                  width={col.width + 4}
                  height={col.height + 4}
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="3"
                  rx="6"
                  opacity="0.6"
                  filter="url(#glow)"
                >
                  <animate
                    attributeName="opacity"
                    values="0.6;1;0.6"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </rect>
              )}
              
              {/* Coluna principal */}
              <rect
                x={col.x}
                y={col.y}
                width={col.width}
                height={col.height}
                fill={hasProblem ? 'url(#columnProblem)' : isHovered ? 'url(#columnHover)' : 'url(#columnNormal)'}
                stroke={isHovered ? '#4CAF50' : hasProblem ? '#ff5252' : '#212529'}
                strokeWidth="2"
                rx="4"
                filter={isHovered ? 'url(#shadow)' : ''}
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: 'center'
                }}
              >
                <animate
                  attributeName="opacity"
                  values="0;1"
                  dur="0.5s"
                  begin={`${index * 0.05}s`}
                  fill="freeze"
                />
              </rect>
              
              {/* Efeito de brilho interno */}
              <rect
                x={col.x + 4}
                y={col.y + 4}
                width={col.width - 8}
                height="2"
                fill="white"
                opacity="0.3"
                rx="1"
              />
              
              {/* Nome da coluna */}
              <text
                x={col.x + col.width / 2}
                y={col.y + col.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="20"
                fontWeight="bold"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s'
                }}
              >
                <animate
                  attributeName="opacity"
                  values="0;1"
                  dur="0.5s"
                  begin={`${index * 0.05 + 0.2}s`}
                  fill="freeze"
                />
                {col.nome}
              </text>
              
              {/* Indicador de problemas com animação */}
              {problemCount > 0 && (
                <g>
                  <circle
                    cx={col.x + col.width - 18}
                    cy={col.y + 18}
                    r="16"
                    fill="white"
                    filter="url(#shadow)"
                  >
                    <animate
                      attributeName="r"
                      values="16;18;16"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={col.x + col.width - 18}
                    cy={col.y + 18}
                    r="20"
                    fill="none"
                    stroke="#ff6b6b"
                    strokeWidth="2"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      values="16;24;16"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.5;0;0.5"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <text
                    x={col.x + col.width - 18}
                    y={col.y + 18}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ff6b6b"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {problemCount}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        
        {/* Legenda com design moderno */}
        <g>
          <rect x="15" y="15" width="280" height="60" fill="white" rx="8" opacity="0.95" filter="url(#shadow)" />
          <text x="30" y="35" fill="#333" fontSize="14" fontWeight="bold">
            Legenda:
          </text>
          
          <rect x="30" y="45" width="35" height="18" fill="url(#columnNormal)" rx="4" />
          <text x="72" y="58" fill="#666" fontSize="13">
            Sem problemas
          </text>
          
          <rect x="170" y="45" width="35" height="18" fill="url(#columnProblem)" rx="4" />
          <text x="212" y="58" fill="#666" fontSize="13">
            Com problemas
          </text>
        </g>
      </svg>
    </div>
  );
}