<script>
import todosIn from './data/todos'
import StatusFilter from './components/StatusFilter.vue'
import TodoItem from './components/TodoItem.vue'

export default {
  components: {
    StatusFilter,
    TodoItem
  },
  data() {
    let todos = []
    const jsonData = localStorage.getItem('todos')
    try {
      let temp = JSON.parse(jsonData)
      if (temp) {
        todos = temp
      } else {
        todos = todosIn
      }
    } catch (e) {
      ;[]
    }

    return {
      todos,
      newTodo: '',
      statusFilter: 'all'
    }
  },
  mounted() {
    console.log(this.todos)
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
  watch: {
    todos: {
      deep: true,
      handler() {
        console.log(this.todos.length)
        localStorage.setItem('todos', JSON.stringify(this.todos))
      }
    }
  },
  methods: {
    handleSubmit() {
      this.todos.push({
        id: Date.now(),
        title: this.newTodo,
        completed: false
      })
      this.newTodo = ''
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
            v-model="newTodo"
          />
        </form>
      </header>

      <TransitionGroup name="list" tag="section" class="todoapp__main">
        <TodoItem
          v-for="(todo) of visibleTodos"
          :key="todo.id"
          :todo="todo"
          @update="Object.assign(todo, $event)"
          @remove="todos.splice(todos.indexOf(todo), 1)"
        />
        <!-- <div
          v-for="todo, index of todos"
          :key="todo.id"
          class="todo"
          :class="{completed: todo.completed}"
        >
          <label class="todo__status-label">
            <input
              type="checkbox"
              class="todo__status"
              v-model="todo.completed"
            />
          </label>

          <form v-if="undefined">
            <input
              type="text"
              class="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>

          <template v-else>
            <span class="todo__title">{{ todo.title }} {{ index }}</span>
            <button class="todo__remove" v-on:click="todos.splice(index, 1)">x</button>
          </template>

          <div class="modal overlay" :class="{'is-active' : false}">
            <div class="modal-background has-background-white-ter"></div>
            <div class="loader"></div>
          </div>
        </div> -->

        <div class="todo">
          <label class="todo__status-label">
            <input type="checkbox" class="todo__status" />
          </label>

          <span class="todo__title">Todo is being saved now</span>
          <button class="todo__remove">x</button>

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

    <article class="message is-danger message--hidden">
      <div class="message-header">
        <p>Error</p>
        <button class="delete"></button>
      </div>

      <div class="message-body">Unable to add a Todo</div>
    </article>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  max-height: 60px;
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {

  opacity: 0;
  max-height: 0;
  transform: scaleY(0);
}
</style>
