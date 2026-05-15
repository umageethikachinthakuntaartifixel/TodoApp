import React, { useState, useRef } from 'react';
import { Paper, TextInput, Select, Button, Group, Stack, Text, Divider } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import { TaskItem } from '../components/TaskItem';
import { useTaskContext } from '../context/TaskContext';
import { Priority, Category } from '../types';

export const Home: React.FC = () => {
  const { tasks, addTask, reorderTasks, getStats } = useTaskContext();

  const stats = getStats();

  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [category, setCategory] = useState<Category>('Study');
  const [filter, setFilter] = useState<string>('All');

  const dragId = useRef<string | null>(null);

  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleAddTask = () => {
    if (taskName.trim()) {
      addTask({
        name: taskName,
        priority,
        category,
        completed: false,
      });

      setTaskName('');
      setPriority('Medium');
      setCategory('Study');
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    dragId.current = taskId;
    e.dataTransfer.effectAllowed = 'move';

    setTimeout(() => {
      const el = document.getElementById(`task-wrap-${taskId}`);
      if (el) el.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (taskId: string) => {
    dragId.current = null;
    setDragOverId(null);

    const el = document.getElementById(`task-wrap-${taskId}`);
    if (el) el.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (taskId !== dragOverId) setDragOverId(taskId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, dropTaskId: string) => {
    e.preventDefault();
    setDragOverId(null);

    const sourceId = dragId.current;
    if (!sourceId || sourceId === dropTaskId) return;

    const sourceIndex = tasks.findIndex((t) => t.id === sourceId);
    const dropIndex = tasks.findIndex((t) => t.id === dropTaskId);

    if (sourceIndex === -1 || dropIndex === -1) return;

    reorderTasks(sourceIndex, dropIndex);
  };

  const pendingTasks = tasks.filter((t) => !t.completed);

  const filteredTasks = pendingTasks.filter((task) => {
    if (filter === 'All') return true;
    if (filter === 'High' || filter === 'Medium' || filter === 'Low') return task.priority === filter;
    return task.category === filter;
  });

  return (
    <>
      {/* Stats bar */}
      <Paper radius={0} p="sm" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <Group justify="space-around" align="center">
          <Stack align="center" gap={2}>
            <Text fw={700} size="xl" c="indigo">{stats.pending}</Text>
            <Text size="xs" c="dimmed" tt="uppercase">Pending</Text>
          </Stack>

          <Divider orientation="vertical" />

          <Stack align="center" gap={2}>
            <Text fw={700} size="xl" c="green">{stats.completed}</Text>
            <Text size="xs" c="dimmed" tt="uppercase">Done</Text>
          </Stack>

          <Divider orientation="vertical" />

          <Stack align="center" gap={2}>
            <Text fw={700} size="xl" c="orange">{stats.high}</Text>
            <Text size="xs" c="dimmed" tt="uppercase">High</Text>
          </Stack>

          <Divider orientation="vertical" />

          <Stack align="center" gap={2}>
            <Text fw={700} size="xl" c="gray">{stats.completionRate}%</Text>
            <Text size="xs" c="dimmed" tt="uppercase">Complete</Text>
          </Stack>
        </Group>
      </Paper>

      <div className="body">
        {/* Add task form */}
        <Paper p="md" radius="lg" withBorder mb="md" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)', borderColor: '#e0e7ff' }}>
          <Group gap="xs" mb="xs">
            <IconPlus size={14} color="#4f46e5" />
            <Text fw={700} size="sm" c="indigo">New task</Text>
          </Group>

          <Group gap="xs" align="flex-end">
            <TextInput
              placeholder="What needs to be done?"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              radius="md"
              style={{ flex: 1 }}
            />

            <Select
              data={[
                { value: 'High', label: 'High Priority' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'Low', label: 'Low Priority' },
              ]}
              value={priority}
              onChange={(val) => val && setPriority(val as Priority)}
              radius="md"
              w={160}
            />

            <Select
              data={['Study', 'Work', 'Personal']}
              value={category}
              onChange={(val) => val && setCategory(val as Category)}
              radius="md"
              w={130}
            />

            <Button
              leftSection={<IconPlus size={14} />}
              onClick={handleAddTask}
              radius="md"
              variant="gradient"
              gradient={{ from: 'indigo', to: 'violet', deg: 135 }}
              style={{ fontWeight: 600 }}
            >
              Add Task
            </Button>
          </Group>
        </Paper>
        {/* Filter buttons */}
        <Group gap="xs" mb="md">
          {['All', 'High', 'Medium', 'Low', 'Study', 'Work'].map((f) => (
            <Button
              key={f}
              size="xs"
              variant={filter === f ? 'filled' : 'subtle'}
              color="indigo"
              radius="xl"
              onClick={() => setFilter(f)}
              style={{ fontWeight: 600, transition: 'all 0.15s ease', minWidth: 52 }}
            >
              {f}
            </Button>
          ))}
        </Group>
        {/* Task list with drag-and-drop wrappers */}
        <Stack gap="xs">
          {filteredTasks.map((task) => (
            <div
              id={`task-wrap-${task.id}`}
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragEnd={() => handleDragEnd(task.id)}
              onDragOver={(e) => handleDragOver(e, task.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, task.id)}
              className={`draggable-task-wrapper${dragOverId === task.id ? ' drag-over' : ''}`}
            >
              <TaskItem task={task} />
            </div>
          ))}
        </Stack>

        {filteredTasks.length === 0 && (
          <Text ta="center" py="xl" c="dimmed">
            No tasks found. Add a new task to get started!
          </Text>
        )}
      </div>
    </>
  );
};
