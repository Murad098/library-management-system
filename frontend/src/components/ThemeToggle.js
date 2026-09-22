import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { readTheme, applyTheme } from "../utils/theme";

function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme);
  const isLight = theme === "light";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <button
      type="button"
      className="icon-button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

export default ThemeToggle;
