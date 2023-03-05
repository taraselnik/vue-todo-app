<script>
import todos from './data/todos'
export default {
  data() {
    return {
      todos
    }
  },
  mounted() {
    console.log(this.todos)
  },
  computed: {
    countActiveTodos() {
      return this.todos.filter(todo => !todo.completed).length
    },
    countCompletedTodos() {
      return this.todos.filter(todo => todo.completed).length
    }
  }
}
</script>

<template>
  <div class="todoapp">
    <h1 class="todoapp__title">{todos}</h1>

    <div class="todoapp__content">
      <header class="todoapp__header">
        <button class="todoapp__toggle-all"
        :class="{active: countActiveTodos}"
        ></button>

        <form>
          <input type="text" class="todoapp__new-todo" placeholder="What needs to be done?" />
        </form>
      </header>

      <section class="todoapp__main">
        <div v-for="todo, index of todos"
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
        </div>

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
      </section>

      <footer class="todoapp__footer">
        <span class="todo-count"> {{countActiveTodos}} items left </span>

        <nav class="filter">
          <a href="#/" class="filter__link selected"> All </a>

          <a href="#/active" class="filter__link"> Active </a>

          <a href="#/completed" class="filter__link"> Completed </a>
        </nav>

        <button class="todoapp__clear-completed" v-if="countCompletedTodos > 0">Clear completed</button>
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
