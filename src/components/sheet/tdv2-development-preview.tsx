import { useState } from "react";
import { TdvAction } from "./tdv2-fields";
import { previewNovember } from "@/lib/tdv-constitution-november";
import type { TdvCharacter } from "@/lib/tdv2";

export function TdvDevelopmentPreview({ character }: { character: TdvCharacter }) {
  const origin = character.milestones.length;
  const [selected, setSelected] = useState<number | null>(null);
  const marco = Math.max(origin, selected ?? origin);
  const { current, projection } = previewNovember(character, marco);
  return (
    <TdvAction title="Comparar com o Caderno de novembro">
      <div className="tdv-projection">
        <p>
          Com os graus, reforços reconhecidos e modificadores desta ficha, explore como as reservas
          mudariam em cada Marco.
        </p>
        <label>
          Marco projetado <strong>{marco}</strong>
          <input
            type="range"
            min={origin}
            max={20}
            value={marco}
            disabled={origin === 20}
            onChange={(event) => setSelected(Number(event.target.value))}
          />
        </label>
        <table>
          <caption>Reservas · Patamar {projection.patamar}</caption>
          <thead>
            <tr>
              <th>Reserva</th>
              <th>Atual</th>
              <th>Máx. da ficha</th>
              <th>Máx. projetado</th>
            </tr>
          </thead>
          <tbody>
            {(["pv", "pi", "pe"] as const).map((key) => (
              <tr key={key}>
                <th scope="row">{key.toUpperCase()}</th>
                <td>{character.resources[key]}</td>
                <td>{current.maximums[key]}</td>
                <td>
                  <strong>{projection.maximums[key]}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <strong>{projection.credit} PU</strong> de orçamento acumulado na edição de 23/11/2026. A
          comparação é de leitura. Compras e saldo desta ficha seguem a edição de origem.
        </p>
      </div>
    </TdvAction>
  );
}
