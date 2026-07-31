import React from 'react';
import { JSONProvider } from './context/JSONContext';
import { AppContent } from './AppContent';

export const App: React.FC = () => {
  return (
    <JSONProvider>
      <AppContent />
    </JSONProvider>
  );
};

export default App;
