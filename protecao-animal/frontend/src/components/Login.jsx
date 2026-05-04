/*
  Página de login do Admin (sem backend)
*/

import { useState } from "react";

export default function Login({ setLogado }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const entrar = () => {
    // 🔐 Credenciais fixas
    if (
      usuario === "admin_protecao" &&
      senha === "caes_gatos_2026"
    ) {
      // salvar login no navegador
      localStorage.setItem("logado", "true");

      setLogado(true);
    } else {
      alert("Usuário ou senha incorretos");
    }
  };

  return (
    <div className="container">
      <h2>Login Administrador</h2>

      <input
        placeholder="Usuário"
        value={usuario}
        onChange={e => setUsuario(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
      />

      <br />

      <button className="primary" onClick={entrar}>
        Entrar
      </button>
    </div>
  );
}