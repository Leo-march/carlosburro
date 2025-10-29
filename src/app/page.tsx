// src/app/page.tsx
'use client';

import { useState } from 'react';
import { WarehouseProvider } from '@/context/WarehouseContext';
import WarehouseMap from '@/components/WarehouseMap';
import Dashboard from '@/components/Dashboard';
import ProblemModal from '@/components/ProblemModal';
import ProblemDetail from '@/components/ProblemDetail';
import { Problem } from '@/types';
import styles from './page.module.css';

function WarehouseApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'mapa'>('dashboard');
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [highlightedColumn, setHighlightedColumn] = useState<string | null>(null);

  const handleColumnClick = (columnId: string) => {
    setSelectedColumn(columnId);
  };

  const handleProblemClick = (problem: Problem) => {
    setSelectedProblem(problem);
  };

  const handleNavigateToMap = (columnId: string) => {
    setActiveTab('mapa');
    setHighlightedColumn(columnId);
    setTimeout(() => setHighlightedColumn(null), 3000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🏭 Sistema de Gestão de Depósito</h1>
        <nav className={styles.nav}>
          <button
            className={`${styles.navBtn} ${activeTab === 'dashboard' ? styles.active : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === 'mapa' ? styles.active : ''}`}
            onClick={() => setActiveTab('mapa')}
          >
            🗺️ Mapa
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        {activeTab === 'dashboard' && (
          <Dashboard onProblemClick={handleProblemClick} />
        )}
        {activeTab === 'mapa' && (
          <WarehouseMap onColumnClick={handleColumnClick} />
        )}
      </main>

      {selectedColumn && (
        <ProblemModal
          columnId={selectedColumn}
          onClose={() => setSelectedColumn(null)}
        />
      )}

      {selectedProblem && (
        <ProblemDetail
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onNavigateToMap={handleNavigateToMap}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <WarehouseProvider>
      <WarehouseApp />
    </WarehouseProvider>
  );
}