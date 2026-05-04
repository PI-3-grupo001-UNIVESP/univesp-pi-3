/*
  Área do Administrador (com exportação de dados)
*/

import { useState, useEffect } from "react";
import CadastroAnimal from "./CadastroAnimal";
import Adocao from "./Adocao";
import Dashboard from "./Dashboard";
import { supabase } from "../services/supabase";
import * as XLSX from "xlsx";

export default function AdminArea() {
  const [secao, setSecao] = useState("cadastro");
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const logado = localStorage.getItem("logado");
    if (logado === "true") {
      setAutenticado(true);
    }
  }, []);

  const sair = () => {
    localStorage.removeItem("logado");
    window.location.reload();
  };

  //  NOVA FUNÇÃO — EXPORTAR DADOS
  const exportarDados = async () => {
    try {
      // buscar dados do supabase
      const { data: animais } = await supabase.from("animais").select("*");
      const { data: adocoes } = await supabase.from("adocoes").select("*");

      // criar planilha
      const wb = XLSX.utils.book_new();

      const wsAnimais = XLSX.utils.json_to_sheet(animais || []);
      const wsAdocoes = XLSX.utils.json_to_sheet(adocoes || []);

      XLSX.utils.book_append_sheet(wb, wsAnimais, "Animais");
      XLSX.utils.book_append_sheet(wb, wsAdocoes, "Adocoes");

      // download
      XLSX.writeFile(wb, "relatorio_protecao_animal.xlsx");

    } catch (error) {
      console.error(error);
      alert("Erro ao exportar dados");
    }
  };

  // 🔐 proteção
  if (!autenticado) {
    return (
      <div className="container">
        <h2>Acesso restrito</h2>
        <p>Faça login para acessar esta área.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="titulo-pagina">Área do Administrador</h2>

      {/*  LOGOUT */}
      <button
        className="primary"
        style={{ marginBottom: "20px", background: "#c73d3d" }}
        onClick={sair}
      >
        Sair
      </button>

      {/*  NOVO BOTÃO EXPORTAR */}
      <button
        className="primary"
        style={{ marginBottom: "20px", marginLeft: "10px" }}
        onClick={exportarDados}
      >
        Exportar Dados (Excel)
      </button>

      <div style={{ marginBottom: "30px" }}>
        <button className="primary" onClick={() => setSecao("cadastro")}>
          Cadastro de Animais
        </button>

        <button
          className="primary"
          style={{ marginLeft: "15px" }}
          onClick={() => setSecao("adocao")}
        >
          Registrar Adoção
        </button>

        <button
          className="primary"
          style={{ marginLeft: "15px" }}
          onClick={() => setSecao("dashboard")}
        >
          Dashboard
        </button>
      </div>

      {secao === "cadastro" && <CadastroAnimal />}
      {secao === "adocao" && <Adocao />}
      {secao === "dashboard" && <Dashboard />}
    </div>
  );
}