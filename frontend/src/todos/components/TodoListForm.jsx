import React, { useState, useEffect } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import TaskIcon from '@mui/icons-material/Task'; // To mark a task complete.

// In order to show completed todos' names in strikethrough.
const completedTodoTheme = createTheme({
  typography: {
    body2: {
      textDecoration: 'line-through',
    },
  },
});

const getTomorrowsDate = () => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1) // Set to tomorrow's date
  // Extract a string in the format 'YYYY-MM-DD':
  return tomorrow.toISOString().split('T')[0];
}

// dueDate: 'YYYY-MM-DD', dueTime: 'HH:mm'
const getTimeRemainingText = (dueDate, dueTime) => {
  // Reconstruct a Date object from the arguments
  const dueDateTime = new Date(`${dueDate}T${dueTime}`);
  const diff = dueDateTime - new Date();
  if (diff < 0) {
    return 'Overdue';
  } else if (diff >= 0) {
    // time units in ms:
    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day; // roughly
    const year = 12 * month; // roughly

    const timeUnits = [['year', year], ['month', month], ['day', day], ['hour', hour], ['minute', minute], ['second', second]];

    for (let i = 0; i + 1 < timeUnits.length; i++) {
      if (Math.floor(diff / timeUnits[i][1]) > 0) {
        const unitLeft1 = Math.floor(diff / timeUnits[i][1]);
        const unitLeft2 = Math.floor((diff % timeUnits[i][1]) / timeUnits[i + 1][1]);
        return `Due in ${unitLeft1} ${timeUnits[i][0]}s ${unitLeft2} ${timeUnits[i + 1][0]}s`;
      }
    }
  }

  return '';
};

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)
  const [completedTodos, setCompletedTodos] = useState(todoList.completedTodos);

  useEffect(() => {
    saveTodoList(todoList.id, { todos, completedTodos })
  }, [todos, completedTodos]);

  return (
    <Card sx={{margin: '0 1rem'}}>
      <CardContent>
        <Typography component='h2'>
          {todoList.title}
        </Typography>
        <form style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
          {todos.map((todo, index) => (
            <div key={index} style={{display: 'flex', alignItems: 'center'}}>
              <Typography sx={{margin: '8px'}} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                sx={{flexGrow: 1, marginTop: '1rem'}}
                label='What to do?'
                value={todo.text}
                onChange={event => {
                  setTodos([ // immutable update
                    ...todos.slice(0, index),
                    Object.assign({}, todos[index], { text: event.target.value }), // immutable update
                    ...todos.slice(index + 1)
                  ])
                }}
              />
              <TextField
                sx={{flexGrow: 1, marginLeft: '1rem', marginTop: '1rem', width: 220}}
                id="date"
                label="Due date"
                type="date"
                defaultValue={getTomorrowsDate()}
                onChange={event => {
                  setTodos([ // immutable update
                    ...todos.slice(0, index),
                    Object.assign({}, todos[index], { dueDate: event.target.value }), // immutable update
                    ...todos.slice(index + 1)
                  ])
                }}
              />
              <TextField
                sx={{flexGrow: 1, marginLeft: '1rem', marginTop: '1rem', width: 150}}
                id="time"
                label="Due time"
                type="time"
                defaultValue="16:00"
                onChange={event => {
                  setTodos([ // immutable update
                    ...todos.slice(0, index),
                    Object.assign({}, todos[index], { dueTime: event.target.value }), // immutable update
                    ...todos.slice(index + 1)
                  ])
                }}
              />
              <Typography
                sx={{ marginLeft: '1rem' }}
                variant="body2"
              >
                {getTimeRemainingText(todo.dueDate, todo.dueTime)}
              </Typography>
              <Button
                sx={{margin: '8px'}}
                size="small"
                color="secondary"
                onClick={() => {
                  // Add the todo to completed todos.
                  setCompletedTodos([
                    ...completedTodos,
                    todos[index],
                  ]);
                  // Remove the todo from active todos.
                  setTodos([
                    ...todos.slice(0,index),
                    ...todos.slice(index+1),
                  ])
                }}
              >
                <TaskIcon />
              </Button>
              <Button
                sx={{margin: '8px'}}
                size='small'
                color='secondary'
                onClick={() => {
                  setTodos([ // immutable delete
                    ...todos.slice(0, index),
                    ...todos.slice(index + 1)
                  ])
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          {/* Completed todos rendered below. Currently not possible to mark a todo back as incomplete. */}
          <Typography
            component='h3'
            sx={{margin: '1rem 0'}}
          >
            Completed Todos
          </Typography>
          {completedTodos.map((name, index) => (
            <div
              key={index}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Typography sx={{margin: '8px'}} variant="body2">
                {`${index + 1} -`}
              </Typography>
              <ThemeProvider theme={completedTodoTheme}>
              <Typography sx={{margin: '8px'}} variant="body2">
                  {name}
                </Typography>
              </ThemeProvider>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, { text: '', dueDate: getTomorrowsDate(), dueTime: '16:00' }])
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
