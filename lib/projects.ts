import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { EditorProjects } from "@/types/project";

const projectSummarySelect = { id: true, name: true, roomId: true } satisfies Prisma.ProjectSelect;

export async function getEditorProjects(): Promise<EditorProjects> {
  const { userId } = await auth.protect();
  const user = await currentUser();
  const emailAddresses = user?.id === userId
    ? user.emailAddresses
        .filter(({ verification }) => verification?.status === "verified")
        .map(({ emailAddress }) => emailAddress)
    : [];

  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      select: projectSummarySelect,
    }),
    emailAddresses.length === 0
      ? Promise.resolve([])
      : prisma.project.findMany({
          where: {
            ownerId: { not: userId },
            collaborators: {
              some: {
                email: { in: emailAddresses, mode: "insensitive" },
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          select: projectSummarySelect,
        }),
  ]);

  return { ownedProjects, sharedProjects };
}
