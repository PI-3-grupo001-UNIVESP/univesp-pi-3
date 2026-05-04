/*
  Página de cadastro de animais disponíveis
  Versão com Supabase (upload de imagem + banco)
*/

import { useState } from "react";
import { supabase } from "../services/supabase";

export default function CadastroAnimal() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [porte, setPorte] = useState("");
  const [imagem, setImagem] = useState(null);

  const cadastrar = async () => {
    try {
      if (!nome || !idade || !porte) {
        return alert("Preencha todos os campos!");
      }

      let urlImagem = null;

      // 🔹 Upload da imagem no Supabase Storage
      if (imagem) {
        const nomeArquivo = `${Date.now()}-${imagem.name}`;

        const { error: uploadError } = await supabase.storage
          .from("animais")
          .upload(nomeArquivo, imagem);

        if (uploadError) throw uploadError;

        //  Gerar URL pública da imagem
        const { data } = supabase.storage
          .from("animais")
          .getPublicUrl(nomeArquivo);

        urlImagem = data.publicUrl;
      }

      //  Inserir no banco
      const { error } = await supabase
        .from("animais")
        .insert([
          {
            nome,
            idade,
            porte,
            status: "disponivel",
            imagem: urlImagem
          }
        ]);

      if (error) throw error;

      alert("Animal cadastrado com sucesso!");

      // limpar formulário
      setNome("");
      setIdade("");
      setPorte("");
      setImagem(null);

      //  limpar input file
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar animal");
    }
  };

  return (
    <div className="container">
      <h2 className="titulo-pagina">Cadastrar Animal</h2>

      <input
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
      />

      <input
        placeholder="Idade"
        value={idade}
        onChange={e => setIdade(e.target.value)}
      />

      <select value={porte} onChange={e => setPorte(e.target.value)}>
        <option value="">Selecione o porte</option>
        <option>Pequeno</option>
        <option>Médio</option>
        <option>Grande</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={e => setImagem(e.target.files[0])}
      />

      <br />

      <button className="primary" onClick={cadastrar}>
        Salvar
      </button>
    </div>
  );
}