import { Outlet } from "react-router-dom";
import { Footer } from "../footer";
import { Header } from "../header";

export function Layout() {
  return (
    <div className="layout">
      <Header />
      <main>
        <Outlet /> {/* O Outlet renderiza o conteúdo da página atual */}
      </main>
      <Footer />
    </div>
  );
}
