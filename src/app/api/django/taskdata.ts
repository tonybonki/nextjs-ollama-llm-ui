import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Divider, Link, Image } from "@nextui-org/react";

interface TaskData {
    topic: {
        language: string;
        description: string;
    };
    // Add other properties as needed
}

const TaskCard: React.FC = () => {
    const [taskData, setTaskData] = useState<TaskData | null>(null);

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/get_task/task_id_here/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({}),
                });

                if (response.ok) {
                    const data: TaskData = await response.json();
                    setTaskData(data);
                } else {
                    console.error('Error fetching task data');
                }
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchTaskData();
    }, []);

    return (
        <Card className= "max-w-[400px]" >
        <CardHeader className="flex gap-3" >
            <Image
                    alt="convolang logo"
                height = { 40}
                radius = "sm"
                src = "convolang_logo_url_here"
                width = { 40}
                    />
        <div className="flex flex-col" >
            <p className="text-md" > Convolang < /p>
                < p className = "text-small text-default-500" > convolang.org < /p>
                    < /div>
                    < /CardHeader>
                    < Divider />
                    <CardBody>
                    {
                        taskData?(
          <p> {`Talk about ${taskData.topic.description} in ${taskData.topic.language}`
}</p>
        ) : (
    <p>Loading task data...</p>
        )}
</CardBody>
    < Divider />
    <CardFooter>
    <Link
          isExternal
showAnchorIcon
href = "https://github.com/convolang-org/convolang"
    >
    Visit source code on GitHub.
        < /Link>
        < /CardFooter>
        < /Card>
  );
};

export default TaskCard;
