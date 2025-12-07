import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <div className="toggle-wrapper">
      <style>{`
        /* Container do Switch */
        .toggle-wrapper {
          display: flex;
          align-items: center;
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 28px;
        }

        /* O Input fica invisível, mas controla o estado */
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        /* O Slider (a parte visual) */
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc; /* Cor desligado (Light Mode) */
          transition: .4s;
          border-radius: 34px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6px;
          box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        }

        /* A bolinha que se move */
        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
          z-index: 2;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        /* ESTADO: DARK MODE (ATIVADO) */
        input:checked + .slider {
          background-color: #00dc82; /* Verde Neon */
          box-shadow: 0 0 10px rgba(0, 220, 130, 0.4); /* Glow Neon */
        }

        /* Move a bolinha para a direita */
        input:checked + .slider:before {
          transform: translateX(24px);
        }

        /* Ícones dentro do switch (decorativos) */
        .icon {
          font-size: 12px;
          line-height: 1;
          z-index: 1;
          user-select: none;
        }
      `}</style>

      <label className="switch">
        <input 
          type="checkbox" 
          checked={theme === 'dark'} 
          onChange={toggleTheme} 
        />
        <span className="slider">
          <span className="icon">🌙</span>
          <span className="icon">☀️</span>
        </span>
      </label>
    </div>
  );
}