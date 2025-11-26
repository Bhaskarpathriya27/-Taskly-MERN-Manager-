import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/task-service";

const defaultFilters = {
  page: 1,
  limit: 5,
  status: "all",
};

export const useTasks = (token) => {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: defaultFilters.limit,
  });
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildParams = useCallback((activeFilters) => {
    if (activeFilters.status === "all") {
      return { page: activeFilters.page, limit: activeFilters.limit };
    }
    return {
      page: activeFilters.page,
      limit: activeFilters.limit,
      status: activeFilters.status,
    };
  }, []);

  const loadTasks = useCallback(
    async (activeFilters) => {
      if (!token) return;
      setLoading(true);
      try {
        const params = buildParams(activeFilters);
        const { data } = await getTasks(token, params);
        setTasks(data.data);
        setMeta(data.meta);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch tasks");
        toast.error("Unable to load tasks");
      } finally {
        setLoading(false);
      }
    },
    [buildParams, token]
  );

  useEffect(() => {
    loadTasks(filters);
  }, [filters, loadTasks]);

  const fetchTasks = useCallback(
    (override = {}) => {
      if (Object.keys(override).length === 0) {
        return loadTasks(filters);
      }
      setFilters((prev) => ({ ...prev, ...override }));
    },
    [filters, loadTasks]
  );

  const saveTask = async (payload, taskId) => {
    if (!token) return null;
    try {
      if (taskId) {
        const { data } = await updateTask(token, taskId, payload);
        toast.success("Task updated");
        loadTasks(filters);
        return data;
      }
      const { data } = await createTask(token, payload);
      toast.success("Task created");
      setFilters((prev) => ({ ...prev, page: 1 }));
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save task");
      throw err;
    }
  };

  const removeTask = async (id) => {
    if (!token) return;
    try {
      await deleteTask(token, id);
      toast.success("Task deleted");
      loadTasks(filters);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete task");
      throw err;
    }
  };

  return {
    tasks,
    meta,
    loading,
    error,
    filters,
    setFilters,
    fetchTasks,
    saveTask,
    removeTask,
  };
};
