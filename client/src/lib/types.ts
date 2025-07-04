export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: number;
  userId: number;
  title: string;
  description?: string;
  category?: string;
  technologies?: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: number;
  userId: number;
  name: string;
  level: number;
  category?: string;
  createdAt: Date;
}

export interface Achievement {
  id: number;
  userId: number;
  title: string;
  description?: string;
  icon?: string;
  date: Date;
  createdAt: Date;
}

export interface DashboardStats {
  projects: number;
  skills: number;
  achievements: number;
  views: number;
  stars: number;
}
