import { TdvCrisisTrackers } from "./tdv2-crisis-trackers";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TdvResourceActions } from "./tdv2-competencies";
import { TdvConditions } from "./tdv2-conditions";
import {
  constitution,
  setResource,
  setResourceModifier,
  addTension,
  equilibriumBand,
  type TdvCharacter,
} from "@/lib/tdv2";
import { toast } from "sonner";
export function TdvPlayPresence({
  name,
  character: c,
  onChange,
  canEdit,
  physical = false,
  onInspectState,
}: {
  name: string;
  character: TdvCharacter;
  onChange: (c: TdvCharacter) => void;
  canEdit: boolean;
  physical?: boolean;
  onInspectState?: () => void;
}) {
  const stats = constitution(c),
    id = useId();
  const run = (operation: () => TdvCharacter) => {
    try {
      onChange(operation());
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  return (
    <section className="tdv-play-presence" aria-label={`Recursos de ${name}`}>
      {physical && (
        <p className="tdv-physical-notice">
          Valores da ficha digital · alterações no tabuleiro físico precisam ser atualizadas aqui.
        </p>
      )}
      <div className="tdv-cockpit">
        <div id="tdv-recursos" className="tdv-play-resources">
          {(["pv", "pi", "pe"] as const).map((key) => {
            const ratio = Math.max(
              0,
              Math.min(1, c.resources[key] / Math.max(1, stats.maximums[key])),
            );
            return (
              <div className="tdv-resource" data-resource={key} key={key}>
                <h2>
                  <span>{{ pv: "Vitalidade", pi: "Inteireza", pe: "Esforço" }[key]}</span>
                  <small>{key.toUpperCase()}</small>
                </h2>
                <svg className="tdv-resource-arc" viewBox="0 0 120 80" aria-hidden="true">
                  <path
                    d="M12 66a48 48 0 1 1 96 0"
                    pathLength="100"
                    className="tdv-resource-arc__track"
                  />
                  <path
                    d="M12 66a48 48 0 1 1 96 0"
                    pathLength="100"
                    strokeDasharray={`${ratio * 100} 100`}
                    className="tdv-resource-arc__fill"
                  />
                  <path d="M6 66h12m84 0h12M60 6v12" className="tdv-resource-arc__ticks" />
                </svg>
                <TdvResourceActions
                  name={key.toUpperCase()}
                  value={c.resources[key]}
                  maximum={stats.maximums[key]}
                  base={stats.baseMaximums[key]}
                  modifier={c.resourceModifiers?.[key] ?? 0}
                  onApply={(current, modifier) =>
                    run(() => setResourceModifier(c, key, modifier, current))
                  }
                  disabled={!canEdit}
                  onChange={(value) => run(() => setResource(c, key, value))}
                />
              </div>
            );
          })}
        </div>
        <div id="tdv-equilibrio" className="tdv-domain-instrument">
          <header>
            <h2>Equilíbrio</h2>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="tdv-domain-reading"
                  aria-label={`Consultar Equilíbrio ${c.equilibrium}`}
                >
                  {c.equilibrium > 0 ? "+" : ""}
                  {c.equilibrium}
                </button>
              </PopoverTrigger>
              <PopoverContent className="tdv-domain-popup" aria-label="Domínios do Equilíbrio">
                <header className="tdv-domain-popup-heading">
                  <small>Medo ↔ Conhecimento</small>
                  <h3>{equilibriumBand(c.equilibrium)}</h3>
                  <strong>
                    {c.equilibrium > 0 ? "+" : ""}
                    {c.equilibrium}
                  </strong>
                </header>
                <div className="tdv-domain-axis" aria-hidden="true">
                  <span style={{ left: `${5 + (c.equilibrium + 10) * 4.5}%` }} />
                </div>
                <p>
                  Medo −10 ↔ Conhecimento +10. A faixa contextualiza a personagem, sem bônus
                  universal.
                </p>
                <p>A Tensão em ±4 move o Equilíbrio em 1 e volta a zero, sem excedente.</p>
                <label htmlFor={id}>Ajustar Equilíbrio</label>
                <input
                  id={id}
                  className="tdv-range"
                  type="range"
                  aria-label="Equilíbrio TdV II"
                  min={-10}
                  max={10}
                  value={c.equilibrium}
                  disabled={!canEdit}
                  onChange={(e) => onChange({ ...c, equilibrium: Number(e.target.value) })}
                />
              </PopoverContent>
            </Popover>
          </header>
          <div
            className="tdv-domain-axis"
            role="img"
            aria-label={`${equilibriumBand(c.equilibrium)}: ${c.equilibrium}`}
          >
            <span style={{ left: `${5 + (c.equilibrium + 10) * 4.5}%` }} />
          </div>
          <div className="tdv-domain-poles">
            <span>Medo</span>
            <span>Conhecimento</span>
          </div>
          <div className="tdv-domain-tension">
            <Button
              variant="ghost"
              disabled={!canEdit}
              aria-label="Tensão −1"
              onClick={() => run(() => addTension(c, -1))}
            >
              −
            </Button>
            <div>
              <small>Tensão</small>
              <output aria-label="Tensão TdV II">
                {c.tension > 0 ? "+" : ""}
                {c.tension}
              </output>
              <span className="tdv-domain-marks" aria-hidden="true">
                {[-3, -2, -1, 0, 1, 2, 3].map((n) => (
                  <i
                    key={n}
                    data-lit={n === c.tension}
                    data-side={n < 0 ? "medo" : "conhecimento"}
                  />
                ))}
              </span>
            </div>
            <Button
              variant="ghost"
              disabled={!canEdit}
              aria-label="Tensão +1"
              onClick={() => run(() => addTension(c, 1))}
            >
              +
            </Button>
          </div>
        </div>
      </div>
      {(c.critical !== "Ativa" ||
        c.resources.pi === 0 ||
        c.resources.pe === 0 ||
        c.face.anchor.shaken) && (
        <div className="tdv-resource-alert" role="status">
          <span>
            {[
              c.critical !== "Ativa" ? c.critical : "",
              c.resources.pi === 0 ? "PI · Colapso" : "",
              c.resources.pe === 0 ? "PE · sem saldo para custos" : "",
              c.face.anchor.shaken ? "Âncora Abalada" : "",
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
          <Button variant="ghost" onClick={onInspectState}>
            Ver limites e continuidade
          </Button>
        </div>
      )}
      <TdvCrisisTrackers character={c} onChange={onChange} canEdit={canEdit} />
      <TdvConditions character={c} onChange={onChange} canEdit={canEdit} />
      {!c.ready && (
        <p className="tdv-note">
          Personagem em criação · distribua as capacidades e confira os oito passos.
        </p>
      )}
    </section>
  );
}
