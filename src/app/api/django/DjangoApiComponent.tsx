import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface Task {
  id: number;
  title: string;
  description: string;
  conversation_duration_time: number;
}

interface Topic {
  id: number;
  language: string;
  description: string;
}

const TaskComponent: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('task_id');

    if (!taskId) {
      setError('Task ID not found in URL');
      return;
    }

    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/get_task/${taskId}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({}),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }
        const data = await response.json();
        setTask(data.task);
        setTopic(data.topic);
      } catch (error) {
        setError((error as Error)?.message || 'An error occurred');
      }
    };

    fetchTask();
  }, []);

  const handleGoBack = () => {
    window.location.href = 'http://localhost:8000/classrooms/pupil_dashboard/';
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!task || !topic) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Task Details
          </Typography>
          <Typography variant="h5" component="div" gutterBottom>
            Title: {task.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Description: {task.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Conversation Duration Time: {task.conversation_duration_time}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleGoBack}>Go Back</Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default TaskComponent;
