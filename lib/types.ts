export type SourceKind = "note" | "pdf" | "assignment";

export interface SourceRecord {
  id: string;
  slug: string;
  title: string;
  fileName: string;
  mimeType: string;
  kind: SourceKind;
  text: string;
}

export interface WikiPage {
  slug: string;
  title: string;
  summary: string;
  body: string;
  keywords: string[];
  sourceIds: string[];
  links: string[];
}
