import { Outlet } from "react-router-dom";
import { Header } from "../header";
import { Footer } from "../footer";
import { Nav } from "../nav";
import { Aside } from "../aside";

export function Layout() {
  return (
    <div className="layout">
      <Header
        title="Pagebox"
        subtitle="Projeto de diretórios para controle de arquivos"
      />
      <Nav />
      <div className="content">
        <Aside />
        <section className="section-content">
          <Outlet />
        </section>
      </div>
      <Footer />
    </div>
  );
}
