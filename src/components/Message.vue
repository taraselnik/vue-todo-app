<script>

export default {
  name: "item-error-loading",
  emits: ['hide'],
  props: {
    active: Boolean,
  },
  methods: {
    closeWarning() {
      this.$emit('hide')
    }
  }

}
</script>

<template>
  <article class="message"
  :class="{ 'message--hidden': !active }">
    <div class="message-header">
      <slot name="header"></slot>

      <button class="delete" @click="closeWarning"></button>
    </div>

    <div class="message-body">
      <slot :x="24">Oooops....</slot>
    </div>
  </article>
</template>
