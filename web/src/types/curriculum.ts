export type LocalizedString = string | Record<string, string>;

export interface PedagogyBlock {
  type: 'tip' | 'trick' | 'mnemonic' | 'strategy' | 'pitfall' | 'why';
  title?: LocalizedString;
  content: LocalizedString;
}

export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'callout' | 'example' | 'math' | 'image' | 'drawing';
  content?: LocalizedString;
  items?: LocalizedString[];
  latex?: string;
  src?: string;
  alt?: LocalizedString;
  prompt?: LocalizedString;
  mode?: 'freehand' | 'graph' | 'geometry';
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'numeric' | 'free-response' | 'expression' | 'drawing';
  question: LocalizedString;
  hints?: LocalizedString[];
  options?: LocalizedString[];
  correctOptionIndex?: number;
  answer?: string | number | number[];
  tolerance?: number;
  validation?: 'exact' | 'numeric' | 'expression' | 'manual';
  maxAttempts?: number;
  solution?: LocalizedString;
  drawingMode?: 'freehand' | 'graph' | 'geometry';
}

export interface Lesson {
  id: string;
  title: LocalizedString;
  objectives?: LocalizedString[];
  pedagogy?: PedagogyBlock[];
  content: ContentBlock[];
  exercises: Exercise[];
}

export interface Chapter {
  id: string;
  title: LocalizedString;
  description?: LocalizedString;
  lessons: Lesson[];
}

export interface Subject {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  chapters: (Chapter | string)[];
}
