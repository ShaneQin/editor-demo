<template>

  <div class="editor">
    <div>
      <div class="row">
        <div class="cell">
          <comment-editor></comment-editor>
        </div>
        <div class="cell">
          <template v-for="(item, index) in contents">
            <span v-if="item.comment" class="highlight" :data-index="index"
                  @mouseenter="handleMouseEnter($event, item.comment)">{{ item.text }}</span>
            <span v-else :data-index="index">{{ item.text }}</span>
          </template>
          <div class="tips" ref="tips">{{ currentContent }}</div>
        </div>
        <div class="cell">
          <div>{{ left }}</div>
          <span v-for="item in center" :class="`${item.removed ? 'rmv' : ''}${item.added ? 'add' : ''}`">{{
              item.value
            }}</span>
        </div>
        <highlight-editor class="cell" :value="right" :search-value="search"></highlight-editor>
      </div>
    </div>
    <button @click="handleClick">术语</button>
    <input type="text" v-model="search">
    <input type="text" v-model="replace">
    <button @click="handleReplace">替换</button>
    <button @click="handleReplaceAll">全部替换</button>
  </div>

</template>

<script>
import { diffChars } from 'diff'
import { Grammarly, GrammarlyEditorPlugin } from '@grammarly/editor-sdk-vue'
import HighlightEditor from './HighlightEditor'
import CommentEditor from './CommentEditor'

export default {
  components: { Grammarly, GrammarlyEditorPlugin, HighlightEditor, CommentEditor },
  data() {
    return {
      contents: [
        {
          text: '为了看日出，我常常早起，那是天还没有大亮，只听见船里机器的声音',
          comment: ''
        }
      ],
      left: '123456搜索能',
      right: '为了测试搜索功能为了',
      center: '',
      search: '',
      replace: '',
      currentContent: ''
    }
  },
  mounted() {
    const diff = diffChars(this.left, this.right)
    console.log(diff)
    this.center = diff
  },
  methods: {
    handleClick() {
      if (document.getSelection) {
        const selection = document.getSelection()
        const { anchorNode, focusNode, anchorOffset, focusOffset } = selection
        let startNode = anchorNode, endNode = focusNode
        let startOffset = anchorOffset, endOffset = focusOffset
        let startParentNode = startNode.parentNode, endParentNode = endNode.parentNode
        let startIndex = Number(startParentNode.dataset.index), endIndex = Number(endParentNode.dataset.index)
        if (startNode === endNode && endOffset < startOffset) {
          [startOffset, endOffset] = [endOffset, startOffset];
        }
        if (endIndex < startIndex) {
          [startIndex, endIndex] = [endIndex, startIndex];
          [startOffset, endOffset] = [endOffset, startOffset];
          [startNode, endNode] = [endNode, startNode];
        }
        let text = ''
        let totalFocusOffset = endOffset
        for (let i = startIndex; i <= endIndex; i++) {
          text += this.contents[i].text
          if (i === endIndex - 1) {
            totalFocusOffset += text.length
          }
        }
        const contents = [...this.contents]
        contents.splice(startIndex, endIndex - startIndex + 1, { text })
        this.contents = contents
        this.appendContent(startIndex, startOffset, totalFocusOffset)
        selection.removeAllRanges()
        this.$nextTick(() => {
          const contents = []
          let text = ''
          for (let i = 0; i < this.contents.length; i++) {
            if (this.contents[i].comment) {
              if (text) {
                contents.push({ text })
                text = ''
              }
              contents.push(this.contents[i])
            } else {
              text += this.contents[i].text
            }
          }
          if (text) {
            contents.push({ text })
          }
          this.contents = contents
        })
      } else {
        console.log('不支持注释功能')
      }

    },
    appendContent(start, startOffset, endOffset) {
      const currentText = this.contents[start].text
      const left = currentText.substring(0, startOffset)
      const center = currentText.substring(startOffset, endOffset)
      const right = currentText.substring(endOffset)
      const contents = [...this.contents]
      contents.splice(
        start,
        1,
        this.createContentObj(left),
        this.createContentObj(center, '注释'),
        this.createContentObj(right)
      )
      this.contents = contents
    },
    createContentObj(text, comment) {
      return { text, comment }
    },
    handleMouseEnter(e, content) {
      console.log(content)
      // const { clientX, clientY } = e
      // console.log(this.$refs.tips.style)
      // this.$refs.tips.style.left = clientX + 'px'
      // this.$refs.tips.style.top = clientY + 'px'
      // this.currentContent = content
    },
    handleReplace() {
      this.right = this.right.replace(this.search, this.replace)
    },
    handleReplaceAll() {
      this.right = this.right.replace(new RegExp(this.search, 'g'), this.replace)
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

.highlight {
  background-color: green;
}

.right {
  position: relative;
  z-index: -1;
  left: -202px;
}

.tips {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 5;
  background: red;
}

</style>
