'use client';

import { Todo, UpdateTodoRequest } from '@/lib/model';
import {
  Button, 
  Checkbox,
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  FormControlLabel, 
  Stack, 
  TextField 
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { AppLabels } from '@/config/label';

interface TodoDialogProps {
  open: boolean;
  todo?: Todo | null;
  mode: 'view' | 'edit' | 'create';
  onClose: () => void;
  onSave: (data: UpdateTodoRequest | Todo, todoId?: string) => Promise<void>;
}

export default function TodoDialog({ open, todo, mode, onClose, onSave }: TodoDialogProps) {
  const [formData, setFormData] = useState<UpdateTodoRequest>({
    title: '',
    description: undefined,
    dueDate: undefined,
    isCompleted: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // todoデータが変更されたときにフォームを更新
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || undefined,
        dueDate: todo.dueDate || undefined,
        isCompleted: todo.isCompleted,
      });
    } else {
      // 新規作成時はフォームをリセット
      setFormData({
        title: '',
        description: undefined,
        dueDate: undefined,
        isCompleted: false,
      });
    }
    setErrors({});
  }, [todo, open]);

  // 入力変更時のハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 日付変更時のハンドラ
  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      dueDate: date ? date.toISOString() : undefined
    }));
  };

  // バリデーション
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) {
      newErrors.title = AppLabels.dialogs.todo.titleRequired;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存処理
  const handleSave = async () => {
    if (mode === 'view' || !validateForm()) return;
    
    setLoading(true);
    try {
      await onSave(formData, todo?.id);
      onClose();
    } catch (error) {
      console.error('保存中にエラーが発生しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // ダイアログタイトル
  const getDialogTitle = () => {
    switch (mode) {
      case 'create': return AppLabels.dialogs.todo.createTitle;
      case 'edit': return AppLabels.dialogs.todo.editTitle;
      default: return AppLabels.dialogs.todo.viewTitle;
    }
  };

  // 読み取り専用モード
  const isReadOnly = mode === 'view';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label={AppLabels.dialogs.todo.titleLabel}
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={!!errors.title}
            helperText={errors.title}
            disabled={isReadOnly || loading}
            required={!isReadOnly}
          />
          
          <TextField
            label={AppLabels.dialogs.todo.descriptionLabel}
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            disabled={isReadOnly || loading}
          />
          
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DateTimePicker
              label={AppLabels.dialogs.todo.dueDateLabel}
              value={formData.dueDate ? new Date(formData.dueDate) : null}
              onChange={handleDateChange}
              disabled={isReadOnly || loading}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined'
                }
              }}
            />
          </LocalizationProvider>
          
          <FormControlLabel
            control={
              <Checkbox
                name="isCompleted"
                checked={formData.isCompleted}
                onChange={handleChange}
                disabled={isReadOnly || loading}
                color="primary"
              />
            }
            label={AppLabels.dialogs.todo.completedLabel}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          {isReadOnly ? AppLabels.dialogs.todo.closeButton : AppLabels.dialogs.todo.closeButton}
        </Button>
        {!isReadOnly && (
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {AppLabels.dialogs.todo.saveButton}
          </Button>
        )}
        {isReadOnly && (
          <Button 
            onClick={() => onSave(todo as Todo, todo?.id)}
            variant="outlined" 
            color="primary"
          >
            {AppLabels.dialogs.todo.editButton}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
