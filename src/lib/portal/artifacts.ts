/** URLs de artefactos ops (Pinata / Basescan). */

export function ipfsGatewayUrl(cid: string | null | undefined): string | null {
  if (!cid) return null;
  const cleaned = cid.replace(/^ipfs:\/\//i, "").trim();
  if (!cleaned) return null;
  return `https://gateway.pinata.cloud/ipfs/${cleaned}`;
}

export function basescanTxUrl(hash: string | null | undefined): string | null {
  if (!hash) return null;
  const h = hash.trim();
  if (!/^0x[a-fA-F0-9]{64}$/.test(h)) return null;
  return `https://basescan.org/tx/${h}`;
}
