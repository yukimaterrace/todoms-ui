// 認証関連モデル
export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface UserResponse {
  id: string;
  email: string;
}

// TODO関連モデル
export interface Todo {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodosResponse {
  todos: Todo[];
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTodoRequest {
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
}

// エラーレスポンスモデル
export interface ErrorResponse {
  code: string;
  message: string;
}

// APIレスポンスラッパー
export interface ApiResponse<T> {
  data: T | null;
  statusCode: number;
  error?: ErrorResponse;
}
