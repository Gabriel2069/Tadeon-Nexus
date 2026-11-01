import type { HTMLAttributes } from "react";
import { useMaterialLight } from "@/lib/use-material-light";
export type MaterialFamily =
  "ink" | "folio" | "instrument" | "glass" | "weave" | "stage" | "archive";

/** Semantic surface with an event-driven reflection; content stays in place. */
export function MaterialSurface({
  as: Element = "div",
  onPointerMove,
  onPointerLeave,
  family,
  ...props
}: HTMLAttributes<HTMLElement> & { as?: "div" | "article" | "section"; family?: MaterialFamily }) {
  const light = useMaterialLight<HTMLElement>();
  return (
    <Element
      {...props}
      data-material-surface="panel"
      data-material-family={family}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (!event.defaultPrevented) light.onPointerMove(event);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        light.onPointerLeave();
      }}
    />
  );
}
