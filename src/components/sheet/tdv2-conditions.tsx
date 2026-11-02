import { useRef, useState } from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TdvField, TdvChoices, TdvSelect } from "./tdv2-fields";
import {
  MATRICES,
  ALINHAVOS,
  conditionImpact,
  declareConditionImpact,
  uid,
  type TdvCharacter,
} from "@/lib/tdv2";
type Condition = TdvCharacter["conditions"][number];
export function TdvConditions({
  character: c,
  onChange,
  canEdit,
}: {
  character: TdvCharacter;
  onChange: (c: TdvCharacter) => void;
  canEdit: boolean;
}) {
  const [open, setOpen] = useState<string | null>(null),
    [editing, setEditing] = useState(false),
    [draft, setDraft] = useState<Condition | null>(null);
  const [pending, setPending] = useState<Partial<Record<string, "Desproveito" | "Impedimento">>>(
    {},
  );
  const addRef = useRef<HTMLButtonElement>(null);
  const update = (id: string, patch: Partial<Condition>) => {
    if (draft?.id === id) setDraft({ ...draft, ...patch });
    else
      onChange({
        ...c,
        conditions: c.conditions.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      });
  };
  return (
    <div id="tdv-condicoes" className="tdv-condition-ribbon" aria-label="Condições ativas">
      {!c.conditions.length && !draft && (
        <span className="tdv-condition-clear">
          <Check aria-hidden="true" />
          Sem condições ativas
        </span>
      )}
      {[...c.conditions, ...(draft ? [draft] : [])].map((item, index) => {
        const impact = conditionImpact(item.effect),
          application = pending[item.id] ?? impact?.kind ?? "Descrição apenas",
          isDraft = draft?.id === item.id;
        return (
          <Popover
            key={item.id}
            open={open === item.id}
            onOpenChange={(value) => {
              setOpen(value ? item.id : null);
              setEditing(!item.name);
              setPending((previous) => {
                const next = { ...previous };
                delete next[item.id];
                return next;
              });
              if (!value && isDraft) setDraft(null);
            }}
          >
            <PopoverTrigger asChild>
              <button type="button" className="tdv-condition-chip" data-intensity={item.intensity}>
                <i aria-hidden="true" />
                <strong>{item.name || "Nova condição"}</strong>
                <small>{impact ? `${impact.kind} · ${impact.target}` : item.intensity}</small>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="tdv-condition-popup"
              aria-label={`Condição ${item.name || index + 1}`}
              onCloseAutoFocus={(event) => {
                if (isDraft) {
                  event.preventDefault();
                  addRef.current?.focus();
                }
              }}
            >
              <header>
                <small>{item.intensity} · condição ativa</small>
                <h3>{item.name || "O que mudou?"}</h3>
              </header>
              {!editing ? (
                <>
                  {impact && (
                    <p className="tdv-condition-impact">
                      {impact.kind} em <strong>{impact.target}</strong>
                    </p>
                  )}
                  <p>
                    {impact?.description ||
                      item.effect ||
                      "Defina o efeito concreto desta condição."}
                  </p>
                  <dl>
                    <dt>Saída</dt>
                    <dd>{item.exit || "Ainda não estabelecida"}</dd>
                    {item.origin && (
                      <>
                        <dt>Origem</dt>
                        <dd>{item.origin}</dd>
                      </>
                    )}
                  </dl>
                  <div className="tdv-actions">
                    <Button variant="ghost" disabled={!canEdit} onClick={() => setEditing(true)}>
                      Ajustar condição
                    </Button>
                    <Button
                      disabled={
                        !canEdit ||
                        !item.exit.trim() ||
                        (item.id === "tdv-zero-pv" && c.resources.pv === 0) ||
                        (item.id === "tdv-zero-pi" && c.resources.pi === 0)
                      }
                      onClick={() => {
                        onChange({
                          ...c,
                          ...(item.id === "tdv-zero-pv" && c.resources.pv > 0
                            ? { critical: "Ativa" as const }
                            : {}),
                          conditions: c.conditions.filter((x) => x.id !== item.id),
                        });
                        setOpen(null);
                        addRef.current?.focus();
                      }}
                    >
                      Saída cumprida
                    </Button>
                  </div>
                </>
              ) : (
                <div className="tdv-condition-editor">
                  <TdvField
                    label={`Nome da condição ${index + 1}`}
                    value={item.name}
                    short
                    disabled={!canEdit}
                    onChange={(name) => update(item.id, { name })}
                  />
                  <TdvChoices
                    label={`Intensidade da condição ${index + 1}`}
                    value={item.intensity}
                    options={["Leve", "Grave", "Crítica"]}
                    disabled={!canEdit}
                    onChange={(value) =>
                      update(item.id, { intensity: value as Condition["intensity"] })
                    }
                  />
                  <TdvField
                    label={`Efeito da condição ${index + 1}`}
                    value={impact?.description ?? item.effect}
                    disabled={!canEdit}
                    onChange={(effect) =>
                      update(item.id, {
                        effect: impact
                          ? declareConditionImpact(effect, impact.kind, impact.target)
                          : effect,
                      })
                    }
                  />
                  <TdvSelect
                    label="Aplicação na ficha"
                    value={application}
                    options={["Descrição apenas", "Desproveito", "Impedimento"]}
                    disabled={!canEdit}
                    onChange={(kind) => {
                      if (kind === "Descrição apenas") {
                        setPending((previous) => {
                          const next = { ...previous };
                          delete next[item.id];
                          return next;
                        });
                        update(item.id, {
                          effect: declareConditionImpact(item.effect, "Descrição apenas", ""),
                        });
                      } else {
                        const next = kind as "Desproveito" | "Impedimento";
                        setPending((previous) => ({ ...previous, [item.id]: next }));
                        if (impact)
                          update(item.id, {
                            effect: declareConditionImpact(item.effect, next, impact.target),
                          });
                      }
                    }}
                  />
                  {application !== "Descrição apenas" && (
                    <TdvSelect
                      label="Capacidade afetada"
                      value={impact?.target ?? "Escolha a capacidade"}
                      options={["Escolha a capacidade", ...MATRICES, ...ALINHAVOS]}
                      disabled={!canEdit}
                      onChange={(target) => {
                        if (target !== "Escolha a capacidade")
                          update(item.id, {
                            effect: declareConditionImpact(
                              item.effect,
                              application as "Desproveito" | "Impedimento",
                              target,
                            ),
                          });
                      }}
                    />
                  )}
                  <small className="tdv-note">
                    Vincule apenas efeitos que valem para todo uso da capacidade. Efeitos
                    situacionais ficam na descrição; gravidade não cria penalidade.
                  </small>
                  <TdvField
                    label={`Saída da condição ${index + 1}`}
                    value={item.exit}
                    disabled={!canEdit}
                    onChange={(exit) => update(item.id, { exit })}
                  />
                  <details className="tdv-disclosure">
                    <summary>Origem</summary>
                    <TdvField
                      label={`Origem da condição ${index + 1}`}
                      value={item.origin}
                      disabled={!canEdit}
                      onChange={(origin) => update(item.id, { origin })}
                    />
                  </details>
                  {isDraft ? (
                    <div className="tdv-actions">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setDraft(null);
                          setOpen(null);
                          addRef.current?.focus();
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        disabled={!item.name.trim()}
                        onClick={() => {
                          onChange({ ...c, conditions: [...c.conditions, item] });
                          setDraft(null);
                          setEditing(false);
                          setOpen(null);
                        }}
                      >
                        Adicionar condição
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setEditing(false)}>Ver condição</Button>
                  )}
                </div>
              )}
            </PopoverContent>
          </Popover>
        );
      })}
      <Button
        ref={addRef}
        variant="ghost"
        className="tdv-condition-add"
        disabled={!canEdit || c.conditions.length >= 100}
        onClick={() => {
          const item: Condition = {
            id: uid(),
            name: "",
            origin: "",
            effect: "",
            exit: "",
            intensity: "Leve",
          };
          setDraft(item);
          setOpen(item.id);
          setEditing(true);
        }}
      >
        <Plus aria-hidden="true" />
        Condição
      </Button>
    </div>
  );
}
