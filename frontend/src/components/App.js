import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import Task from '../components/Task';
import { useDropzone } from 'react-dropzone';
import '../animations.css'; // Import the animations CSS file

function App() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [tasks, setTasks] = useState([]);
    const [file, setFile] = useState(null);

    const handlePredict = () => {
        const formData = new FormData();
        formData.append('input', input);
        if (file) {
            formData.append('file', file);
        }

        axios.post('http://localhost:5000/predict', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log("API Response Data:", response.data);  // 打印从后端返回的数据
                const taskBreakdown = response.data.task_breakdown;
                const totalCompletionTime = response.data.total_completion_time_seconds;

                const newTask = {
                    id: tasks.length + 1,
                    title: taskBreakdown.task_title,
                    complete: false,
                    total_time: totalCompletionTime,
                    sub_tasks: taskBreakdown.sub_tasks,
                    time_used: '',
                    backgroundColor: '#FFA500'
                };
                setTasks([...tasks, newTask]);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const handleStartTask = (id) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === id) {
                task.start_time = new Date();
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    const handleCompleteTask = (taskId) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                task.complete_time = new Date();
                task.complete = true;
                const startTime = task.start_time;
                const completeTime = task.complete_time;
                task.time_used = ((completeTime - startTime) / 1000) + ' seconds';
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                AI Prediction App
            </Typography>
            <TextField
                label="Task Title"
                variant="outlined"
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ marginBottom: '20px' }}
            />
            <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed blue', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
                <input {...getInputProps()} />
                <Typography>Drag 'n' drop a file here, or click to select a file</Typography>
            </div>
            <Button variant="contained" color="primary" onClick={handlePredict} style={{ marginBottom: '20px' }}>
                PREDICT AND ADD TASK
            </Button>
            {tasks.map(task => (
                <Task
                    key={task.id}
                    task={task}
                    onStart={handleStartTask}
                    onComplete={handleCompleteTask}
                    backgroundColor={task.backgroundColor}
                />
            ))}
        </Container>
    );
}

export default App;
