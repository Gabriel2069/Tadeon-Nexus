import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FabricFilaments } from "@/components/fabric-filaments";
import type { MaterialFamily } from "@/components/material-surface";

const FAMILIES: Array<{ id: MaterialFamily; name: string; role: string; rgb: string }> = [
  { id: "folio", name: "Fólio", role: "Texto, memória e identidade", rgb: "217 215 164" },
  {
    id: "instrument",
    name: "Instrumento",
    role: "Valores, limites e operação",
    rgb: "163 151 191",
  },
  { id: "weave", name: "Trama", role: "Relações e continuidade", rgb: "144 185 157" },
  { id: "glass", name: "Lâmina", role: "Comandos e decisões transitórias", rgb: "146 181 202" },
  { id: "stage", name: "Palco", role: "Cena e representação espacial", rgb: "204 153 160" },
  { id: "archive", name: "Acervo", role: "Coleções, autoria e procedência", rgb: "214 177 140" },
];

/** Synthetic, local-only interaction lab. It never calls an application service. */
export function MaterialGallery() {
  const [family, setFamily] = useState<MaterialFamily>("folio");
  const [draft, setDraft] = useState("O fio que permanece");
  const [readonly, setReadonly] = useState(false);
  const [fail, setFail] = useState(false);
  const [state, setState] = useState<"idle" | "pending" | "error" | "confirmed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );
  const simulate = () => {
    if (readonly || state === "pending") return;
    const rejected = fail || !draft.trim();
    setState("pending");
    timer.current = setTimeout(() => {
      timer.current = null;
      setState(rejected ? "error" : "confirmed");
    }, 600);
  };
  const selected = FAMILIES.find((item) => item.id === family)!;
  return (
    <section className="tadeon-material-library" aria-labelledby={`${id}-title`}>
      <div className="tadeon-material-library__heading">
        <div>
          <p>V4 · biblioteca material</p>
          <h2 id={`${id}-title`}>Uma matéria para cada gesto</h2>
        </div>
        <span>Dados fictícios · nenhuma gravação real</span>
      </div>
      <div className="tadeon-material-library__catalog">
        {FAMILIES.map((item) => (
          <Card
            key={item.id}
            family={item.id}
            className="tadeon-material-specimen"
            style={{ "--material-rgb": item.rgb } as CSSProperties}
          >
            <FabricFilaments className="tadeon-material-specimen__threads" />
            <h3>{item.name}</h3>
            <p>{item.role}</p>
            <div className="tadeon-material-specimen__notation" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </Card>
        ))}
      </div>
      <Tabs value={family} onValueChange={(v) => setFamily(v as MaterialFamily)}>
        <TabsList className="tadeon-material-library__tabs" aria-label="Material do ensaio">
          {FAMILIES.map((item) => (
            <TabsTrigger key={item.id} value={item.id}>
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Card
        family={family}
        data-manifestation={state === "idle" ? undefined : state}
        className="tadeon-material-lab"
        style={{ "--material-rgb": selected.rgb } as CSSProperties}
      >
        <div className="tadeon-material-lab__content">
          <p>
            {selected.name} · {selected.role}
          </p>
          <label htmlFor={`${id}-draft`}>Registro de ensaio</label>
          <Input
            id={`${id}-draft`}
            value={draft}
            readOnly={readonly}
            disabled={state === "pending"}
            onChange={(e) => {
              setDraft(e.target.value);
              if (state !== "pending") setState("idle");
            }}
          />
          <div className="tdv-actions">
            <Button
              disabled={readonly || state === "pending"}
              aria-busy={state === "pending"}
              onClick={simulate}
            >
              {state === "pending"
                ? "Enviando ensaio…"
                : state === "error"
                  ? "Tentar ensaio novamente"
                  : "Simular envio"}
            </Button>
            <Button
              variant="outline"
              disabled={state === "pending"}
              onClick={() => {
                setState("idle");
                setFail(false);
                setReadonly(false);
                setDraft("O fio que permanece");
              }}
            >
              Restaurar ensaio
            </Button>
          </div>
        </div>
        <div className="tadeon-material-lab__states">
          <label>
            <input
              type="checkbox"
              checked={readonly}
              onChange={(e) => setReadonly(e.target.checked)}
            />{" "}
            Somente leitura
          </label>
          <label>
            <input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} />{" "}
            Simular erro no envio
          </label>
          <p role={state === "error" ? "alert" : "status"} aria-live="polite">
            {
              {
                idle: "Pronto para testar foco, toque e pressão.",
                pending: "Pedido em andamento. Nenhuma confirmação antecipada.",
                error: "O ensaio falhou. O texto foi preservado para tentar novamente.",
                confirmed: "Ensaio confirmado. Nenhum serviço externo foi chamado.",
              }[state]
            }
          </p>
        </div>
      </Card>
    </section>
  );
}
