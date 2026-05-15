import React from 'react';
import { Paper, Group, Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';

import { TaskItem } from '../components/TaskItem';
import { useTaskContext } from '../context/TaskContext';

export const CompletedTasks: React.FC = () => {
  const { tasks } = useTaskContext();
  
  const completedTasks = tasks.filter((t) => t.completed);

  const today = new Date().toDateString();

  const todayTasks = completedTasks.filter(
    (t) => t.completedAt && new Date(t.completedAt).toDateString() === today
  );

  const otherTasks = completedTasks.filter(
    (t) => !t.completedAt || new Date(t.completedAt).toDateString() !== today
  );

  return (
    <>
      <Paper radius={0} bg="indigo.6" p="sm">
        <Group gap="xs">
          <IconCircleCheck size={18} color="white" />
          <Text c="white" fw={600}>Completed Tasks</Text>
        </Group>
      </Paper>

      <div className="cbody">
        {todayTasks.length > 0 && (
          <>
            {otherTasks.length === 0 && (
              <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">
                Completed Tasks
              </Text>
            )}
            {todayTasks.map((task) => (
              <TaskItem key={task.id} task={task} isCompleted={true} />
            ))}
          </>
        )}

        {otherTasks.length > 0 && (
          <>
            {todayTasks.length > 0 && (
              <Text size="xs" c="dimmed" tt="uppercase" fw={600} mt="md" mb="xs">
                Earlier
              </Text>
            )}
            {otherTasks.length > 0 && todayTasks.length === 0 && (
              <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">
                Completed Tasks
              </Text>
            )}
            {otherTasks.map((task) => (
              <TaskItem key={task.id} task={task} isCompleted={true} />
            ))}
          </>
        )}

        {completedTasks.length === 0 && (
          <Text ta="center" py="xl" c="dimmed">
            No completed tasks yet. Complete your first task!
          </Text>
        )}
      </div>
    </>
  );
};
