// Task.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import '../Task.css'; // Import Task CSS file
import '../animations.css'; // Import animations CSS file

const Task = ({ task, onStart, onComplete, backgroundColor }) => {
    const taskStyle = {
        backgroundColor: backgroundColor || 'orange',
        padding: '20px',
    };

    const subTaskContainerStyle = {
        display: 'flex',
        width: '100%',
        overflow: 'hidden',
        justifyContent: 'space-between', // 平均分布子任务
        marginTop: '20px',
    };

    const total_time = task.sub_tasks.reduce((sum, subTask) => sum + subTask.time_seconds, 0);
    const parentWidth = 1000; // 设定母任务的宽度，可以根据需要调整
    const scaleFactor = parentWidth / total_time;

    const handleSubTaskClick = (index) => {
        const updatedSubTasks = task.sub_tasks.map((subTask, i) => {
            if (i === index) {
                return { ...subTask, completed: true };
            }
            return subTask;
        });
        task.sub_tasks = updatedSubTasks;
        onComplete(task.id);
    };

    return (
        <Card style={taskStyle} className="task-card noto-sans">
            <CardContent>
                <Typography variant="h6">
                    {task.title}
                </Typography>
                <Typography variant="body2" style={{ marginBottom: '10px' }}>
                    Total Time: {task.total_time} seconds
                </Typography>
                <Box style={subTaskContainerStyle}>
                    {task.sub_tasks.map((subTask, index) => (
                        <Box
                            key={index}
                            width={`${subTask.time_seconds * scaleFactor}px`}
                            margin="0 1px" // 增加左右间距
                            padding="10px" // 增加内边距
                            className={`sub-task hvr-sweep-to-right ${subTask.completed ? 'completed' : 'pending'}`} // Add the animation class here
                            onClick={() => handleSubTaskClick(index)}
                            style={{ borderRadius: '0px' }} // Ensure the border-radius is applied here as well
                        >
                            <Typography variant="body2" style={{ marginBottom: '5px' }}>
                                {subTask.task_description}
                            </Typography>
                            <Typography variant="body2">
                                {subTask.time_seconds} seconds
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Box display="flex" justifyContent="center" marginTop="20px">
                    <Box
                        component="button"
                        onClick={() => onStart(task.id)}
                        className="start-button"
                    >
                        START
                    </Box>
                </Box>
                {task.time_used && (
                    <Typography variant="body1" gutterBottom>
                        Time Used: {task.time_used}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default Task;
