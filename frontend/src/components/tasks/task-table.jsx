import React from 'react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const statusVariant = {
  pending: 'secondary',
  completed: 'default',
};

export const TaskTable = ({ tasks, loading, meta, onPageChange, onEdit, onDelete, canDelete }) => {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableCaption className="px-4 pb-4 text-left">
            Showing up to {meta.limit ?? tasks.length} tasks per page
          </TableCaption>
          <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
          <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                Loading tasks...
              </TableCell>
            </TableRow>
          )}
          {!loading && tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                No tasks yet. Create your first one!
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {task.description || '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[task.status] || 'outline'} className="capitalize">
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(task.createdAt), 'dd MMM yyyy')}</TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(task)}>
                    Edit
                  </Button>
                  {canDelete && (
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onDelete(task)}>
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
        <span>
          Page {meta.page} of {meta.totalPages}
        </span>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= meta.totalPages}
            onClick={() => onPageChange(meta.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

