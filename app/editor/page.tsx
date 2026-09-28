import EditorShell from "@/components/editor/editor-shell";
import { getEditorProjects } from "@/lib/projects";

export default async function EditorPage() {
  const projects = await getEditorProjects();
  return <EditorShell {...projects} />;
}
