/** Collects only fixture UI structure. Never call this on a signed-in production account. */
import { writeFileSync } from "node:fs";

export async function captureSurfaceCensus(page, { path, state, screenshot = null }) {
  if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//.test(page.url()))
    throw Error("Surface census is restricted to local fixtures.");
  const controls = await page
    .locator(
      'button,a,input,textarea,select,[role="tab"],[role="menuitem"],[role="slider"],[role="checkbox"],[role="switch"],[role="combobox"],[contenteditable="true"]',
    )
    .evaluateAll((elements) =>
      elements.map((el) => {
        const rect = el.getBoundingClientRect(),
          style = getComputedStyle(el);
        const labelled = (el.getAttribute("aria-labelledby") ?? "")
          .split(/\s+/)
          .filter(Boolean)
          .map((id) => document.getElementById(id)?.textContent ?? "")
          .join(" ");
        const valueBearing = el.matches('input,textarea,select,[contenteditable="true"]');
        const label =
          el.getAttribute("aria-label") ||
          labelled ||
          [...(el.labels ?? [])].map((l) => l.textContent).join(" ") ||
          el.getAttribute("title") ||
          (!valueBearing ? el.textContent : "") ||
          "";
        return {
          tag: el.tagName.toLowerCase(),
          role: el.getAttribute("role"),
          id: el.id || null,
          label: label.replace(/\s+/g, " ").trim().slice(0, 300),
          name: el.getAttribute("name"),
          type: el.getAttribute("type"),
          href: el.getAttribute("href"),
          disabled: el.matches(':disabled,[aria-disabled="true"]'),
          readOnly: el.matches('[readonly],[aria-readonly="true"]'),
          state: el.getAttribute("data-state"),
          selected: el.getAttribute("aria-selected"),
          expanded: el.getAttribute("aria-expanded"),
          visible:
            rect.width > 0 &&
            rect.height > 0 &&
            style.visibility !== "hidden" &&
            style.display !== "none",
          rect: [rect.x, rect.y, rect.width, rect.height].map((n) => Math.round(n * 10) / 10),
        };
      }),
    );
  const result = {
    version: 1,
    route: new URL(page.url()).pathname,
    state,
    viewport: page.viewportSize(),
    screenshot,
    evidence:
      "mounted DOM in local fixture; action execution, server authorization and persistence require separate tests",
    controls,
  };
  writeFileSync(path, JSON.stringify(result, null, 2) + "\n");
  return result;
}
