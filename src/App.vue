<script>
import { getTodos, createTodos, updateTodo, deleteTodo } from './api/todos.ts'
import StatusFilter from './components/StatusFilter.vue'
import TodoItem from './components/TodoItem.vue'
import Message from './components/Message.vue'

export default {
  components: {
    StatusFilter,
    TodoItem,
    Message
  },
  data() {
    return {
      todos: [],
      titleNewTodo: '',
      statusFilter: 'all',
      errorMessage: '',
      todosBeforeToggle: [],
      isLoaded: false,
      idLoadedComponent: null,
      isAllLoading:false
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
        this.isLoaded = true
      })
      .catch(() => {
        this.errorMessage = 'Unable to load todo list'
      })
  },

  methods: {
    handleSubmit() {
      if (this.titleNewTodo.length === 0) {
        return
      }
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

    async updateTodo({ id, title, completed }, state = false) {
      this.idLoadedComponent = id;
      this.isAllLoading = state;
      console.log('IN', this.idLoadedComponent)
      await updateTodo({ id, title, completed }).then((res) => {
        this.todos = this.todos.map((todo) => (todo.id === id ? res.data : todo))
        this.idLoadedComponent = null;
        this.isAllLoading = false;
        console.log('OUT', this.idLoadedComponent)
      })
    },

    deleteTodo(id) {
      deleteTodo(id).then(() => (this.todos = this.todos.filter((todo) => todo.id !== id)))
    },

    deleteAllCompleted() {
      this.todos.forEach((todo) => {
        if (todo.completed) {
          this.deleteTodo(todo.id)
        }
      })
    },

    allToggle() {
      if (this.todos.length > 0 && this.todos[0].completed !== undefined) {
        const isEveryLikeFirst = this.todos.every(
          (todo) => todo.completed === this.todos[0].completed
        )
        if (isEveryLikeFirst) {
          this.todos = this.todos.map((todo) => {
            return { ...todo, completed: !todo.completed }
          })
        } else {
          this.todos = this.todos.map((todo) => {
            return { ...todo, completed: true }
          })
        }
      }
      console.log(this.todos)
      this.todos.forEach(async (todo) => {
        await this.updateTodo(todo, true)
      })
    }
  }
}
</script>

<template>
  <div class="todoapp">
    <h1 class="todoapp__title">{todos}</h1>

    <div class="todoapp__content">
      <header class="todoapp__header">
        <button
          class="todoapp__toggle-all"
          :class="{ active: activeTodos.length > 0 }"
          @click="allToggle"
        ></button>

        <form @submit.prevent="handleSubmit">
          <input
            type="text"
            class="todoapp__new-todo"
            placeholder="What needs to be done?"
            v-model.trim="titleNewTodo"
          />
          <button v-if="titleNewTodo" class="todo__remove save" @mousedown="handleSubmit">save</button>
        </form>
      </header>

      <TransitionGroup name="list" tag="section" class="todoapp__main" v-if = "isLoaded">
        <TodoItem
          v-for="todo of visibleTodos"
          :key="todo.id"
          :todo="todo"
          :idLoadedComponent="idLoadedComponent"
          :isAllLoading="isAllLoading"
          @update="updateTodo"
          @remove="deleteTodo(todo.id)"
        />
      </TransitionGroup>

      <section class="todoapp__main" v-else>
        <div class="todo">
          <label class="todo__status-label">
            <input type="checkbox" class="todo__status" />
          </label>

          <span class="todo__title">loading...</span>
          <button class="todo__remove">x</button>

          <div class="modal overlay is-active">
            <div class="modal-background has-background-white-ter"></div>
            <div class="loader"></div>
          </div>
        </div>
      </section>

      <footer class="todoapp__footer">
        <span class="todo-count"> {{ activeTodos.length }} items left </span>

        <StatusFilter v-model="statusFilter" />

        <button
          class="todoapp__clear-completed"
          v-if="completedTodos.length"
          @click="deleteAllCompleted"
        >
          Clear completed
        </button>
      </footer>
    </div>

    <Message class="is-warning" :active="errorMessage !== ''" @hide="errorMessage = ''">
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
