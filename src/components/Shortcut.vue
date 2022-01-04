<template>
  <div>
    <input type="text" :value="modifier" @keydown="handleModifierKeydown">
    <input type="text" :value="main" @keydown="handleMainKeydown" ref="main">
  </div>
</template>

<script>
import hotkeys from 'hotkeys-js'

export default {
  name: 'Shortcut',
  data() {
    return {
      modifier: '',
      main: ''
    }
  },
  computed: {
    key() {
      return `${ this.modifier }+${ this.main }`
    }

  },
  methods: {
    handleModifierKeydown(e) {
      let { key } = e
      if (key === 'Meta') key = 'Command'
      if (e.keyCode === 8) {
        this.modifier = ''
      } else {
        e.preventDefault()
        this.modifier = key
        this.$refs.main.focus()
      }
    },
    handleMainKeydown(e) {
      const { key } = e
      if (e.keyCode === 8) {
        this.main = ''
      } else {
        e.preventDefault()
        this.main = key
      }
    }
  }
}
</script>

<style scoped>

</style>
