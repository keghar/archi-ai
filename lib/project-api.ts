import { isProjectRoomId } from "@/lib/project-utils";
import type { ProjectSummary } from "@/types/project";

export class ProjectApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ProjectApiError";
  }
}

interface ProjectResponse {
  project: ProjectSummary;
}

function isProjectResponse(value: unknown): value is ProjectResponse {
  if (typeof value !== "object" || value === null || !("project" in value)) return false;
  const project = value.project;
  return typeof project === "object" && project !== null
    && "id" in project && typeof project.id === "string" && project.id.length > 0
    && "name" in project && typeof project.name === "string"
    && "roomId" in project && isProjectRoomId(project.roomId);
}

async function requestProject(url: string, options: RequestInit, fallback: string): Promise<unknown> {
  const response = await fetch(url, options);
  const result: unknown = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const message = typeof result === "object" && result !== null
      && "error" in result && typeof result.error === "string" ? result.error : fallback;
    throw new ProjectApiError(message, response.status);
  }

  return result;
}

export async function createProject(name: string, roomId: string): Promise<ProjectSummary> {
  const result = await requestProject("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, roomId }),
  }, "Could not create the project.");

  if (!isProjectResponse(result)) throw new Error("The server returned an invalid project.");
  return result.project;
}

export async function renameProject(id: string, name: string): Promise<void> {
  await requestProject(`/api/projects/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  }, "Could not rename the project.");
}

export async function deleteProject(id: string): Promise<void> {
  await requestProject(`/api/projects/${encodeURIComponent(id)}`, {
    method: "DELETE",
  }, "Could not delete the project.");
}
