/*
  Configuração do cabeçalho e do footer com autenticação persistente
*/

import { useState, useEffect } from "react";
import Home from "./components/Home";
import Animais from "./components/Animais";
import AdminArea from "./components/AdminArea";
import Login from "./components/Login";
import "./index.css";

function App() {
  const [pagina, setPagina] = useState("home");
  const [logado, setLogado] = useState(false);

  // 🔐 Verifica login salvo no navegador
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth === "true") {
      setLogado(true);
    }
  }, []);

  return (
    <>
      <header>
        <div className="logo">
          Proteção Animal <span>ONG</span>
        </div>

        <nav>
          <button onClick={() => setPagina("home")}>HOME</button>
          <button onClick={() => setPagina("animais")}>ADOÇÕES</button>
          <button onClick={() => setPagina("admin")}>ÁREA ADMIN</button>
        </nav>
      </header>

      {/* PÁGINAS */}
      {pagina === "home" && <Home />}
      {pagina === "animais" && <Animais />}

      {/* ÁREA ADMIN */}
      {pagina === "admin" && (
        logado ? (
          <AdminArea setLogado={setLogado} />
        ) : (
          <Login setLogado={setLogado} />
        )
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <h3>Proteção Animal ONG</h3>
            <p>Cuidando de cães e gatos com amor.</p>
          </div>

          <div>
            <p>Email: contato@protecaoanimal.org</p>
            <p>Telefone: (11) 99999-9999</p>
          </div>

          <div>
            <p>© {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;