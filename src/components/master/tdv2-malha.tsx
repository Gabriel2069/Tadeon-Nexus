import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TdvAction, TdvInscription, TdvSelect, TdvNumber } from "@/components/sheet/tdv2-fields";
import { BRANCHES, BRANCH_FIELDS, searchShadow, type TdvOperation } from "@/lib/tdv2-operations";
import { uid } from "@/lib/tdv2";

export function TdvMalha({
  operation: o,
  onChange,
}: {
  operation: TdvOperation;
  onChange: (o: TdvOperation) => void;
}) {
  const [faces, setFaces] = useState<number[]>([]),
    [change, setChange] = useState("");
  const malha = o.malha;
  if (!malha)
    return (
      <Button
        variant="outline"
        onClick={() => onChange({ ...o, malha: { branch: "Confrontação", fields: {} } })}
      >
        Conectar Ramificação
      </Button>
    );
  const update = (patch: Partial<typeof malha>) =>
    onChange({ ...o, malha: { ...malha, ...patch } });
  const shadow = malha.shadow;
  return (
    <>
      <TdvSelect
        label="Ramificação em foco"
        value={malha.branch}
        options={BRANCHES}
        onChange={(branch) => update({ branch: branch as typeof malha.branch })}
      />
      <p className="tdv-note">
        Mudar de Ramificação conserva os estados e não repete rolagens. Use apenas os mecanismos
        pertinentes; estes dados de condução permanecem privados.
      </p>
      <div className="tdv-grid">
        {BRANCH_FIELDS[malha.branch].map((field) => (
          <TdvInscription
            key={field}
            label={field}
            value={malha.fields[field] ?? ""}
            onChange={(v) => update({ fields: { ...malha.fields, [field]: v } })}
          />
        ))}
      </div>
      {malha.branch === "Ocultação" && (
        <TdvAction title="Sombra e Esconderijos · privado">
          {!shadow ? (
            <Button
              onClick={() =>
                update({
                  shadow: { signal: Math.floor(Math.random() * 6) + 1, examined: [], hideouts: [] },
                })
              }
            >
              Estabelecer Sinal de Sombra · d6
            </Button>
          ) : (
            <>
              <p className="tdv-cargo-reading">
                <strong>Sinal secreto · {shadow.signal}</strong>{" "}
                {shadow.examined.includes(shadow.signal)
                  ? "Sinal encontrado: verificar descoberta e observadores pertinentes."
                  : "Sinal ainda não encontrado."}
              </p>
              <div className="tdv-actions">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <Button
                    key={n}
                    variant={faces.includes(n) ? "default" : "outline"}
                    disabled={shadow.examined.includes(n)}
                    aria-pressed={faces.includes(n)}
                    onClick={() =>
                      setFaces(
                        faces.includes(n)
                          ? faces.filter((f) => f !== n)
                          : faces.length < 2
                            ? [...faces, n]
                            : faces,
                      )
                    }
                  >
                    {n}
                    {shadow.examined.includes(n) ? " · examinada" : ""}
                  </Button>
                ))}
              </div>
              <Button
                disabled={faces.length !== 2}
                onClick={() => {
                  try {
                    onChange(searchShadow(o, faces));
                    setFaces([]);
                  } catch (e) {
                    toast.error((e as Error).message);
                  }
                }}
              >
                Busca bem-sucedida · examinar as duas faces
              </Button>
              <p className="tdv-note">
                Uma falha não examina faces. Revelação sensorial direta dispensa coincidência do
                dado.
              </p>
              {shadow.hideouts.map((h) => (
                <div className="tdv-actions" key={h.id}>
                  <TdvInscription
                    label="Esconderijo material"
                    value={h.name}
                    onChange={(name) =>
                      update({
                        shadow: {
                          ...shadow,
                          hideouts: shadow.hideouts.map((x) =>
                            x.id === h.id ? { ...x, name } : x,
                          ),
                        },
                      })
                    }
                  />
                  <Button
                    variant="outline"
                    disabled={!h.valid}
                    onClick={() =>
                      update({
                        shadow: {
                          ...shadow,
                          hideouts: shadow.hideouts.map((x) =>
                            x.id === h.id ? { ...x, valid: false } : x,
                          ),
                        },
                      })
                    }
                  >
                    {h.valid ? "Comprometer" : "Comprometido"}
                  </Button>
                </div>
              ))}
              <Button
                disabled={shadow.hideouts.length >= 3}
                onClick={() =>
                  update({
                    shadow: {
                      ...shadow,
                      hideouts: [...shadow.hideouts, { id: uid(), name: "", valid: true }],
                    },
                  })
                }
              >
                Adicionar cobertura ou rota real
              </Button>
              <TdvInscription
                label="Mudança material que estabelece outra Ocultação"
                value={change}
                onChange={setChange}
              />
              <Button
                disabled={!change.trim()}
                onClick={() => {
                  update({
                    shadow: { ...shadow, signal: Math.floor(Math.random() * 6) + 1, examined: [] },
                    fields: { ...malha.fields, "Mudança material": change },
                  });
                  setChange("");
                  setFaces([]);
                }}
              >
                Estabelecer novo Sinal após mudança real
              </Button>
            </>
          )}
        </TdvAction>
      )}
      {malha.branch === "Infiltração" && (
        <TdvAction title="Cadeia de Credenciais">
          {(
            [
              ["identity", "Identidade"],
              ["purpose", "Finalidade"],
              ["authorization", "Autorização"],
            ] as const
          ).map(([key, label]) => (
            <TdvSelect
              key={key}
              label={`Elo · ${label}`}
              value={malha.credentials?.[key] ?? "Íntegro"}
              options={["Íntegro", "Questionado", "Rompido"]}
              onChange={(v) =>
                update({
                  credentials: {
                    identity: "Íntegro",
                    purpose: "Íntegro",
                    authorization: "Íntegro",
                    ...malha.credentials,
                    [key]: v as "Íntegro" | "Questionado" | "Rompido",
                  },
                })
              }
            />
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const n = Math.floor(Math.random() * 6) + 1;
              update({
                fields: {
                  ...malha.fields,
                  "Inspeção atual": `Crivo ${n}: ${n <= 2 ? "Identidade" : n <= 4 ? "Finalidade" : "Autorização"}`,
                },
              });
            }}
          >
            Crivo · apenas inspeção genérica
          </Button>
          <p>{malha.fields["Inspeção atual"]}</p>
          <p className="tdv-note">
            Suspeita concreta dirige a inspeção ao Elo pertinente; informação suficiente pode
            dispensar teste.
          </p>
        </TdvAction>
      )}
      {malha.branch === "Perseguição" && (
        <TdvSelect
          label="Linha de Rota"
          value={malha.route ?? "Contato"}
          options={["Contato", "Próximo", "Afastado", "Fora de Vista", "Contato Perdido"]}
          onChange={(route) => update({ route: route as typeof malha.route })}
        />
      )}
      {malha.branch === "Construção" && (
        <p className="tdv-cargo-reading">
          Gabarito: mesma faixa é estável; adjacentes permitem Ajuste ou tolerância; extremos
          opostos exigem solução material. Compatibilidade não é uma segunda prova universal.
        </p>
      )}
      <TdvAction title="Compasso de Urgência · opcional">
        {!malha.urgency ? (
          <Button variant="outline" onClick={() => update({ urgency: { size: 3, used: 0 } })}>
            Representar oportunidades restantes
          </Button>
        ) : (
          <>
            <TdvNumber
              label="Espaços do Compasso"
              value={malha.urgency.size}
              min={3}
              max={8}
              onChange={(size) =>
                update({ urgency: { size, used: Math.min(size, malha.urgency!.used) } })
              }
            />
            <div className="tdv-actions">
              {Array.from({ length: malha.urgency.size }, (_, i) => (
                <Button
                  key={i}
                  variant={i < malha.urgency!.used ? "default" : "outline"}
                  aria-pressed={i < malha.urgency!.used}
                  onClick={() =>
                    update({
                      urgency: {
                        ...malha.urgency!,
                        used: i + 1 === malha.urgency!.used ? i : i + 1,
                      },
                    })
                  }
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <p className="tdv-note">
              Urgência acompanha oportunidades; Pressão acompanha deterioração. A mesma consequência
              não é cobrada duas vezes.
            </p>
          </>
        )}
      </TdvAction>
    </>
  );
}
