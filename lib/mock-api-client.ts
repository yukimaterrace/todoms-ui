import {
  ApiResponse,
  CreateTodoRequest,
  LoginRequest,
  RefreshTokenRequest,
  SignupRequest,
  SignupResponse,
  Todo,
  TodosResponse,
  TokenResponse,
  UpdateTodoRequest,
  UserResponse
} from './model';

// モックデータ: TODOリスト
const MOCK_TODOS: Todo[] = [
  {
    id: '1',
    title: 'プロジェクト計画書の作成',
    description: '次の四半期のロードマップと主要マイルストーンを定義する',
    dueDate: '2025-05-01T15:00:00Z',
    isCompleted: false,
    createdAt: '2025-04-20T10:30:00Z',
    updatedAt: '2025-04-20T10:30:00Z'
  },
  {
    id: '2',
    title: 'MUIコンポーネントの調査',
    description: 'Material UIの主要コンポーネントの使い方を調査する',
    dueDate: '2025-04-25T12:00:00Z',
    isCompleted: true,
    createdAt: '2025-04-18T09:15:00Z',
    updatedAt: '2025-04-19T16:20:00Z'
  },
  {
    id: '3',
    title: '週次チームミーティング',
    description: '議題を準備して週次チームミーティングに参加する',
    dueDate: '2025-04-24T10:00:00Z',
    isCompleted: false,
    createdAt: '2025-04-19T11:45:00Z',
    updatedAt: '2025-04-19T11:45:00Z'
  }
];

// モックユーザーデータ
const MOCK_USER: UserResponse = {
  id: 'user-123',
  email: 'user@example.com'
};

// モックトークン
const MOCK_TOKENS: TokenResponse = {
  access_token: 'mock-access-token-xyz',
  refresh_token: 'mock-refresh-token-xyz'
};

/**
 * TodomsApiClientのモック実装
 * 実際のネットワークリクエストを行わずにAPIレスポンスをシミュレートします
 */
export class MockTodomsApiClient {
  // APIの遅延をシミュレートするヘルパーメソッド
  private async simulateDelay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 成功レスポンスを作成するヘルパーメソッド
  private createSuccessResponse<T>(data: T, statusCode: number = 200): ApiResponse<T> {
    return {
      data,
      statusCode
    };
  }

  // エラーレスポンスを作成するヘルパーメソッド
  private createErrorResponse<T>(
    code: string,
    message: string,
    statusCode: number = 400
  ): ApiResponse<T> {
    return {
      data: null,
      statusCode,
      error: {
        code,
        message
      }
    };
  }

  /**
   * ユーザー登録
   */
  async signup(data: SignupRequest): Promise<ApiResponse<SignupResponse>> {
    await this.simulateDelay();
    
    // 簡易バリデーション
    if (!data.email || !data.password) {
      return this.createErrorResponse(
        'validation_error',
        'メールアドレスとパスワードは必須です',
        400
      );
    }
    
    // モックユーザー作成
    const newUser: SignupResponse = {
      id: `user-${Date.now()}`,
      email: data.email
    };
    
    return this.createSuccessResponse(newUser);
  }

  /**
   * ログイン
   */
  async login(data: LoginRequest): Promise<ApiResponse<TokenResponse>> {
    await this.simulateDelay();
    
    // 簡易バリデーション
    if (!data.email || !data.password) {
      return this.createErrorResponse(
        'validation_error',
        'メールアドレスとパスワードは必須です',
        400
      );
    }
    
    // デモ認証チェック
    if (data.email === 'user@example.com' && data.password === 'password') {
      return this.createSuccessResponse(MOCK_TOKENS);
    }
    
    // 不正な認証情報
    return this.createErrorResponse(
      'invalid_credentials',
      'メールアドレスまたはパスワードが正しくありません',
      401
    );
  }

  /**
   * トークン更新
   */
  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<TokenResponse>> {
    await this.simulateDelay();
    
    // リフレッシュトークン検証
    if (data.refresh_token !== MOCK_TOKENS.refresh_token) {
      return this.createErrorResponse(
        'invalid_token',
        '無効なリフレッシュトークンです',
        401
      );
    }
    
    // 新しいトークンを返す
    return this.createSuccessResponse(MOCK_TOKENS);
  }

  /**
   * 現在のユーザー情報取得
   */
  async getCurrentUser(accessToken: string): Promise<ApiResponse<UserResponse>> {
    await this.simulateDelay();
    
    // アクセストークン検証
    if (accessToken !== MOCK_TOKENS.access_token) {
      return this.createErrorResponse(
        'invalid_token',
        '無効なアクセストークンです',
        401
      );
    }
    
    return this.createSuccessResponse(MOCK_USER);
  }

  /**
   * すべてのTODOアイテム取得
   */
  async getAllTodos(accessToken: string): Promise<ApiResponse<TodosResponse>> {
    await this.simulateDelay();
    
    // アクセストークン検証
    if (accessToken !== MOCK_TOKENS.access_token) {
      return this.createErrorResponse(
        'invalid_token',
        '無効なアクセストークンです',
        401
      );
    }
    
    return this.createSuccessResponse({ todos: [...MOCK_TODOS] });
  }

  /**
   * 特定のTODOアイテム取得
   */
  async getTodo(accessToken: string, todoId: string): Promise<ApiResponse<Todo>> {
    await this.simulateDelay();
    
    // アクセストークン検証
    if (accessToken !== MOCK_TOKENS.access_token) {
      return this.createErrorResponse(
        'invalid_token',
        '無効なアクセストークンです',
        401
      );
    }
    
    // IDでTODOを検索
    const todo = MOCK_TODOS.find(todo => todo.id === todoId);
    if (!todo) {
      return this.createErrorResponse(
        'not_found',
        'TODOが見つかりませんでした',
        404
      );
    }
    
    return this.createSuccessResponse(todo);
  }

  /**
   * 新規TODOアイテム作成
   */
  async createTodo(accessToken: string, data: CreateTodoRequest): Promise<ApiResponse<Todo>> {
    await this.simulateDelay();
    
    // アクセストークン検証
    if (accessToken !== MOCK_TOKENS.access_token) {
      return this.createErrorResponse(
        'invalid_token',
        '無効なアクセストークンです',
        401
      );
    }
    
    // 入力検証
    if (!data.title) {
      return this.createErrorResponse(
        'validation_error',
        'タイトルは必須です',
        400
      );
    }
    
    // 新規TODOを作成
    const now = new Date().toISOString();
    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate || null,
      isCompleted: false,
      createdAt: now,
      updatedAt: now
    };
    
    // 実際の実装では保存処理を行うが、モックでは不要
    
    return this.createSuccessResponse(newTodo, 201);
  }

  /**
   * TODOアイテム更新
   */
  async updateTodo(
    accessToken: string,
    todoId: string,
    data: UpdateTodoRequest
  ): Promise<ApiResponse<Todo>> {
    await this.simulateDelay();
    
    // アクセストークン検証
    if (accessToken !== MOCK_TOKENS.access_token) {
      return this.createErrorResponse(
        'invalid_token',
        '無効なアクセストークンです',
        401
      );
    }
    
    // TODOを検索
    const todoIndex = MOCK_TODOS.findIndex(todo => todo.id === todoId);
    if (todoIndex === -1) {
      return this.createErrorResponse(
        'not_found',
        'TODOが見つかりませんでした',
        404
      );
    }
    
    // 更新されたTODOを作成
    const updatedTodo: Todo = {
      ...MOCK_TODOS[todoIndex],
      title: data.title,
      description: data.description !== undefined ? data.description : MOCK_TODOS[todoIndex].description,
      dueDate: data.dueDate !== undefined ? data.dueDate : MOCK_TODOS[todoIndex].dueDate,
      isCompleted: data.isCompleted,
      updatedAt: new Date().toISOString()
    };
    
    // 実際の実装では保存処理を行うが、モックでは不要
    
    return this.createSuccessResponse(updatedTodo);
  }

  /**
   * TODOアイテム削除
   */
  async deleteTodo(accessToken: string, todoId: string): Promise<ApiResponse<null>> {
    await this.simulateDelay();
    
    // アクセストークン検証
    if (accessToken !== MOCK_TOKENS.access_token) {
      return this.createErrorResponse(
        'invalid_token',
        '無効なアクセストークンです',
        401
      );
    }
    
    // TODOが存在するか確認
    const todoIndex = MOCK_TODOS.findIndex(todo => todo.id === todoId);
    if (todoIndex === -1) {
      return this.createErrorResponse(
        'not_found',
        'TODOが見つかりませんでした',
        404
      );
    }
    
    // 実際の実装では削除処理を行うが、モックでは不要
    
    return {
      data: null,
      statusCode: 204
    };
  }
}
