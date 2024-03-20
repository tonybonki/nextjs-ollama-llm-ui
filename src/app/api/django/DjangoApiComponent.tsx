import React, { useEffect, useState } from 'react';

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
        const data = await response.json();
        setTask(data.task);
        setTopic(data.topic);
      } catch (error) {
        setError((error as Error)?.message || 'An error occurred');
      }
    };
  
    fetchTask();
  }, []);
  

  const handleStartTask = () => {
    window.location.href = `http://localhost:3000/?task_id=${task?.id}`;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!task || !topic) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Task Details</h2>
      <p>Title: {task.title}</p>
      <p>Description: {task.description}</p>
      <p>Conversation Duration Time: {task.conversation_duration_time}</p>
      <button className="btn btn-primary" onClick={handleStartTask}>Start Task</button>
    </div>
  );
};

export default TaskComponent;
