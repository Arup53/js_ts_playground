export interface User {
  id?: number;
  email: string;
  name: string;
  age?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUser {
  email: string;
  name: string;
  age?: number;
}

export interface UpdateUser {
  email?: string;
  name?: string;
  age?: number;
}
