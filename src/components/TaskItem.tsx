import React, { useState } from 'react';
import { Paper, Group, Badge, ActionIcon, Text, Checkbox, Modal, TextInput, Button, Stack, ThemeIcon, Tooltip } from '@mantine/core';
import { IconPencil, IconTrash, IconGripVertical, IconDeviceFloppy, IconCheck, IconX } from '@tabler/icons-react';

import { Task, Priority, Category } from '../types';
import { useTaskContext } from '../context/TaskContext';

interface TaskItemProps {
  task: Task;
  isCompleted?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, isCompleted = false }) => {
  const { updateTask, deleteTask, toggleTask } = useTaskContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editCategory, setEditCategory] = useState<Category>(task.category);
  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSave = () => {
    updateTask(task.id, {
      name: editName,
      priority: editPriority,
      category: editCategory,
    });

    setIsEditing(false);
  };

  const handleEditOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const getPriorityColor = (priority: Priority) => {
    return priority === 'High' ? 'red' : priority === 'Medium' ? 'yellow' : 'green';
  };

  const getCategoryColor = (category: Category) => {
    return category === 'Study' ? 'violet' : category === 'Work' ? 'blue' : 'teal';
  };

  const getBorderColor = (priority: Priority) => {
    return priority === 'High' ? '#ef4444' : priority === 'Medium' ? '#f59e0b' : '#10b981';
  };
  // ── Edit modal ─────────────────────────────────────────────────────────────
  const editModal = (
    <Modal
      opened={isEditing}
      onClose={() => setIsEditing(false)}
      title={<Text fw={700} size="md">✏️ Edit Task</Text>}
      centered
      radius="lg"
      overlayProps={{ blur: 3, backgroundOpacity: 0.35 }}
    >
      <Stack gap="md">
        <TextInput
          label="Task name"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          radius="md"
        />

        <div>
          <Text size="sm" fw={600} mb="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: '0.04em' }}>Priority</Text>
          <Group gap="xs">
            {(['High', 'Medium', 'Low'] as Priority[]).map((p) => (
              <Button
                key={p}
                size="xs"
                variant={editPriority === p ? 'filled' : 'light'}
                color={getPriorityColor(p)}
                radius="xl"
                onClick={() => setEditPriority(p)}
                style={{ fontWeight: 600, minWidth: 72, transition: 'all 0.15s ease' }}
              >
                {p}
              </Button>
            ))}
          </Group>
        </div>

        <div>
          <Text size="sm" fw={600} mb="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: '0.04em' }}>Category</Text>
          <Group gap="xs">
            {(['Study', 'Work', 'Personal'] as Category[]).map((c) => (
              <Button
                key={c}
                size="xs"
                variant={editCategory === c ? 'filled' : 'light'}
                color="indigo"
                radius="xl"
                onClick={() => setEditCategory(c)}
                style={{ fontWeight: 600, minWidth: 80, transition: 'all 0.15s ease' }}
              >
                {c}
              </Button>
            ))}
          </Group>
        </div>

        <Group justify="flex-end" gap="xs" mt="xs">
          <Button
            variant="subtle"
            color="gray"
            radius="md"
            leftSection={<IconX size={14} />}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button
            radius="md"
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={handleSave}
            variant="gradient"
            gradient={{ from: 'indigo', to: 'violet', deg: 135 }}
            style={{ fontWeight: 600 }}
          >
            Save changes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
  // ── Completed task view ────────────────────────────────────────────────────
  if (isCompleted) {
    return (
      <Paper
        p="sm"
        radius="lg"
        withBorder
        mb="xs"
        style={{
          borderLeft: '4px solid #10b981',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
          borderColor: '#d1fae5',
          transition: 'box-shadow 0.2s ease',
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <ThemeIcon color="green" radius="xl" size="md" variant="filled" style={{ boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)' }}>
              <IconCheck size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500} c="gray.7">
              {task.name}
            </Text>
          </Group>

          <Group gap="xs">
            <Badge
              color={getPriorityColor(task.priority)}
              variant="dot"
              size="sm"
              radius="sm"
              style={{ fontWeight: 600 }}
            >
              {task.priority}
            </Badge>
            <Badge
              color={getCategoryColor(task.category)}
              variant="outline"
              size="sm"
              radius="sm"
              style={{ fontWeight: 600 }}
            >
              {task.category}
            </Badge>
            <Tooltip label="Delete task" withArrow position="top">
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                radius="md"
                onClick={() => deleteTask(task.id)}
                style={{ transition: 'background 0.15s ease' }}
              >
                <IconX size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Paper>
    );
  }
  // ── Pending task view ──────────────────────────────────────────────────────
  return (
    <>
      {editModal}

      <Paper
        p="sm"
        radius="lg"
        withBorder
        style={{
          borderLeft: `4px solid ${getBorderColor(task.priority)}`,
          background: '#ffffff',
          transition: 'box-shadow 0.2s ease, transform 0.15s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(79, 70, 229, 0.12)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = '';
          (e.currentTarget as HTMLElement).style.transform = '';
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconGripVertical size={16} color="#9ca3af" style={{ cursor: 'grab' }} />

            <Checkbox
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              radius="xl"
              color="green"
            />

            <Text size="sm" fw={500}>
              {task.name}
            </Text>
          </Group>

          <Group gap="xs">
            <Badge
              color={getPriorityColor(task.priority)}
              variant="dot"
              size="sm"
              radius="sm"
              style={{ fontWeight: 600 }}
            >
              {task.priority}
            </Badge>
            <Badge
              color={getCategoryColor(task.category)}
              variant="outline"
              size="sm"
              radius="sm"
              style={{ fontWeight: 600 }}
            >
              {task.category}
            </Badge>
            <Tooltip label="Edit task" withArrow position="top">
              <ActionIcon
                variant="light"
                color="indigo"
                size="sm"
                radius="md"
                onClick={handleEditOpen}
                style={{ transition: 'background 0.15s ease' }}
              >
                <IconPencil size={14} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete task" withArrow position="top">
              <ActionIcon
                variant="light"
                color="red"
                size="sm"
                radius="md"
                onClick={() => deleteTask(task.id)}
                style={{ transition: 'background 0.15s ease' }}
              >
                <IconTrash size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Paper>
    </>
  );
};
