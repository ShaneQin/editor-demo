<template>
  <div class="editor">
    <div>
      <div class="row">
        <div class="cell">
          <span v-for="(item, index) in contents" :data-index="index" :class="item.comment ? 'underline' : ''">{{
              item.text
            }}</span>
        </div>
        <div class="cell">
          <span v-for="item in center" :class="item.removed ? 'rmv' : ''">{{ item.value }}</span>
        </div>
        <div class="cell" contenteditable="true">{{ right }}</div>
      </div>
    </div>
    <button @click="handleClick">术语</button>
  </div>

</template>

<script>
import { diffChars } from 'diff'

export default {
  data() {
    return {
      contents: [
        {
          text: '为了看日出，我常常早起'
        }
      ],
      left: '123456',
      right: '456222',
      center: ''
    }
  },
  mounted() {
    const diff = diffChars(this.left, this.right)
    this.center = diff
  },
  methods: {
    handleClick() {
      const { anchorOffset, focusOffset, anchorNode, focusNode } = document.getSelection()
      let start = Number(anchorNode.parentNode.dataset.index)
      let end = Number(focusNode.parentNode.dataset.index)
      if (end < start) [start, end] = [end, start]
      if (anchorNode === focusNode) {
        this.appendContent(start, anchorOffset, focusOffset)
      } else {
        let text = ''
        let totalFocusOffset = focusOffset
        for (let i = start; i <= end; i++) {
          text += this.contents[i].text
          console.log(text)
          if (i === end - 1) {
            totalFocusOffset += text.length
          }
        }
        const contents = [...this.contents]
        contents.splice(start, end - start + 1, {
          text
        })
        this.contents = contents
        this.appendContent(start, anchorOffset, totalFocusOffset)
      }
      this.$nextTick(() => {
        const contents = []
        let text = ''
        for (let i = 0; i < this.contents.length; i++) {
          if (this.contents[i].comment && text) {
            contents.push({
              text
            }, this.contents[i])
            text = ''
          } else {
            text += this.contents[i].text
          }
        }
        if (text) {
          contents.push({
            text
          })
        }
        this.contents = contents
      })
    },
    appendContent(start, anchorOffset, focusOffset) {
      const currentText = this.contents[start].text
      const left = currentText.substring(0, anchorOffset)
      const center = currentText.substring(anchorOffset, focusOffset)
      const right = currentText.substring(focusOffset)
      const contents = [...this.contents]
      contents.splice(
        start,
        1,
        this.createContentObj(left),
        this.createContentObj(center, '牛逼'),
        this.createContentObj(right)
      )
      this.contents = contents
    },
    createContentObj(text, comment) {
      return { text, comment }
    }
  }
}

</script>

<style scoped>
.row {
  display: flex;
}

.cell {
  width: 200px;
  height: 100px;
  border: 1px solid #ddd;
}

.add {
  color: green;
}

.rmv {
  color: red;
}

.underline {
  text-decoration: underline;
}

</style>
