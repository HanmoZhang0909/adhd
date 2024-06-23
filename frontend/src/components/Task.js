import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import '../Task.css'; // Import Task CSS file
import '../animations.css'; // Import animations CSS file

const Task = ({ task, onStart, onComplete, backgroundColor }) => {
    const taskStyle = {
        backgroundColor: backgroundColor || 'orange',
        borderRadius: '15px',
        padding: '20px',
    };

    const subTaskContainerStyle = {
        display: 'flex',
        width: '100%',
        overflow: 'hidden',
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
        <Card style={taskStyle} className="task-card">
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
                            margin="0" // 移除左右间距
                            padding="10px" // 增加内边距
                            className={`sub-task hvr-sweep-to-right ${subTask.completed ? 'completed' : 'pending'}`} // Add the animation class here
                            onClick={() => handleSubTaskClick(index)}
                            style={{ 
                                borderRight: index < task.sub_tasks.length - 1 ? '2px solid white' : 'none', // 添加白色分隔线，最后一个子任务没有分隔线
                                backgroundColor: subTask.completed ? 'lightgreen' : 'initial' // 完成后改变背景颜色
                            }}
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
