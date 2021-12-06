<template>
  <div class="container">
    <div
      class="editor text-editor"
      contenteditable="true"
      v-html="value"
      @input="handleInput"
    >
    </div>
    <div contenteditable="true" class="editor html-editor" v-html="htmlValue"></div>
  </div>
</template>

<script>
export default {
  name: 'HighlightEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    searchValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      textValue: this.value
    }
  },
  computed: {
    htmlValue() {
      const regExp = new RegExp(this.searchValue, 'g')
      if (!this.searchValue || !regExp.test(this.textValue)) {
        return this.textValue
      }
      const values = this.textValue.split(regExp);
      return values.join('<span style="background:red;">' + this.searchValue + '</span>')
    }
  },
  watch: {
    value(val) {
      this.textValue = val
    }
  },
  methods: {
    handleInput(e) {
      this.textValue = e.target.innerHTML
      this.$emit('contentchange', this.textValue)
    }
  }
}
</script>

<style scoped>
.container {
  position: relative;
}

.editor {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  outline: none;
  -webkit-user-modify: read-write;
  overflow-wrap: break-word;
  -webkit-line-break: after-white-space;
}

.html-editor {
  z-index: -1
}

.text-editor {

}
</style>
