import { TdvResourceActions } from "./tdv2-competencies";
import { TdvEmblem } from "./tdv2-emblem";
import { constitution, setResource, type TdvCharacter } from "@/lib/tdv2";
import { toast } from "sonner";
/** A second view of the same character; no local resource ledger or inferred scene. */
export function TdvPlayPresence({
  name,
  character: c,
  onChange,
  canEdit,
}: {
  name: string;
  character: TdvCharacter;
  onChange: (c: TdvCharacter) => void;
  canEdit: boolean;
}) {
  const stats = constitution(c);
  return (
    <aside className="tdv-play-presence" aria-label="Presença em jogo">
      <div className="tdv-play-person">
        <TdvEmblem kind="pessoa" />
        <div>
          <small>{c.face.occupation || "Pessoa em cena"}</small>
          <strong>{name}</strong>
          <p>
            {c.face.anchor.shaken ? "Âncora Abalada" : "Âncora Assentada"} · {c.critical}
          </p>
        </div>
      </div>
      <div className="tdv-play-resources">
        {(["pv", "pi", "pe"] as const).map((key) => (
          <div className="tdv-resource" data-resource={key} key={key}>
            <small>{{ pv: "Vitalidade", pi: "Inteireza", pe: "Esforço" }[key]}</small>
            <TdvResourceActions
              name={key.toUpperCase()}
              value={c.resources[key]}
              maximum={stats.maximums[key]}
              disabled={!canEdit}
              onChange={(value) => {
                try {
                  onChange(setResource(c, key, value));
                } catch (error) {
                  toast.error((error as Error).message);
                }
              }}
            />
          </div>
        ))}
      </div>
      <div className="tdv-play-state">
        <span>
          Equilíbrio{" "}
          <b>
            {c.equilibrium > 0 ? "+" : ""}
            {c.equilibrium}
          </b>
        </span>
        <span>
          Tensão{" "}
          <b>
            {c.tension > 0 ? "+" : ""}
            {c.tension}
          </b>
        </span>
        <span>{c.conditions.length} condições</span>
      </div>
      {!c.ready && (
        <p role="status">Conclua a criação na ficha integral para operar a personagem.</p>
      )}
    </aside>
  );
}
