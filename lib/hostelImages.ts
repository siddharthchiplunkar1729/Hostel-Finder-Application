export const DEFAULT_HOSTEL_IMAGE =
    '/hostel-placeholder.svg';

function parsePostgresArrayString(value: string): string[] {
    const trimmed = value.trim();
    if (!(trimmed.startsWith('{') && trimmed.endsWith('}'))) return [];

    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];

    return inner
        .split(',')
        .map((item) => item.trim().replace(/^"|"$/g, ''))
        .filter(Boolean);
}

export function normalizeHostelImages(images: unknown): string[] {
    if (Array.isArray(images)) {
        return images.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
    }

    if (typeof images === 'string') {
        const raw = images.trim();
        if (!raw) return [];

        if (raw.startsWith('[') && raw.endsWith(']')) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
                }
            } catch {
                // Fall through to additional parsing below.
            }
        }

        const postgresLike = parsePostgresArrayString(raw);
        if (postgresLike.length > 0) return postgresLike;

        return [raw];
    }

    return [];
}

export function getPrimaryHostelImage(images: unknown): string {
    const list = normalizeHostelImages(images);
    return list[0] || DEFAULT_HOSTEL_IMAGE;
}
