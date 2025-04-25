'use client';

import { Todo } from '@/lib/model';
import { Box, Card, CardActionArea, CardContent, Checkbox, Chip, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { AppLabels } from '@/config/label';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (todoId: string, isCompleted: boolean) => void;
  onDelete: (todoId: string) => void;
  onClick: (todo: Todo) => void;
}

export default function TodoItem({ todo, onToggleComplete, onDelete, onClick }: TodoItemProps) {
  // クリック時の処理を分離し、イベントバブリングを防止
  const handleToggleComplete = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onToggleComplete(todo.id, checked);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(todo.id);
  };

  // 日付のフォーマット
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
    } catch (e) {
      return '';
    }
  };

  // 期限日からステータスを判定
  const getDueDateStatus = () => {
    if (!todo.dueDate) return null;

    const now = new Date();
    const dueDate = new Date(todo.dueDate);
    
    if (todo.isCompleted) {
      return { color: 'success', label: AppLabels.todoItem.status.completed };
    } else if (dueDate < now) {
      return { color: 'error', label: AppLabels.todoItem.status.overdue };
    } else {
      // 1日以内なら警告
      const oneDayInMs = 24 * 60 * 60 * 1000;
      if (dueDate.getTime() - now.getTime() < oneDayInMs) {
        return { color: 'warning', label: AppLabels.todoItem.status.dueToday };
      }
    }
    return { color: 'info', label: AppLabels.todoItem.status.inProgress };
  };

  const status = getDueDateStatus();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Card 
        sx={{ 
          borderLeft: todo.isCompleted ? '4px solid #4caf50' : '4px solid #2196f3',
          transition: 'all 0.2s',
          opacity: todo.isCompleted ? 0.8 : 1,
          flex: 1
        }}
        elevation={1}
      >
        <CardActionArea onClick={() => onClick(todo)}>
          <CardContent sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Checkbox 
              checked={todo.isCompleted} 
              onChange={handleToggleComplete} 
              onClick={(e) => e.stopPropagation()} 
              color="primary"
            />

            <Box sx={{ ml: 1, flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle1"
                sx={{
                  fontWeight: todo.isCompleted ? 'normal' : 'medium',
                  textDecoration: todo.isCompleted ? 'line-through' : 'none',
                  wordBreak: 'break-word'
                }}
              >
                {todo.title}
              </Typography>
              
              {todo.description && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mt: 0.5, 
                    textDecoration: todo.isCompleted ? 'line-through' : 'none',
                    opacity: todo.isCompleted ? 0.7 : 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    wordBreak: 'break-word'
                  }}
                >
                  {todo.description}
                </Typography>
              )}
              
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                {todo.dueDate && (
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                    {AppLabels.todoItem.dueDate.replace('{date}', formatDate(todo.dueDate))}
                  </Typography>
                )}
                
                {status && (
                  <Chip
                    label={status.label}
                    color={status.color as any}
                    size="small"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
      <IconButton edge="end" onClick={handleDelete} color="error" sx={{ ml: 1 }}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
