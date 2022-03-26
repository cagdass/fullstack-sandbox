import React, { Fragment, useState, useEffect } from 'react'
import { Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { TodoListForm } from './TodoListForm'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const getPersonalTodos = () => {
  return sleep(1000).then(() => Promise.resolve({
    '0000000001': {
      id: '0000000001',
      title: 'First List',
      todos: ['First todo of first list!'],
      completedTodos: [],
    },
    '0000000002': {
      id: '0000000002',
      title: 'Second List',
      todos: ['First todo of second list!'],
      completedTodos: []
    }
  }))
}

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
            const { todos = [], completedTodos = [] } = todoList;
            let listTitleSx = {};
            // No active todos in the list, but complete todo(s) exist(s).
            // Set extra styling for such lists.
            if (todos.length === 0 && completedTodos.length > 0) {
              listTitleSx = { textDecoration: 'line-through' };
            }

            return (
              <ListItem
                key={key}
                button
                onClick={() => setActiveList(key)}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText sx={listTitleSx} primary={todoList.title} />
              </ListItem>
              );
          })}
        </List>
      </CardContent>
    </Card>
    {todoLists[activeList] && <TodoListForm
      key={activeList} // use key to make React recreate component to reset internal state
      todoList={todoLists[activeList]}
      saveTodoList={(id, { todos, completedTodos }) => {
        const listToUpdate = todoLists[id]
        setTodoLists({
          ...todoLists,
          [id]: { ...listToUpdate, todos, completedTodos }
        })
      }}
    />}
  </Fragment>
}
