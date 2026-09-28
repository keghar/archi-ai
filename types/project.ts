export interface ProjectSummary {
  id: string;
  name: string;
  roomId: string;
}

export interface EditorProjects {
  ownedProjects: ProjectSummary[];
  sharedProjects: ProjectSummary[];
}
