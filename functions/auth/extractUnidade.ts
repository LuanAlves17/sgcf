export function extractUnidadeFromDn(dn: string): string {
  return dn.split(",")[2]?.slice(3) ?? "";
}