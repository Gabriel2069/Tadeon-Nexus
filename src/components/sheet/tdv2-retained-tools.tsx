import { SelectionPlate } from "@/components/selection-plate";
import { useState, useRef } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TdvRecordActions } from "./tdv2-procedures";
import { TdvAction } from "./tdv2-fields";
import { Section } from "./sheet-ui";
import { AddItemDialog } from "./add-item-dialog";
import { SheetInventoryOrganizer } from "./sheet-inventory-organizer";
import { TdvInscription } from "./tdv2-fields";
import { uid, RECORD_FIELDS, type TdvCharacter, type TdvRecord } from "@/lib/tdv2";
import type { SheetData, SheetUpdate } from "./sheet-model";
export function Tdv2DossierDetails({
  sheet,
  canEdit,
  onUpdate,
}: {
  sheet: SheetData;
  canEdit: boolean;
  onUpdate: SheetUpdate;
}) {
  return (
    <Section variant="folio" id="tdv-pessoal" title="Particularidades">
      <div className="tdv-grid tdv-grid--identity">
        <TdvInscription
          label="Idade"
          value={sheet.age ?? ""}
          short
          disabled={!canEdit}
          onChange={(v) => onUpdate("age", v)}
        />
        {(
          [
            ["wound", "Ferida"],
            ["question", "Pergunta da personagem"],
            ["lifeCycleTrait", "Traço do ciclo de vida"],
          ] as const
        ).map(([key, label]) => (
          <TdvInscription
            key={key}
            label={label}
            value={sheet.identity_data[key] ?? ""}
            disabled={!canEdit}
            onChange={(v) => onUpdate("identity_data", { ...sheet.identity_data, [key]: v })}
          />
        ))}
      </div>
    </Section>
  );
}
export function Tdv2Belongings({
  character: c,
  onChange,
  canEdit,
  sheetId,
  beforeOrganize,
}: {
  character: TdvCharacter;
  onChange: (v: TdvCharacter) => void;
  canEdit: boolean;
  sheetId: string;
  beforeOrganize: () => Promise<boolean>;
}) {
  return (
    <div className="tdv-belongings-grid">
      {(
        [
          [
            "Arma",
            "Armas",
            "Família",
            "Alcance",
            "Manejo",
            "Impacto",
            "Propriedades",
            "Porte e acesso",
          ],
          [
            "Equipamento",
            "Inventário",
            "Descrição",
            "Volume",
            "Mãos ocupadas",
            "Suporte",
            "Porte e acesso",
            "Integridade",
          ],
        ] as const
      ).map(([kind, title, ...fields]) => {
        const records = c.records.filter((r) => r.kind === kind);
        return (
          <Section
            variant="folio"
            key={kind}
            emblem={kind === "Arma" ? "armas" : "inventario"}
            id={kind === "Arma" ? "sec-armas" : "sec-inv"}
            title={title}
            extra={
              <div className="tdv-actions">
                {kind === "Equipamento" && (
                  <SheetInventoryOrganizer
                    sheetId={sheetId}
                    canEdit={canEdit}
                    beforeOpen={beforeOrganize}
                  />
                )}{" "}
                {canEdit && (
                  <AddItemDialog<Record<string, string>>
                    title={kind === "Arma" ? "Nova arma" : "Novo item"}
                    composition={kind === "Arma" ? "weapon" : "inventory"}
                    triggerLabel={`Adicionar ${kind === "Arma" ? "arma" : "item"}`}
                    initial={{ nome: "", ...Object.fromEntries(fields.map((key) => [key, ""])) }}
                    fields={[
                      { key: "nome", label: "Nome" },
                      ...fields.map((key) => ({
                        key,
                        label: key,
                        type: (["Descrição", "Propriedades", "Porte e acesso"].includes(key)
                          ? "textarea"
                          : "text") as "textarea" | "text",
                      })),
                    ]}
                    onAdd={(row) =>
                      onChange({
                        ...c,
                        records: [
                          ...c.records,
                          {
                            id: uid(),
                            kind: kind as TdvRecord["kind"],
                            name: row.nome,
                            fields: Object.fromEntries(
                              Object.entries(row).filter(([key]) => key !== "nome"),
                            ),
                          },
                        ],
                      })
                    }
                  />
                )}
              </div>
            }
          >
            {kind === "Equipamento" && (
              <p className="tdv-cargo-reading">
                <strong>Carga</strong> Volume, mãos ocupadas, suportes e acesso. O que dificulta uma
                abordagem deve ser reorganizado, dividido ou deixado para trás.
              </p>
            )}
            <div className="tdv-equipment-list">
              {records.map((record) => (
                <TdvEquipmentEntry
                  key={record.id}
                  record={record}
                  fields={fields}
                  character={c}
                  canEdit={canEdit}
                  onChange={onChange}
                />
              ))}
            </div>
            {!records.length && (
              <p className="tdv-empty-reading">
                {kind === "Arma" ? "Nenhuma arma registrada." : "Nenhum item registrado."}
              </p>
            )}
            {kind === "Arma" && (
              <p className="tdv-note">
                Impacto e propriedades seguem o texto da arma. O valor de dano anterior permanece no
                registro para revisão; a nova edição usa a consequência e o dano anunciados na ação.
              </p>
            )}
          </Section>
        );
      })}
    </div>
  );
}

/** Separate, always visible homes for the player's acquired works and phenomena. */
export function TdvRecordCollection({
  character: c,
  onChange,
  canEdit,
  onUse,
}: {
  character: TdvCharacter;
  onChange: (c: TdvCharacter) => void;
  canEdit: boolean;
  onUse: (id: string) => void;
}) {
  const phenomenonRail = useRef<HTMLDivElement>(null);
  const [phenomenon, setPhenomenon] = useState<"Trama" | "Fragmento" | "Selo">("Trama");
  const [editingRecords, setEditingRecords] = useState<Record<string, boolean>>({});
  const groups = [
    { id: "tdv-lavores", title: "Lavores", kinds: ["Lavor"] },
    {
      id: "tramas-fragmentos",
      title: "Tramas e Fragmentos",
      kinds: [phenomenon],
    },
    {
      id: "tdv-permanencias",
      title: "Continuidade",
      kinds: ["Reputação", "Preparo", "Costura", "Resto"],
    },
  ];
  const patch = (record: TdvRecord) =>
    onChange({ ...c, records: c.records.map((item) => (item.id === record.id ? record : item)) });
  return (
    <div className="tdv-record-collections">
      {groups.map((group) => (
        <Section
          key={group.id}
          variant="folio"
          id={group.id}
          title={group.title}
          extra={
            canEdit && (
              <div className="tdv-actions">
                {group.kinds.map((kind) => (
                  <AddItemDialog<Record<string, string>>
                    key={kind}
                    title={`Adicionar ${kind}`}
                    triggerLabel={`Adicionar ${kind}`}
                    composition={
                      kind === "Trama"
                        ? "trama"
                        : kind === "Fragmento"
                          ? "fragmento"
                          : kind === "Selo"
                            ? "selo"
                            : "lavor"
                    }
                    initial={{
                      nome: "",
                      ...Object.fromEntries(
                        RECORD_FIELDS[kind as TdvRecord["kind"]].map((field) => [field, ""]),
                      ),
                    }}
                    fields={[
                      { key: "nome", label: "Nome" },
                      ...RECORD_FIELDS[kind as TdvRecord["kind"]].map((key) => ({
                        key,
                        label: key,
                        type: ([
                          "Expressão",
                          "Efeito",
                          "Descrição",
                          "Resíduo",
                          "Preço/limite",
                          "Gesto",
                        ].includes(key)
                          ? "textarea"
                          : "text") as "textarea" | "text",
                      })),
                    ]}
                    onAdd={(row) => {
                      if (c.records.length >= 200) return;
                      onChange({
                        ...c,
                        records: [
                          ...c.records,
                          {
                            id: uid(),
                            kind: kind as TdvRecord["kind"],
                            name: row.nome,
                            fields: Object.fromEntries(
                              Object.entries(row).filter(([key]) => key !== "nome"),
                            ),
                          },
                        ],
                      });
                    }}
                  />
                ))}
              </div>
            )
          }
        >
          {group.id === "tramas-fragmentos" && (
            <div
              ref={phenomenonRail}
              data-selection-rail=""
              className="tdv-phenomenon-switch"
              aria-label="Tipo de expressão"
            >
              <SelectionPlate
                host={phenomenonRail}
                activeKey={phenomenon}
                selector='button[aria-pressed="true"]'
              />
              {(["Trama", "Fragmento", "Selo"] as const).map((kind) => (
                <Button
                  key={kind}
                  variant="ghost"
                  aria-pressed={phenomenon === kind}
                  onClick={() => setPhenomenon(kind)}
                >
                  {kind === "Trama" ? "Tramas" : kind === "Fragmento" ? "Fragmentos" : "Selos"}
                  <small>{c.records.filter((r) => r.kind === kind).length}</small>
                </Button>
              ))}
            </div>
          )}
          <div className="tdv-repertoire-grid">
            {c.records
              .filter((record) => group.kinds.includes(record.kind))
              .map((record) => (
                <article
                  className={`tdv-repertoire-card tdv-repertoire-card--${record.kind.toLowerCase()}`}
                  key={record.id}
                >
                  <header className="tdv-record-heading">
                    <span>{record.kind}</span>
                    {["Lavor", "Trama", "Fragmento", "Selo"].includes(record.kind) && (
                      <Button
                        className="tdv-expression-quick"
                        variant="ghost"
                        disabled={!canEdit || !c.ready}
                        onClick={() => onUse(record.id)}
                      >
                        Usar {record.name || record.kind}
                      </Button>
                    )}
                  </header>
                  <TdvInscription
                    label="Nome"
                    short
                    value={record.name}
                    disabled={!canEdit}
                    onChange={(name) => patch({ ...record, name })}
                  />
                  <div className="tdv-record-facts">
                    {[...new Set([...RECORD_FIELDS[record.kind], ...Object.keys(record.fields)])]
                      .filter((field) => editingRecords[record.id] || record.fields[field]?.trim())
                      .map((field) => (
                        <TdvInscription
                          key={field}
                          label={field}
                          value={record.fields[field] ?? ""}
                          disabled={!canEdit}
                          onChange={(value) =>
                            patch({ ...record, fields: { ...record.fields, [field]: value } })
                          }
                        />
                      ))}
                  </div>
                  <div className="tdv-record-actions">
                    {canEdit && (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setEditingRecords((state) => ({
                            ...state,
                            [record.id]: !state[record.id],
                          }))
                        }
                      >
                        {editingRecords[record.id] ? "Concluir edição" : "Editar estrutura"}
                      </Button>
                    )}
                    <TdvRecordActions
                      character={c}
                      record={record}
                      canEdit={canEdit}
                      onChange={onChange}
                    />
                    <TdvAction title="Gerenciar">
                      <p>Remover este registro não devolve PU nem remove aquisições do percurso.</p>
                      <Button
                        variant="destructive"
                        disabled={!canEdit}
                        onClick={() =>
                          onChange({
                            ...c,
                            records: c.records.filter((item) => item.id !== record.id),
                          })
                        }
                      >
                        Remover {record.name || record.kind}
                      </Button>
                    </TdvAction>
                  </div>
                </article>
              ))}
          </div>
          {!c.records.some((record) => group.kinds.includes(record.kind)) && (
            <p className="tdv-empty-reading">
              {group.id === "tdv-lavores"
                ? "Nenhum Lavor incorporado ou em aprendizado."
                : group.id === "tramas-fragmentos"
                  ? `Nenhum registro de ${phenomenon} vinculado.`
                  : "Sem registros nesta parte da trajetória."}
            </p>
          )}
        </Section>
      ))}
    </div>
  );
}

function TdvEquipmentEntry({
  record,
  fields,
  character: c,
  canEdit,
  onChange,
}: {
  record: TdvRecord;
  fields: readonly string[];
  character: TdvCharacter;
  canEdit: boolean;
  onChange: (c: TdvCharacter) => void;
}) {
  const [editing, setEditing] = useState(false);
  const patch = (next: TdvRecord) =>
    onChange({ ...c, records: c.records.map((item) => (item.id === record.id ? next : item)) });
  return (
    <article className="tdv-equipment-entry">
      <TdvInscription
        label="Nome"
        short
        value={record.name}
        disabled={!canEdit}
        onChange={(name) => patch({ ...record, name })}
      />
      <div className="tdv-record-facts">
        {[...new Set([...fields, ...Object.keys(record.fields)])]
          .filter((field) => editing || record.fields[field]?.trim())
          .map((field) => (
            <TdvInscription
              key={field}
              label={field}
              value={record.fields[field] ?? ""}
              disabled={!canEdit}
              onChange={(value) =>
                patch({ ...record, fields: { ...record.fields, [field]: value } })
              }
            />
          ))}
      </div>
      <div className="tdv-record-actions">
        {canEdit && (
          <Button variant="ghost" onClick={() => setEditing((value) => !value)}>
            {editing ? "Concluir edição" : "Editar detalhes"}
          </Button>
        )}
        <TdvRecordActions character={c} record={record} canEdit={canEdit} onChange={onChange} />
        {canEdit && (
          <TdvAction title="Remover">
            <p>Retirar {record.name || record.kind} desta ficha?</p>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={() =>
                  onChange({ ...c, records: c.records.filter((item) => item.id !== record.id) })
                }
              >
                Remover item
              </Button>
            </DialogClose>
          </TdvAction>
        )}
      </div>
    </article>
  );
}
