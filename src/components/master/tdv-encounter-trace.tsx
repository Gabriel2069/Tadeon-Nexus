import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TdvSelect, TdvNumber, TdvCheck } from "@/components/sheet/tdv2-fields";
import { DICE } from "@/lib/tdv2";
import { threatFrame, traceDirectEncounter } from "@/lib/tdv-encounter-trace";

const fmt = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const dice = DICE.map((n) => `d${n}`);

export function TdvEncounterTrace({
  participants,
  notes,
  onChange,
}: {
  participants: string[];
  notes: string;
  onChange: (value: string) => void;
}) {
  const [magnitude, setMagnitude] = useState(20);
  const [prumo, setPrumo] = useState(12);
  const [tento, setTento] = useState(12);
  const [opportunities, setOpportunities] = useState(6);
  const [impact, setImpact] = useState(8);
  const [reduction, setReduction] = useState(0);
  const [accessible, setAccessible] = useState(true);
  const frame = threatFrame(magnitude);
  const [pp, setPp] = useState(frame.pp);
  const [guard, setGuard] = useState(frame.guard);
  const { chance, dpr, rounds } = traceDirectEncounter({
    prumo,
    tento,
    guard,
    opportunities,
    impact,
    reduction,
    accessible,
    pp,
  });
  const reading = rounds === null ? "Sem acesso por dano direto" : `${fmt.format(rounds)} rodadas`;
  const snapshot = [
    `Traçado · ${participants.length ? participants.join(", ") : "hipótese de preparação"}`,
    `Magnitude ${magnitude} · ${pp} PP · Guarda ${guard} · redução ${reduction} · ${accessible ? "alvo acessível" : "alvo inacessível"}`,
    `${opportunities} oportunidades por rodada · d${prumo} + d${tento} · Impacto 2d${impact} · ${fmt.format(chance * 100)}% de acerto · ${fmt.format(dpr)} PP/rodada · ${reading}.`,
  ].join("\n");
  return (
    <section className="tdv-encounter-trace" aria-label="Traçado dos Encontros">
      <header>
        <h3>Traçado dos Encontros</h3>
        <p>
          Explore o confronto direto. A referência do Caderno usa seis agressões de 2d8 contra uma
          Ameaça de Magnitude XX.
        </p>
      </header>
      <div className="tdv-trace-bench">
        <div className="tdv-grid">
          <TdvNumber
            label="Magnitude de referência"
            min={1}
            max={20}
            value={magnitude}
            onChange={(m) => {
              const next = threatFrame(m);
              setMagnitude(m);
              setPp(next.pp);
              setGuard(next.guard);
            }}
          />
          <TdvNumber label="PP a superar" max={10000} value={pp} onChange={setPp} />
          <TdvNumber label="Guarda do alvo" min={1} max={100} value={guard} onChange={setGuard} />
          <TdvNumber
            label="Oportunidades por rodada"
            max={100}
            value={opportunities}
            onChange={setOpportunities}
          />
          <TdvSelect
            label="Prumo"
            options={dice}
            value={`d${prumo}`}
            onChange={(v) => setPrumo(Number(v.slice(1)))}
          />
          <TdvSelect
            label="Tento"
            options={dice}
            value={`d${tento}`}
            onChange={(v) => setTento(Number(v.slice(1)))}
          />
          <TdvSelect
            label="Impacto por acerto"
            options={["2d4", "2d6", "2d8", "2d10"]}
            value={`2d${impact}`}
            onChange={(v) => setImpact(Number(v.slice(2)))}
          />
          <TdvNumber
            label="Redução por incidência"
            max={100}
            value={reduction}
            onChange={setReduction}
          />
        </div>
        <div className="tdv-trace-reading">
          <TdvCheck
            label="Alvo ao alcance das intervenções"
            value={accessible}
            onChange={setAccessible}
          />
          <output aria-live="polite">
            <strong>{reading}</strong>
            <span>
              {fmt.format(chance * 100)}% de acerto se houver acesso · {fmt.format(dpr)} PP por
              rodada
            </span>
          </output>
          <p>
            {rounds === null
              ? "Considere outro acesso, um Ponto Crítico, negociação ou retirada."
              : "Estimativa por dano concentrado, antes de Corte, Consonância, mudanças de fase ou Ruptura."}
          </p>
          <Button
            variant="outline"
            disabled={notes.split("\n\n").includes(snapshot)}
            onClick={() => onChange([notes.trimEnd(), snapshot].filter(Boolean).join("\n\n"))}
          >
            Anotar hipótese no plano
          </Button>
        </div>
      </div>
    </section>
  );
}
