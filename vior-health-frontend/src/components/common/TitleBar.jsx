import { useState, useEffect } from 'react';
import { Minus, Square, X, Copy, Heart } from 'lucide-react';

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const isElectron = window.electronAPI?.isElectron;

  useEffect(() => {
    if (isElectron && window.electronAPI?.onMaximizeChange) {
      window.electronAPI.onMaximizeChange((maximized) => {
        setIsMaximized(maximized);
      });
    }
  }, [isElectron]);

  const handleMinimize = () => {
    if (window.electronAPI?.minimizeWindow) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI?.maximizeWindow) {
      window.electronAPI.maximizeWindow();
    }
  };

  const handleClose = () => {
    if (window.electronAPI?.closeWindow) {
      window.electronAPI.closeWindow();
    }
  };

  // Only show custom titlebar in Electron
  if (!isElectron) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-between px-4 select-none z-[100]" style={{ WebkitAppRegion: 'drag' }}>
      {/* Left: Logo and Title */}
      <div className="flex items-center gap-2">
        {!logoError ? (
          <img 
            src="/src/assets/logo.png" 
            alt="ViorHealth" 
            className="h-5 w-auto"
            onError={() => setLogoError(true)}
          />
        ) : (
          <Heart className="w-5 h-5 text-white fill-white" />
        )}
        <span className="text-white text-sm font-semibold">ViorHealth</span>
      </div>

      {/* Center: Can add breadcrumbs or page title here if needed */}
      <div className="flex-1"></div>

      {/* Right: Window Controls */}
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
        <button
          onClick={handleMinimize}
          className="h-8 w-10 flex items-center justify-center hover:bg-white/10 transition-colors"
          title="Minimize"
        >
          <Minus className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={handleMaximize}
          className="h-8 w-10 flex items-center justify-center hover:bg-white/10 transition-colors"
          title={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? (
            <Copy className="w-3.5 h-3.5 text-white" />
          ) : (
            <Square className="w-3.5 h-3.5 text-white" />
          )}
        </button>
        <button
          onClick={handleClose}
          className="h-8 w-10 flex items-center justify-center hover:bg-red-600 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
