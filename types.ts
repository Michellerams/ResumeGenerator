export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  dates: string;
  description: string[];
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  dates: string;
}

export interface ResumeData {
  name: string;
  title: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  interests: string[];
  achievements: string[];
}

export interface ATSFeedback {
  score: number;
  matchRate: string;
  keywordAnalysis: {
    found: string[];
    missing: string[];
  };
  suggestions: string[];
}


export type TemplateName = 'modern' | 'professional' | 'creative';

export interface Template {
    id: TemplateName;
    name: string;
}

export interface ColorScheme {
    name: string;
    primary: string;
    secondary: string;
    background: string;
    text: string;
    heading: string;
}

export interface Font {
    id: string;
    name: string;
    cssClass: string;
}
