<template>
  <div>
    <div class="container">
      <editable-div v-model="content" ref="content"></editable-div>
      <div class="range-group">
        <span
          v-for="item in highlightList"
          class="range"
          :style="`width: ${item.width}px; height: ${item.height}px; top: ${item.top}px; left: ${item.left}px;`"
        ></span>
      </div>
    </div>
    <input type="text" v-model="search">
    <button @click="handleSearch">查找</button>
    <input type="text" v-model="replace">
    <button @click="handleReplace">替换</button>
  </div>
</template>

<script>
import EditableDiv from './EditableDiv'

export default {
  name: 'ReplaceEditor',
  components: { EditableDiv },
  data() {
    return {
      content: '为了看日出，我常常早起，那时天还没有大亮，只听见船里机器的声音，为了',
      search: '',
      replace: '',
      highlightList: []
    }
  },
  watch: {
    content() {
      if (this.highlightList.length) {
        this.handleSearch()
      }
    }
  },
  methods: {
    handleContentChange(e) {
      this.content = e.target.innerText
    },
    handleSearch() {
      const len = this.search.length
      const regExp = new RegExp(this.search, 'g')
      const textNode = this.$refs.content.$el.firstChild
      let result = null
      const highlightList = []

      const standardRange = document.createRange()
      standardRange.setStart(textNode, 0)
      standardRange.setEnd(textNode, 0)
      const standardRangeReact = standardRange.getBoundingClientRect()
      const lineHeight = standardRangeReact.height

      while (result = regExp.exec(this.content)) {
        const range = document.createRange()
        range.setStart(textNode, result.index)
        range.setEnd(textNode, result.index + len)
        const rangeReact = range.getBoundingClientRect()
        if (rangeReact.height === lineHeight) {
          highlightList.push(rangeReact)
        } else {
          let i = 0
          let j = 1
          while (j <= len) {
            const subRange = document.createRange()
            subRange.setStart(textNode, result.index + i)
            subRange.setEnd(textNode, result.index + j)
            const subRangeReact = subRange.getBoundingClientRect()
            if (subRangeReact.height === lineHeight) {
              highlightList.pop()
              j++
            } else {
              i = j - 1
            }
            highlightList.push(subRangeReact)
          }
        }
      }
      this.highlightList = highlightList
    },
    handleReplace() {

    }
  }
}
</script>

<style scoped>
.container {
  position: relative;
}

.content {
  outline: none;
}

.range-group {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: -1;
}

.range {
  position: fixed;
  background: orangered;
}
</style>
