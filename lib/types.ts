export interface User {
  id: number;
  email: string;
  name?: string;
  role: 'superadmin' | 'admin' | 'user';
  created_at: Date;
}

export interface UserSession {
  id: number;
  email: string;
  role: 'superadmin' | 'admin' | 'user';
  name?: string;
}

export interface ConfigParam {
  id: number;
  param_name: string;
  param_value: string;
  description?: string;
  created_by: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}