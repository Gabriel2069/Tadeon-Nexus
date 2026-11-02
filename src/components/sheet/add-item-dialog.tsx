import { useState, useId, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Sword, Backpack } from "lucide-react";

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
}

export function AddItemDialog<T>({
  triggerLabel = "Adicionar",
  title,
  fields,
  initial,
  onAdd,
  trigger,
  composition,
}: {
  triggerLabel?: string;
  title: string;
  fields: FieldDef[];
  initial: T;
  onAdd: (item: T) => void;
  trigger?: ReactNode;
  composition?: "weapon" | "inventory";
}) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T>(initial);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(data);
    setOpen(false);
    setData(initial);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) setData(initial);
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="outline" className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> {triggerLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={composition ? "tdv-item-dialog" : "max-w-lg"}
        data-item-kind={composition}
      >
        <DialogHeader>
          <DialogTitle className="font-cinzel">
            {composition &&
              (composition === "weapon" ? (
                <Sword aria-hidden="true" />
              ) : (
                <Backpack aria-hidden="true" />
              ))}
            {title}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className={composition ? "tdv-item-composition" : "space-y-3"}
        >
          {fields.map((f) => {
            const rec = data as unknown as Record<string, unknown>;
            const v = rec[f.key];
            const set = (val: unknown) => setData({ ...rec, [f.key]: val } as unknown as T);
            return (
              <div key={f.key} data-field={f.key} data-field-type={f.type}>
                <Label htmlFor={`${formId}-${f.key}`}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={`${formId}-${f.key}`}
                    value={String(v ?? "")}
                    placeholder={f.placeholder}
                    onChange={(e) => set(e.target.value)}
                    rows={3}
                  />
                ) : f.type === "select" ? (
                  <select
                    id={`${formId}-${f.key}`}
                    value={String(v ?? "")}
                    onChange={(e) => set(e.target.value)}
                    className="w-full bg-input border border-border rounded-md px-2 py-2 text-sm"
                  >
                    {f.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={`${formId}-${f.key}`}
                    type={f.type === "number" ? "number" : "text"}
                    value={f.type === "number" ? Number(v ?? 0) : String(v ?? "")}
                    placeholder={f.placeholder}
                    onChange={(e) =>
                      set(f.type === "number" ? Number(e.target.value) : e.target.value)
                    }
                  />
                )}
              </div>
            );
          })}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
