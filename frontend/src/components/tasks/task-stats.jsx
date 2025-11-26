import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export const TaskStats = ({ items }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader>
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className="text-3xl">{item.value}</CardTitle>
          </CardHeader>
          {item.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

