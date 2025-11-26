import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { TaskStats } from '../components/tasks/task-stats';
import { TaskFilters } from '../components/tasks/task-filters';
import { TaskTable } from '../components/tasks/task-table';
import { Button } from '../components/ui/button';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../providers/auth-provider';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();
  const { tasks, meta, loading, filters, fetchTasks, removeTask } = useTasks(token);

  const pendingCount = tasks.filter((task) => task.status === 'pending').length;
  const completedCount = tasks.filter((task) => task.status === 'completed').length;

  const stats = [
    { label: 'Total tasks', value: meta.total },
    { label: 'Pending', value: pendingCount },
    { label: 'Completed', value: completedCount },
  ];

  return (
    <AppLayout title="Dashboard">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground">Manage tasks, track status, and stay productive.</p>
        <Button onClick={() => navigate('/tasks/new')}>New Task</Button>
      </div>
      <TaskStats items={stats} />
      <div className="mt-6 space-y-4">
        <TaskFilters
          status={filters.status}
          onStatusChange={(status) => fetchTasks({ page: 1, status })}
          onRefresh={() => fetchTasks()}
        />
        <TaskTable
          tasks={tasks}
          loading={loading}
          meta={meta}
          onPageChange={(page) => fetchTasks({ page })}
          onEdit={(task) => navigate(`/tasks/${task.id}/edit`, { state: task })}
          onDelete={(task) => removeTask(task.id)}
          canDelete={isAdmin}
        />
      </div>
    </AppLayout>
  );
};

