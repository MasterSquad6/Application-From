import React, { useState, useEffect } from 'react';

const DebugConsole: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog(...args);
      setLogs((prev) => [...prev, args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')]);
    };

    console.error = (...args) => {
      originalError(...args);
      setLogs((prev) => [...prev, 'ERROR: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')]);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-brand-deep text-white px-4 py-2 rounded-lg text-xs z-[9999]"
      >
        Show Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[400px] bg-slate-900 text-white rounded-lg p-4 z-[9999] overflow-auto shadow-2xl font-mono text-xs">
      <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
        <span className="font-bold">Debug Console</span>
        <button onClick={() => setIsOpen(false)} className="text-slate-400">Close</button>
      </div>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div key={i} className={log.startsWith('ERROR:') ? 'text-red-400' : 'text-slate-300'}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugConsole;
