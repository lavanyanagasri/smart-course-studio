
export interface LessonInput {
  title: string;
  topic: string;
  description: string;
  targetAudience: string;
  difficultyLevel: string;
  additionalInstructions: string;
  moduleId?: string | null;
  timestamp?: string; // Add timestamp field to make each request unique
}

export interface LessonContent {
  title: string;
  description: string;
  learningOutcomes: string[];
  keyConcepts: {
    term: string;
    definition: string;
  }[];
  content: {
    introduction: string;
    sections: {
      title: string;
      content: string;
    }[];
    conclusion: string;
  };
  activities: {
    title: string;
    description: string;
    type: 'discussion' | 'exercise' | 'quiz' | 'project';
  }[];
  assessment: {
    questions: {
      question: string;
      options?: string[];
      answer?: string;
    }[];
  };
  resources: {
    title: string;
    url?: string;
    description: string;
  }[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: string[]; // IDs of lessons in this module
  order: number;
}
