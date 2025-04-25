/**
 * アプリケーション全体で使用するラベル文言を集約
 */
export const AppLabels = {
  app: {
    title: 'TodoMS - タスク管理アプリ',
    description: '効率的なタスク管理のためのシンプルなアプリケーション',
    name: 'TodoMS'
  },
  header: {
    accountSettings: 'アカウント設定',
    menuItems: {
      profile: 'プロフィール',
      logout: 'ログアウト'
    }
  },
  todos: {
    title: 'TODOリスト',
    loading: '読み込み中...',
    incompleteTasks: '{count} 件の未完了タスク',
    createButton: '新規作成',
    searchPlaceholder: 'タスクを検索...',
    sortLabel: '並び替え',
    sortOptions: {
      updatedAtDesc: '更新日 (新しい順)',
      updatedAtAsc: '更新日 (古い順)',
      dueDateAsc: '期限日 (近い順)',
      titleAsc: 'タイトル (A-Z)',
      isCompletedAsc: '未完了を先に',
      isCompletedDesc: '完了済みを先に'
    },
    empty: {
      title: 'TODOはありません',
      noMatchFilter: 'フィルター条件に一致するTODOはありません',
      createFirst: '「新規作成」ボタンをクリックして最初のTODOを作成しましょう'
    }
  },
  todoItem: {
    dueDate: '期限: {date}',
    status: {
      completed: '完了',
      overdue: '期限切れ',
      dueToday: '今日まで',
      inProgress: '進行中'
    }
  },
  auth: {
    appName: 'TodoMS',
    appDescription: 'タスク管理アプリケーション',
    login: {
      title: 'ログイン',
      email: 'メールアドレス',
      password: 'パスワード',
      button: 'ログイン',
      buttonLoading: 'ログイン中...',
      demoButton: 'デモアカウントを使用',
      noAccount: 'アカウントをお持ちでないですか？',
      signupLink: '新規登録',
      error: {
        failed: 'ログインに失敗しました。メールアドレスとパスワードを確認してください。',
        general: 'ログイン中にエラーが発生しました。しばらくしてから再度お試しください。'
      }
    },
    signup: {
      title: 'アカウント作成',
      email: 'メールアドレス',
      password: 'パスワード',
      passwordConfirm: 'パスワード（確認）',
      passwordHint: '6文字以上で入力してください',
      button: 'アカウント作成',
      buttonLoading: '作成中...',
      haveAccount: '既にアカウントをお持ちですか？',
      loginLink: 'ログイン',
      error: {
        passwordMismatch: 'パスワードが一致しません',
        passwordLength: 'パスワードは6文字以上で入力してください',
        failed: 'アカウント作成に失敗しました。別のメールアドレスを試すか、しばらくしてから再度お試しください。',
        general: 'アカウント作成中にエラーが発生しました。しばらくしてから再度お試しください。'
      }
    }
  },
  dialogs: {
    todo: {
      createTitle: '新規TODO作成',
      editTitle: 'TODO編集',
      viewTitle: 'TODO詳細',
      titleLabel: 'タイトル',
      titleRequired: 'タイトルは必須です',
      descriptionLabel: '説明',
      dueDateLabel: '期限日時',
      completedLabel: '完了済み',
      saveButton: '保存',
      closeButton: '閉じる',
      editButton: '編集'
    }
  },
  notifications: {
    createSuccess: 'TODOを作成しました',
    createError: 'TODOの作成に失敗しました',
    updateSuccess: 'TODOを更新しました',
    updateError: 'TODOの更新に失敗しました',
    markCompleted: 'TODOを完了としてマークしました',
    markIncomplete: 'TODOを未完了に戻しました',
    deleteSuccess: 'TODOを削除しました',
    deleteError: 'TODOの削除に失敗しました',
    operationError: '操作中にエラーが発生しました',
    fetchError: 'TODOの取得に失敗しました',
    fetchErrorGeneral: 'TODOの取得中にエラーが発生しました'
  }
};

export default AppLabels;
