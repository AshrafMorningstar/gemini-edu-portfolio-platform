
export enum UserRole {
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  profile?: TeacherProfile;
}

export interface TeacherProfile {
  contactInfo: string;
  qualifications: string;
  bio: string;
  specialization: string;
}

export interface Activity {
  id: string;
  teacherId: string;
  type: 'PRACTICE' | 'SEMINAR';
  title: string;
  description: string;
  fromDate: string;
  toDate: string;
  fileName?: string;
  fileData?: string; // base64
  extractedContent?: string;
  createdAt: number;
}

export interface DashboardStats {
  practicesCount: number;
  seminarsCount: number;
  totalUploads: number;
}
