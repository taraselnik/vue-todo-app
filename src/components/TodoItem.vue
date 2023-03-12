<script>
export default {
  name: 'TodoItem',
  props: {
    todo: {
      type: Object
    }
  },
  emits: ['update', 'remove'],
  data() {
    return {
      editing: false,
      newTitle: this.todo.title,
      itemStatus: false
    }
  },
  methods: {
    toggle() {
      this.$emit('update', {
        ...this.todo,
        completed: !this.todo.completed
      })
    },

    rename() {
      if (this.newTitle.length === 0) {
        this.deleteTodo()
        return
      }

      this.$emit('update', {
        ...this.todo,
        title: this.newTitle
      })

      this.editing = false
    },

    deleteTodo() {
      this.$emit('remove')
    },

    edit() {
      this.newTitle = this.todo.title
      this.editing = !this.editing

      this.$nextTick(() => {
        this.$refs['title-field'].focus()
      })
    },

    escapeFocused() {
      this.editing = false
    }

  }
}
</script>

<template>
  <div class="todo" :class="{ completed: todo.completed }">
    <label class="todo__status-label">
      <input type="checkbox" class="todo__status" :checked="todo.completed" @change="toggle" />
    </label>

    <form v-if="editing" @submit.prevent="rename">
      <input
        type="text"
        class="todo__title-field"
        placeholder="Empty todo will be deleted"
        v-model.trim="newTitle"
        ref="title-field"
        @keyup.esc="escapeFocused"
        @blur="escapeFocused"
      />
      <button class="todo__remove" @mousedown="rename">save</button>
    </form>

    <template v-else>
      <span class="todo__title" @click="edit"> {{ todo.title }}</span>
      <button class="todo__remove" @click="deleteTodo">x</button>
    </template>
  </div>
</template>

<style></style>
