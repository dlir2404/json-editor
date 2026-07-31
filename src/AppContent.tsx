import React, { useState } from 'react';
import { useJSON } from './context/JSONContext';
import { Header } from './components/layout/Header';
import { Toolbar } from './components/layout/Toolbar';
import { BreadcrumbBar } from './components/layout/BreadcrumbBar';
import { FooterStats } from './components/layout/FooterStats';
import { JSONTreeViewer } from './components/tree/JSONTreeViewer';
import { MonacoCodeEditor } from './components/editor/MonacoCodeEditor';
import { EmptyPasteOverlay } from './components/EmptyPasteOverlay';
import { HistoryModal } from './components/modals/HistoryModal';

export const AppContent: React.FC = () => {
  const { viewMode } = useJSON();
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = e.currentTarget.getBoundingClientRect();
    const newRatio = ((e.clientX - container.left) / container.width) * 100;
    if (newRatio > 15 && newRatio < 85) {
      setSplitRatio(newRatio);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* Full-screen Paste Overlay when state is empty */}
      <EmptyPasteOverlay />

      {/* LocalStorage Edit History Modal */}
      <HistoryModal />

      {/* Top Header */}
      <Header />

      {/* Action Toolbar */}
      <Toolbar />

      {/* Interactive Path Breadcrumbs */}
      <BreadcrumbBar />

      {/* Main Workspace Area */}
      <main
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1 relative overflow-hidden flex"
      >
        {viewMode === 'split' && (
          <>
            {/* Visual Tree View Side */}
            <div style={{ width: `${splitRatio}%` }} className="h-full overflow-hidden border-r border-slate-200 dark:border-slate-800">
              <JSONTreeViewer />
            </div>

            {/* Draggable Divider */}
            <div
              onMouseDown={handleMouseDown}
              className="w-1.5 h-full bg-slate-200 dark:bg-slate-800 hover:bg-indigo-500 cursor-col-resize transition-colors z-20"
            />

            {/* Monaco Raw Code Editor Side */}
            <div style={{ width: `${100 - splitRatio}%` }} className="h-full overflow-hidden">
              <MonacoCodeEditor />
            </div>
          </>
        )}

        {viewMode === 'tree' && (
          <div className="w-full h-full">
            <JSONTreeViewer />
          </div>
        )}

        {viewMode === 'code' && (
          <div className="w-full h-full">
            <MonacoCodeEditor />
          </div>
        )}
      </main>

      {/* Footer Summary Stats Bar */}
      <FooterStats />
    </div>
  );
};
