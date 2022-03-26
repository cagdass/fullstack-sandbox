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
          {todos.map((name, index) => (
            <div key={index} style={{display: 'flex', alignItems: 'center'}}>
              <Typography sx={{margin: '8px'}} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                sx={{flexGrow: 1, marginTop: '1rem'}}
                label='What to do?'
                value={name}
                onChange={event => {
                  setTodos([ // immutable update
                    ...todos.slice(0, index),
                    event.target.value,
                    ...todos.slice(index + 1)
                  ])
                }}
              />
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
                setTodos([...todos, ''])
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
