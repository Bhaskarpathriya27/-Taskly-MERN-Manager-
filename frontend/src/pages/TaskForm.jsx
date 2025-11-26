import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AppLayout } from '../layouts/AppLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../providers/auth-provider';
import { createTask, getTaskById, updateTask } from '../services/task-service';

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

export const TaskFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(id);
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(() => {
    const task = location.state;
    return {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'pending',
    };
  });

  useEffect(() => {
    if (isEditing && !location.state) {
      const fetchTask = async () => {
        setLoading(true);
        try {
          const { data } = await getTaskById(token, id);
          setForm({
            title: data.title,
            description: data.description,
            status: data.status,
          });
        } catch (err) {
          toast.error(err.response?.data?.message || 'Task not found');
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [id, isEditing, location.state, navigate, token]);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await updateTask(token, id, form);
        toast.success('Task updated');
      } else {
        await createTask(token, form);
        toast.success('Task created');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title={isEditing ? 'Edit Task' : 'Add Task'}>
      <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-6 shadow">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={form.title} onChange={onChange} required placeholder="e.g. Ship marketing email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              placeholder="Add more details..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={onChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update task' : 'Create task'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

