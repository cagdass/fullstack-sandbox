import React, { Fragment, useState, useEffect } from 'react'
import { Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { TodoListForm } from './TodoListForm'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const getPersonalTodos = () => (
    fetch('http://localhost:3001/get_todos')
      .then(res => res.json())
  );

const savePersonalTodo = (id, list) => (
  fetch('http://localhost:3001/save_todo', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, list }),
  })
    .then(res =>
      res.json()
    )
);

const isListCompleted = list => {
  return list.todos.every(todo => todo.completed);
};

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()

  useEffect(() => {
    getPersonalTodos()
      .then(setTodoLists)
  }, [])

  if (!Object.keys(todoLists).length) return null
  return <Fragment>
    <Card style={style}>
      <CardContent>
        <Typography
          component='h2'
        >
          My Todo Lists
        </Typography>
        <List>
          {Object.keys(todoLists).map((key) => {
            const todoList = todoLists[key];

            return (
              <ListItem
                key={key}
                button
                onClick={() => setActiveList(key)}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText
                  sx={isListCompleted(todoList) ? { textDecoration: 'line-through' } : {} }
                  primary={todoList.title}
                />
              </ListItem>
              );
          })}
        </List>
      </CardContent>
    </Card>
    {todoLists[activeList] && <TodoListForm
      key={activeList} // use key to make React recreate component to reset internal state
      todoList={todoLists[activeList]}
      saveTodoList={(id, { todos }) => {
        const listToUpdate = todoLists[id];
        savePersonalTodo(id, { ...listToUpdate, todos })
          .then(
            setTodoLists({
              ...todoLists,
              [id]: { ...listToUpdate, todos }
            })
          );
      }}
    />}
  </Fragment>
}
