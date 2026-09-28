import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface ProjectRouteContext {
  params: Promise<{ projectId: string }>;
}

interface RenameProjectBody {
  name?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function PATCH(
  request: Request,
  { params }: ProjectRouteContext,
): Promise<Response> {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!isRecord(body)) {
    return Response.json({ error: "Request body must be a JSON object." }, { status: 400 });
  }

  const { name } = body as RenameProjectBody;

  if (typeof name !== "string" || !name.trim()) {
    return Response.json({ error: "Project name must be a non-empty string." }, { status: 400 });
  }

  const { projectId } = await params;
  const existingProject = await prisma.project.findUnique({ where: { id: projectId } });

  if (!existingProject) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }

  if (existingProject.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { name: name.trim() },
  });

  return Response.json({ project });
}

export async function DELETE(
  _request: Request,
  { params }: ProjectRouteContext,
): Promise<Response> {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const existingProject = await prisma.project.findUnique({ where: { id: projectId } });

  if (!existingProject) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }

  if (existingProject.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.project.delete({ where: { id: projectId } });

  return new Response(null, { status: 204 });
}
