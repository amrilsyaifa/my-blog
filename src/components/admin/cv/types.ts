export interface EducationItem {
  degree:      string;
  institution: string;
  year:        string;
  gpa?:        string;
}

export interface Achievement {
  year:         string;
  title:        string;
  description?: string;
}

export interface CareerCV {
  id:           string;
  job_title:    string;
  company:      string;
  job_location: string;
  job_tipe:     string;
  start_date:   string;
  end_date:     string;
  is_active:    boolean;
  work_details: string[];
  achievements: Achievement[];
  included:     boolean;
}

export interface SkillCV {
  id:       string;
  name:     string;
  data:     string[];
  included: boolean;
}

export interface CertCV {
  id:       string;
  title:    string;
  issuer:   string;
  year?:    string;
  included: boolean;
}

export interface ProjectCV {
  id:          string;
  title:       string;
  description: string;
  link:        string;
  project_by:  string;
  included:    boolean;
}

export interface Language {
  name:        string;
  proficiency: string;
}

export interface CVData {
  name:           string;
  role:           string;
  location:       string;
  email:          string;
  phone:          string;
  linkedin:       string;
  github:         string;
  portfolio_url:  string;
  target_job:     string;
  photo_url:      string;
  summary:        string;
  education:      EducationItem[];
  careers:        CareerCV[];
  skills:         SkillCV[];
  certifications: CertCV[];
  projects:       ProjectCV[];
  languages:      Language[];
}
