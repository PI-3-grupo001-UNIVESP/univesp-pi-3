/*
  Página de registro de adoção
  Versão com Supabase (sem backend)
*/

import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Adocao() {
  const [animais, setAnimais] = useState([]);
  const [animalId, setAnimalId] = useState("");
  const [nomeAdotante, setNomeAdotante] = useState("");

  //  Buscar apenas animais disponíveis //
  const carregarAnimais = async () => {
    try {
      const { data, error } = await supabase
        .from("animais")
        .select("*")
        .eq("status", "disponivel")
        .order("id", { ascending: false });

      if (error) throw error;

      setAnimais(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    carregarAnimais();
  }, []);

  //  Registrar adoção //
  const registrar = async () => {
    try {
      if (!animalId || !nomeAdotante) {
        return alert("Preencha todos os campos!");
      }

      // 1. Inserir adoção
      const { error: erroAdocao } = await supabase
        .from("adocoes")
        .insert([
          {
            animal_id: animalId,
            nome_adotante: nomeAdotante
          }
        ]);

      if (erroAdocao) throw erroAdocao;

      // 2️. Atualizar status do animal
      const { error: erroAnimal } = await supabase
        .from("animais")
        .update({ status: "adotado" })
        .eq("id", animalId);

      if (erroAnimal) throw erroAnimal;

      alert("Adoção registrada com sucesso!");

      //  Resetar campos
      setAnimalId("");
      setNomeAdotante("");

      //  Atualizar lista
      carregarAnimais();

    } catch (error) {
      console.error(error);
      alert("Erro ao registrar adoção");
    }
  };

  return (
    <div className="container">
      <h2 className="titulo-pagina">Registrar Adoção</h2>

      <select value={animalId} onChange={e => setAnimalId(e.target.value)}>
        <option value="">Selecione o animal</option>
        {animais.map(a => (
          <option key={a.id} value={a.id}>
            {a.nome}
          </option>
        ))}
      </select>

      <input
        placeholder="Nome do adotante"
        value={nomeAdotante}
        onChange={e => setNomeAdotante(e.target.value)}
      />

      <br />

      <button className="primary" onClick={registrar}>
        Registrar
      </button>
    </div>
  );
}