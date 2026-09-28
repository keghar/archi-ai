import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { createProjectRoomId, isProjectRoomId } from "@/lib/project-utils";

interface CreateProjectBody {
  name?: unknown;
  roomId?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET(): Promise<Response> {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ projects });
}

export async function POST(request: Request): Promise<Response> {
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

  const { name } = body as CreateProjectBody;
  let projectName = "Untitled Project";

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return Response.json({ error: "Project name must be a non-empty string." }, { status: 400 });
    }

    projectName = name.trim();
  }

  const roomId = body.roomId === undefined
    ? createProjectRoomId(projectName, randomUUID().slice(0, 8))
    : body.roomId;
  if (!isProjectRoomId(roomId)) {
    return Response.json({ error: "Room ID must be a lowercase slug." }, { status: 400 });
  }

  let project;
  try {
    project = await prisma.project.create({
      data: {
        name: projectName,
        roomId,
        ownerId: userId,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return Response.json({ error: "That room ID is already in use. Generate another one." }, { status: 409 });
    }
    throw error;
  }

  return Response.json({ project }, { status: 201 });
}

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}
