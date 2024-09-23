import { useState } from "react";

export function Aside() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <aside className={isMinimized ? "minimized" : ""}>
      <button onClick={() => setIsMinimized(!isMinimized)}>
        {isMinimized ? "Expandir" : "Minimizar"}
      </button>
      {/* Conteúdo do menu lateral */}
    </aside>
  );
}
