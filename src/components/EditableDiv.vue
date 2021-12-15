<template>
  <div
    class="div-editable"
    contenteditable="true"
    v-html="innerText"
    @input="changeText"
    @focus="isChange = false"
    @blur="blurFunc"></div>
</template>

<script>
export default {
  name: 'EditableDiv',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      innerText: this.value,
      isChange: true
    }
  },
  watch: {
    value() {
      if (this.isChange) {
        this.innerText = this.value
      }
    }
  },
  methods: {
    changeText() {
      this.$emit('input', this.$el.innerHTML)
    },
    blurFunc() {
      this.isChange = true
      this.$emit('blurFunc')
    }
  }
}
</script>

<style scoped>
.div-editable {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  word-break: break-all;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  text-align: left;
}

.div-editable[contenteditable=true] {
  user-modify: read-write-plaintext-only;
}

.div-editable:empty:before {
  content: attr(placeholder);
  display: block;
  color: #ccc;
}
</style>
