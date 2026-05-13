/*
  Página de cadastro de animais disponíveis
  Versão com Supabase (upload + debug de erros)
*/

import { useState } from "react";
import { supabase } from "../services/supabase";

export default function CadastroAnimal() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [porte, setPorte] = useState("");
  const [imagem, setImagem] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const cadastrar = async () => {
    try {
      setCarregando(true);

      // validação
      if (!nome || !idade || !porte) {
        setCarregando(false);
        return alert("Preencha todos os campos!");
      }

      let urlImagem = null;

      /*
        =========================
        UPLOAD DA IMAGEM
        =========================
      */

      if (imagem) {
        console.log("Iniciando upload da imagem...");

        const extensao = imagem.name.split(".").pop();

        const nomeArquivo = `${Date.now()}.${extensao}`;

        // upload no bucket
        const { error: uploadError } = await supabase.storage
          .from("animais")
          .upload(nomeArquivo, imagem);

        if (uploadError) {
          console.error("ERRO STORAGE:", uploadError);
          alert(`Erro no upload: ${uploadError.message}`);
          setCarregando(false);
          return;
        }

        console.log("Upload realizado!");

        // gerar URL pública
        const { data: publicUrlData } = supabase.storage
          .from("animais")
          .getPublicUrl(nomeArquivo);

        urlImagem = publicUrlData.publicUrl;

        console.log("URL pública:", urlImagem);
      }

      /*
        =========================
        INSERIR NO BANCO
        =========================
      */

      console.log("Inserindo no banco...");

      const { data, error } = await supabase
        .from("animais")
        .insert([
          {
            nome,
            idade,
            porte,
            status: "disponivel",
            imagem: urlImagem
          }
        ])
        .select();

      if (error) {
        console.error("ERRO BANCO:", error);

        alert(`
Erro ao cadastrar:

${error.message}
        `);

        setCarregando(false);
        return;
      }

      console.log("Cadastro realizado:", data);

      alert("Animal cadastrado com sucesso!");

      /*
        =========================
        LIMPAR FORMULÁRIO
        =========================
      */

      setNome("");
      setIdade("");
      setPorte("");
      setImagem(null);

      const fileInput = document.querySelector('input[type="file"]');

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (error) {
      console.error("ERRO GERAL:", error);

      alert(`
Erro inesperado:

${error.message}
      `);

    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container">
      <h2 className="titulo-pagina">
        Cadastrar Animal
      </h2>

      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        placeholder="Idade"
        value={idade}
        onChange={(e) => setIdade(e.target.value)}
      />

      <select
        value={porte}
        onChange={(e) => setPorte(e.target.value)}
      >
        <option value="">Selecione o porte</option>
        <option>Pequeno</option>
        <option>Médio</option>
        <option>Grande</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagem(e.target.files[0])}
      />

      <br />

      <button
        className="primary"
        onClick={cadastrar}
        disabled={carregando}
      >
        {carregando ? "Salvando..." : "Salvar"}
      </button>
    </div>
  );
}