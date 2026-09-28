import { notFound } from "next/navigation";
import EditorShell from "@/components/editor/editor-shell";
import { getEditorProjects } from "@/lib/projects";

interface ProjectWorkspacePageProps {
  params: Promise<{ roomId: string }>;
}

export default async function ProjectWorkspacePage({ params }: ProjectWorkspacePageProps) {
  const [projects, { roomId }] = await Promise.all([getEditorProjects(), params]);
  const activeProject = projects.ownedProjects.find((project) => project.roomId === roomId)
    ?? projects.sharedProjects.find((project) => project.roomId === roomId);

  if (!activeProject) notFound();

  return <EditorShell {...projects} activeProject={activeProject} />;
}
