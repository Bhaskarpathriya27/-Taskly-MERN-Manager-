import React from 'react';
import { Button } from '../ui/button';

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

export const TaskFilters = ({ status, onStatusChange, onRefresh }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card/60 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <div className="flex items-center gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={status === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      <Button variant="ghost" onClick={onRefresh}>
        Refresh
      </Button>
    </div>
  );
};

