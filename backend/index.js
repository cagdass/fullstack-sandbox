const express = require('express')
const cors = require('cors')
const app = express()

let todos = {
    '0000000001': {
        id: '0000000001',
        title: 'First List',
        todos: [{ text: 'First todo of first list!', dueDate: '2022-03-27', dueTime: '17:00', completed: false }],
    },
    '0000000002': {
        id: '0000000002',
        title: 'Second List',
        todos: [{ text: 'First todo of second list!', dueDate: '2022-02-10', dueTime: '08:00', completed: false }],
    }
};

app.use(cors())
app.use(express.json())

const PORT = 3001

app.get('/get_todos', (req, res) => {
    res.json(todos);
});

app.post('/save_todo', (req, res) => {
    const { body = {} } = req;
    const { id = '', list = {} } = body;
    if (id !== '') {
        todos[id] = list;
        res.status(200).send('Success');
    } else {
        res.status(200).send('Missing id');
    }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
