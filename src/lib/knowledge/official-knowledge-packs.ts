export type OfficialKnowledgePack = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  assetPath: string;
  fileName: string;
  pages: number;
  relations: number;
  expectedBytes: number;
  sha256: string;
  recommended?: boolean;
};

export const TADEON_NEXUS_CANONICO_ATUAL: OfficialKnowledgePack = {
  id: "tadeon-nexus-canonico-atual",
  title: "Nexus canônico atual",
  eyebrow: "Biblioteca unificada",
  description:
    "Fundação Mecânica VIII integrada ao acervo: nova criação, desenvolvimento e Malha; texto anterior preservado e parâmetros em calibração identificados.",
  assetPath: "/nexus-packs/tadeon-nexus-canonico-atual.zip",
  fileName: "tadeon-nexus-canonico-atual.zip",
  pages: 204,
  relations: 315,
  expectedBytes: 534812,
  sha256: "17e7798cbf540162c10b11be46f84c1a2d07debd68dbe80c36178ad2aaca2b70",
  recommended: true,
};

/** Compatibility name for imports created before the canonical consolidation. */
export const TADEON_NEXUS_LOTE_01 = TADEON_NEXUS_CANONICO_ATUAL;

export const TADEON_NEXUS_OFFICIAL_PACKS: readonly OfficialKnowledgePack[] = [
  TADEON_NEXUS_CANONICO_ATUAL,
] as const;

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function loadOfficialKnowledgePack(
  pack: OfficialKnowledgePack = TADEON_NEXUS_CANONICO_ATUAL,
  fetcher: typeof fetch = fetch,
) {
  const response = await fetcher(pack.assetPath, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("KNOWLEDGE_OFFICIAL_PACK_LOAD_FAILED");
  }

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength !== pack.expectedBytes) {
    throw new Error("KNOWLEDGE_OFFICIAL_PACK_INTEGRITY_FAILED");
  }

  const digest = await crypto.subtle.digest("SHA-256", bytes);
  if (toHex(new Uint8Array(digest)) !== pack.sha256) {
    throw new Error("KNOWLEDGE_OFFICIAL_PACK_INTEGRITY_FAILED");
  }

  return new File([bytes], pack.fileName, {
    type: "application/zip",
    lastModified: 0,
  });
}
