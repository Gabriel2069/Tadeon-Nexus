import { useState } from "react";
import catalog from "@/data/tdv-arsenal-v09.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";
import { TdvAction } from "./tdv2-fields";
import { uid, type TdvRecord } from "@/lib/tdv2";

type Kind = "Arma" | "Equipamento";
const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const entries = catalog.items.map((item) => ({
  ...item,
  terms: fold([item.name, ...Object.values(item.fields)].join(" ")),
}));

export function TdvArsenal({
  kind,
  onAdd,
  full = false,
}: {
  kind?: Kind;
  onAdd?: (item: TdvRecord) => void;
  full?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const matches = entries.filter(
    (item) => (!kind || item.kind === kind) && item.terms.includes(fold(query.trim())),
  );
  const active = matches.find((item) => item.id === selected) ?? matches[0];
  function add() {
    if (!active || !onAdd || (active.kind !== "Arma" && active.kind !== "Equipamento")) return;
    const fields: Record<string, string> = {
      ...Object.fromEntries(Object.entries(active.fields).filter((entry): entry is [string, string] => typeof entry[1] === "string")),
      Catálogo: active.id,
      Edição: catalog.edition,
    };
    const space = fields["Porte e acesso"] ?? fields.Volume;
    const exact = /^(\d+) (?:E|Espaços?)$/.exec(space);
    if (exact) fields["Espaços"] = exact[1];
    onAdd({ id: uid(), kind: active.kind, name: active.name, fields });
  }
  return (
    <TdvAction
      title={
        kind === "Arma"
          ? "Consultar armas"
          : kind === "Equipamento"
            ? "Consultar equipamentos"
            : "Consultar Arsenal"
      }
    >
      <div className="tdv-arsenal">
        <label>
          Buscar por nome, família ou propriedade
          <Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <p className="tdv-note" role="status">
          {matches.length} {matches.length === 1 ? "registro" : "registros"} · Arsenal {catalog.edition}
        </p>
        {active ? (
          <>
            <label>
              Registro
              <select
                value={active.id}
                className="tadeon-dossier-field"
                onChange={(e) => setSelected(e.target.value)}
              >
                {matches.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <article>
              <span>{active.group}</span>
              <h3>{active.name}</h3>
              <dl>
                {Object.entries(active.fields)
                  .filter(([key]) => key !== "Grupo" && key !== "Família")
                  .map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
              </dl>
            </article>
            {onAdd && (
              <DialogClose asChild>
                <Button onClick={add} disabled={full}>
                  {full ? "Inventário no limite" : "Adicionar à ficha"}
                </Button>
              </DialogClose>
            )}
          </>
        ) : (
          <p>Experimente outro termo ou limpe a busca.</p>
        )}
        <details>
          <summary>Uso instrumental e Consonância</summary>
          <p>Um instrumento efetivamente empregado pode dar uma Passada de Proveito ao Fio pertinente. Vários instrumentos contam como um só auxílio. Vestir proteção ou atacar com a própria arma não concede esse Proveito.</p>
          <p>No Caderno de novembro, a Consonância exige acerto no Enlace e dois Fios conservados. O Retorno mínimo é 4 nos Patamares 0 e 1, 5 nos Patamares 2 e 3 e 6 nos Patamares 4 e 5. A ativação custa PE como Forçar e ocorre no máximo uma vez por rodada. Nas fichas anteriores, consulte o efeito e sua janela com o Mestre.</p>
        </details>
        <details>
          <summary>Tipos de dano e reservas</summary>
          <dl>
            {catalog.damageTypes.map((type) => (
              <div key={type.name}>
                <dt>
                  {type.name} · {type.family}
                </dt>
                <dd>
                  {type.source}. {type.reserve}.
                </dd>
              </div>
            ))}
          </dl>
        </details>
        <a href={catalog.source} target="_blank" rel="noreferrer">
          Abrir o catálogo de 23/11/2026
        </a>
      </div>
    </TdvAction>
  );
}
