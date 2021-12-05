<template>
  <div class="edit-div"
       v-html="innerText"
       :contenteditable="canEdit"
       @focus="isLocked = true"
       @blur="isLocked = false"
       @input="changeText">
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      innerText: this.value,
      isLocked: false
    }
  },
  watch: {
    'value'() {
      if (!this.isLocked || !this.innerText) {
        this.innerText = this.value;
      }
    }
  },
  methods: {
    changeText() {
      this.$emit('input', this.$el.innerHTML);
    }
  }
}
</script>
<style scoped>
.edit-div {
  overflow: auto;
  word-break: break-all;
  user-select: text;
  white-space: pre-wrap;
  text-align: left;
}

.edit-div[contenteditable=true] {
  user-modify: read-write-plaintext-only;
}

.edit-div:empty:before {
  content: attr(placeholder);
  display: block;
  color: #ccc;
}
</style>
