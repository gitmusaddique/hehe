import { useEffect, useState } from "react";

export function useTheme() {
  const [theme] = useState<"dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    localStorage.setItem('fitlife_theme', 'dark');
  }, []);

  return { theme };
}
