
export enum AppTab {
  SETUP = 'setup',
  SOURCES = 'sources',
  ACTIONS = 'actions',
  AI_ASSISTANT = 'ai',
  RESOURCES = 'resources'
}

export interface SetupStep {
  id: string;
  title: string;
  command: string;
  description: string;
}

export interface PackageSource {
  name: string;
  url: string;
  description: string;
  type: 'official' | 'community';
}

export interface ActionTemplate {
  name: string;
  description: string;
  content: string;
}
