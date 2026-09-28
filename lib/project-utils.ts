const MAX_ROOM_ID_LENGTH = 120;

export function createProjectSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createProjectRoomId(name: string, suffix: string): string {
  const slug = (createProjectSlug(name) || "project")
    .slice(0, MAX_ROOM_ID_LENGTH - suffix.length - 1)
    .replace(/-+$/, "");
  return `${slug}-${suffix}`;
}

export function isProjectRoomId(value: unknown): value is string {
  return typeof value === "string" && value.length <= MAX_ROOM_ID_LENGTH
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
