import { useParams } from "react-router-dom";

export function Detail() {
  const { id } = useParams(); // Captura o parâmetro da URL

  return (
    <div>
      <h1>Detalhes: {id}</h1>
    </div>
  );
}
