<script>
import { getTodos, createTodos, updateTodo, deleteTodo } from './api/todos.ts';
import StatusFilter from './components/StatusFilter.vue';
import TodoItem from './components/TodoItem.vue';
import Message from './components/Message.vue';

export default {
  components: {
    StatusFilter,
    TodoItem,
    Message,
  },
  data() {
    // let todos = []
    // const jsonData = localStorage.getItem('todos')
    // let temp = JSON.parse(jsonData)
    // todos = todosIn

    return {
      todos: [],
      titleNewTodo: '',
      statusFilter: 'all',
      errorMessage: '',
    }
  },
  computed: {
    activeTodos() {
      return this.todos.filter((todo) => !todo.completed)
    },
    completedTodos() {
      return this.todos.filter((todo) => todo.completed)
    },
    visibleTodos() {
      switch (this.statusFilter) {
        case 'active':
          return this.activeTodos
        case 'completed':
          return this.completedTodos
        default:
          return this.todos
      }
    }
  },
  // watch: {
  //   todos: {
  //     deep: true,
  //     handler() {
  //       console.log(this.todos.length)
  //       localStorage.setItem('todos', JSON.stringify(this.todos))
  //     }
  //   }
  // },
  mounted() {
    getTodos()
      .then((res) => {
      console.log(res)
      this.todos = res.data
      })
      .catch(() => {
        this.errorMessage = 'Unable to load todo list'
      })
  },

  methods: {
    handleSubmit() {
      // this.todos.push({
      //   id: Date.now(),
      //   title: this.titleNewTodo,
      //   completed: false
      // })

      createTodos(this.titleNewTodo)
        .then((res) => {
          console.log(res)
          this.todos = [...this.todos, res.data]
          this.titleNewTodo = ''
        })
        .catch((err) => {
          console.log(err)
        })
      this.titleNewTodo = ''
    },

    updateTodo({ id, title, completed }) {
      updateTodo({ id, title, completed }).then((res) => {
        this.todos = this.todos.map((todo) => (todo.id === id ? res.data : todo))
      })
    },

    deleteTodo(id) {
      deleteTodo(id).then(() => (this.todos = this.todos.filter((todo) => todo.id !== id)))
    }
  }
}
</script>

<template>
  <div class="todoapp">
    <h1 class="todoapp__title">{todos}</h1>

    <div class="todoapp__content">
      <header class="todoapp__header">
        <button class="todoapp__toggle-all" :class="{ active: activeTodos }"></button>

        <form @submit.prevent="handleSubmit">
          <input
            type="text"
            class="todoapp__new-todo"
            placeholder="What needs to be done?"
            v-model="titleNewTodo"
          />
        </form>
      </header>

      <TransitionGroup name="list" tag="section" class="todoapp__main">
        <TodoItem
          v-for="todo of visibleTodos"
          :key="todo.id"
          :todo="todo"
          @update="updateTodo"
          @remove="deleteTodo(todo.id)"
        />

        <div class="todo" key="footer">
          <!-- <label class="todo__status-label">
            <input type="checkbox" class="todo__status" />
          </label> -->

          <!-- <span class="todo__title">Todo is being saved now</span> -->
          <!-- <button class="todo__remove">x</button> -->

          <div class="modal overlay is-active">
            <div class="modal-background has-background-white-ter"></div>
            <div class="loader"></div>
          </div>
        </div>
      </TransitionGroup>

      <footer class="todoapp__footer">
        <span class="todo-count"> {{ activeTodos.length }} items left </span>

        <StatusFilter v-model="statusFilter" />

        <button class="todoapp__clear-completed" v-if="completedTodos.length">
          Clear completed
        </button>
      </footer>
    </div>

    <Message
      class="is-warning"
      :active="errorMessage !== ''"
      @hide="errorMessage = ''"
    >

      <template #default="{ x }">
        <p>{{ errorMessage }} {{ x }}</p>
      </template>

      <template #header>
        <p>Server error</p>
      </template>
    </Message>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  max-height: 60px;
  transition: all 0.15s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0);
}
</style>
