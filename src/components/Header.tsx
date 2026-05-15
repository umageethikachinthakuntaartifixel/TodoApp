import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Group, Button, Badge, Text, Box } from '@mantine/core';
import { IconHome, IconCircleCheck } from '@tabler/icons-react';

import { useTaskContext } from '../context/TaskContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getStats } = useTaskContext();

  const stats = getStats();

  const isHome = location.pathname === '/';

  return (
    <Box bg="indigo.6" px="xl" py="sm">
      <Group justify="space-between" align="center">

        <Group gap="xs">
          <Box
            style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            ✓
          </Box>
          <Text c="white" fw={700} size="lg">TodoApp</Text>
        </Group>

        <Group gap="xs">
          <Button
            variant={isHome ? 'white' : 'subtle'}
            c={isHome ? 'indigo.7' : 'white'}
            leftSection={<IconHome size={14} />}
            onClick={() => navigate('/')}
            size="sm"
          >
            Home
          </Button>
          <Button
            variant={!isHome ? 'white' : 'subtle'}
            c={!isHome ? 'indigo.7' : 'white'}
            leftSection={<IconCircleCheck size={14} />}
            onClick={() => navigate('/completed')}
            size="sm"
          >
            Completed
          </Button>
        </Group>

        <Badge color="yellow" size="lg" variant="filled">
          {stats.pending} Pending
        </Badge>

      </Group>
    </Box>
  );
};
