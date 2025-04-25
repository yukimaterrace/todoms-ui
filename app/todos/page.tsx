'use client';

import TodoDialog from '@/components/TodoDialog';
import TodoItem from '@/components/TodoItem';
import { useAuth } from '@/components/AuthProvider';
import { TodomsApiClient } from '@/lib/api-client';
import { Todo, UpdateTodoRequest } from '@/lib/model';
import { 
  Alert, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  FormControl,
  Grid,
  InputAdornment, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  SelectChangeEvent, 
  Snackbar, 
  TextField, 
  Typography 
} from '@mui/material';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import { AppLabels } from '@/config/label';

// APIクライアント初期化
const apiClient = new TodomsApiClient();

export default function HomePage() {
  const { accessToken } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ダイアログ状態
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');
  
  // フィルタリング・ソート
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('updatedAt_desc');
  
  // スナックバー
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // TODOデータ取得
  const fetchTodos = async () => {
    if (!accessToken) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getAllTodos(accessToken);
      if (response.data) {
        setTodos(response.data.todos);
      } else {
        setError(AppLabels.notifications.fetchError);
      }
    } catch (err) {
      setError(AppLabels.notifications.fetchErrorGeneral);
    } finally {
      setLoading(false);
    }
  };

  // 初回マウント時にTODOを取得
  useEffect(() => {
    if (accessToken) {
      fetchTodos();
    }
  }, [accessToken]);

  // 検索条件やソート条件が変更されたときにTODOをフィルタリング
  useEffect(() => {
    let result = [...todos];
    
    // 検索フィルタリング
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(todo => 
        todo.title.toLowerCase().includes(term) || 
        (todo.description && todo.description.toLowerCase().includes(term))
      );
    }
    
    // ソート
    result.sort((a, b) => {
      const [field, order] = sortOption.split('_');
      
      let comparison = 0;
      if (field === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (field === 'dueDate') {
        // nullの扱い: null値は常に最後にソート
        if (a.dueDate === null && b.dueDate === null) comparison = 0;
        else if (a.dueDate === null) comparison = 1;
        else if (b.dueDate === null) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (field === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (field === 'isCompleted') {
        comparison = (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1;
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
    
    setFilteredTodos(result);
  }, [todos, searchTerm, sortOption]);

  // TODOをクリックして詳細表示
  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setDialogMode('view');
    setDialogOpen(true);
  };

  // 新規TODOの作成
  const handleCreateTodo = () => {
    setSelectedTodo(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  // ダイアログを閉じる
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // TODOの保存（作成/更新）
  const handleSaveTodo = async (data: UpdateTodoRequest | Todo, todoId?: string) => {
    if (!accessToken) return;
    
    try {
      if (dialogMode === 'view') {
        // 詳細モードから編集モードへ
        setDialogMode('edit');
        return;
      }
      
      if (dialogMode === 'create') {
        // 新規作成
        const createData = {
          title: data.title,
          description: data.description as string | undefined,
          dueDate: (data as UpdateTodoRequest).dueDate
        };
        
        const response = await apiClient.createTodo(accessToken, createData);
        if (response.data) {
          setTodos(prevTodos => [...prevTodos, response.data!]);
          setSnackbar({
            open: true,
            message: AppLabels.notifications.createSuccess,
            severity: 'success'
          });
          setDialogOpen(false);
        } else {
          setSnackbar({
            open: true,
            message: AppLabels.notifications.createError,
            severity: 'error'
          });
        }
      } else if (dialogMode === 'edit' && todoId) {
        // 更新
        const updateData = data as UpdateTodoRequest;
        const response = await apiClient.updateTodo(accessToken, todoId, updateData);
        
        if (response.data) {
          setTodos(prevTodos => 
            prevTodos.map(todo => todo.id === todoId ? response.data! : todo)
          );
          setSnackbar({
            open: true,
            message: AppLabels.notifications.updateSuccess,
            severity: 'success'
          });
          setDialogOpen(false);
        } else {
          setSnackbar({
            open: true,
            message: AppLabels.notifications.updateError,
            severity: 'error'
          });
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: AppLabels.notifications.operationError,
        severity: 'error'
      });
    }
  };

  // 完了状態の切り替え
  const handleToggleComplete = async (todoId: string, isCompleted: boolean) => {
    if (!accessToken) return;
    
    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId);
      if (!todoToUpdate) return;
      
      const updateData: UpdateTodoRequest = {
        title: todoToUpdate.title,
        description: todoToUpdate.description || undefined,
        dueDate: todoToUpdate.dueDate || undefined,
        isCompleted: isCompleted
      };
      
      const response = await apiClient.updateTodo(accessToken, todoId, updateData);
      if (response.data) {
        setTodos(prevTodos => 
          prevTodos.map(todo => todo.id === todoId ? response.data! : todo)
        );
        setSnackbar({
          open: true,
          message: isCompleted ? AppLabels.notifications.markCompleted : AppLabels.notifications.markIncomplete,
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: AppLabels.notifications.operationError,
        severity: 'error'
      });
    }
  };

  // TODOの削除
  const handleDeleteTodo = async (todoId: string) => {
    if (!accessToken) return;
    
    try {
      const response = await apiClient.deleteTodo(accessToken, todoId);
      if (response.statusCode === 204) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        setSnackbar({
          open: true,
          message: AppLabels.notifications.deleteSuccess,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: AppLabels.notifications.deleteError,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: AppLabels.notifications.operationError,
        severity: 'error'
      });
    }
  };

  // ソートオプション変更
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value);
  };

  // スナックバーを閉じる
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 未完了タスクの数をカウント
  const incompleteTodoCount = todos.filter(todo => !todo.isCompleted).length;

  return (
    <>
      {/* ヘッダー部分 */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid flex={1}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              {AppLabels.todos.title}
            </Typography>
            <Typography color="text.secondary" variant="subtitle1">
              {loading 
                ? AppLabels.todos.loading 
                : AppLabels.todos.incompleteTasks.replace('{count}', incompleteTodoCount.toString())
              }
            </Typography>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTodo}
            >
              {AppLabels.todos.createButton}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* フィルターとソート */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid flex={1} sx={{ mr: 2 }}>
            <TextField
              fullWidth
              placeholder={AppLabels.todos.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid>
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="sort-select-label">
                <SortIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                {AppLabels.todos.sortLabel}
              </InputLabel>
              <Select
                labelId="sort-select-label"
                value={sortOption}
                label={AppLabels.todos.sortLabel}
                onChange={handleSortChange}
              >
                <MenuItem value="updatedAt_desc">{AppLabels.todos.sortOptions.updatedAtDesc}</MenuItem>
                <MenuItem value="updatedAt_asc">{AppLabels.todos.sortOptions.updatedAtAsc}</MenuItem>
                <MenuItem value="dueDate_asc">{AppLabels.todos.sortOptions.dueDateAsc}</MenuItem>
                <MenuItem value="title_asc">{AppLabels.todos.sortOptions.titleAsc}</MenuItem>
                <MenuItem value="isCompleted_asc">{AppLabels.todos.sortOptions.isCompletedAsc}</MenuItem>
                <MenuItem value="isCompleted_desc">{AppLabels.todos.sortOptions.isCompletedDesc}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* エラーメッセージ */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* ローディング中 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* TODOリストが空の場合 */}
          {filteredTodos.length === 0 && !loading && (
            <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: 'background.paper', textAlign: 'center', py: 6 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {AppLabels.todos.empty.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm 
                    ? AppLabels.todos.empty.noMatchFilter
                    : AppLabels.todos.empty.createFirst
                  }
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* TODOリスト */}
          {filteredTodos.length > 0 && (
            <Box>
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTodo}
                  onClick={handleTodoClick}
                />
              ))}
            </Box>
          )}
        </>
      )}

      {/* TODO詳細/編集ダイアログ */}
      <TodoDialog
        open={dialogOpen}
        todo={selectedTodo}
        mode={dialogMode}
        onClose={handleCloseDialog}
        onSave={handleSaveTodo}
      />

      {/* 通知スナックバー */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
