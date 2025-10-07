export function normalizeUnidade(raw: string): string {
    return raw.replace(/\s*-\s*/g, "-");
}