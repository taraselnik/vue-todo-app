export const todosIn = [
  { id: 1, title: '1HTML + CSS', completed: true },
  { id: 2, title: '1JS', completed: false },
  { id: 3, title: '1React', completed: false },
  { id: 4, title: '1Vue.js', completed: true }
]

import { client } from '../client/httpClient'

export const getTodos = () => {
  return client.get('/todos?userId=6342')
}

export const createTodos = (title) => {
  return client.post('/todos', {
    title,
    completed: false,
    userId: 6342
  })
}

export const updateTodo = ({ id, title, completed }) => {
  return client.patch(`/todos/${id}`, {
    title,
    completed,
  })
}

export const deleteTodo = (todoId) => {
  return client.delete(`/todos/${todoId}`)
}