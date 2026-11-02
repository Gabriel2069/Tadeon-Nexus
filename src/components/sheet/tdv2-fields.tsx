import { useId, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

/** Text belongs to the character surface; blur commits, Escape cancels. */
export function TdvInscription({
  label,
  value,
  onChange,
  disabled = false,
  short = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  short?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const id = useId();
  return (
    <div className="tdv-inscription" data-empty={!value} data-writing={editing || undefined}>
      <label className="tdv-inscription__label" htmlFor={id}>
        {label}
      </label>
      {disabled ? (
        <strong>{value || "Por definir"}</strong>
      ) : editing ? (
        <Textarea
          id={id}
          autoFocus
          aria-label={label}
          value={draft}
          rows={short ? 1 : 3}
          className="tdv-inline-writing"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => {
            if (draft !== value) onChange(draft);
            setEditing(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setDraft(value);
              setEditing(false);
            }
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter")
              event.currentTarget.blur();
          }}
        />
      ) : (
        <button
          id={id}
          type="button"
          aria-label={`Editar ${label}`}
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
        >
          <strong>{value || "Por definir"}</strong>
        </button>
      )}
    </div>
  );
}

/** Occasional operations have their own temporary workspace, never a second card. */
export function TdvAction({
  title,
  children,
  disabled = false,
  className = "",
}: {
  title: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled} className="tdv-context-action">
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className={`tdv-operation-dialog ${className}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">{title} nesta personagem.</DialogDescription>
        </DialogHeader>
        <div className="tdv-operation-body">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

/** Native radio semantics keep keyboard choice and one selected value. */
export function TdvChoices({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const name = useId();
  return (
    <fieldset className="tdv-choices" disabled={disabled}>
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span>
              <i aria-hidden="true" />
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function TdvDisclosure({
  initiallyOpen,
  children,
  className = "",
  open: controlledOpen,
  onOpenChange,
  elementRef,
}: {
  elementRef?: (element: HTMLDetailsElement | null) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initiallyOpen: boolean;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <details
      ref={elementRef}
      className={`tdv-disclosure ${className}`}
      open={controlledOpen ?? open}
      onToggle={(e) => {
        setOpen(e.currentTarget.open);
        onOpenChange?.(e.currentTarget.open);
      }}
    >
      {children}
    </details>
  );
}

export function TdvField({
  label,
  value,
  onChange,
  disabled = false,
  short = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  short?: boolean;
}) {
  const id = useId();
  return (
    <div className="tdv-field">
      <label className="tadeon-dossier-label" htmlFor={id}>
        {label}
      </label>
      {short ? (
        <Input
          className="tadeon-dossier-field"
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Textarea
          className="tadeon-dossier-field"
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
export function TdvSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
  navigation = false,
  compactLabel = false,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  navigation?: boolean;
  compactLabel?: boolean;
}) {
  const id = useId();
  return (
    <div className="tdv-field">
      <label className={compactLabel ? "sr-only" : "tadeon-dossier-label"} htmlFor={id}>
        {label}
      </label>
      <select
        className="tadeon-dossier-field"
        data-view-control={navigation || undefined}
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
export function TdvNumber({
  label,
  value,
  onChange,
  disabled = false,
  min = 0,
  max = 100,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
}) {
  const id = useId();
  return (
    <div className="tdv-field">
      <label className="tadeon-dossier-label" htmlFor={id}>
        {label}
      </label>
      <Input
        className="tadeon-dossier-field"
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) =>
          onChange(Math.max(min, Math.min(max, Math.round(Number(e.target.value) || 0))))
        }
      />
    </div>
  );
}
export function TdvCheck({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="tdv-check tadeon-dossier-label">
      <input
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
