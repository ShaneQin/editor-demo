<template>
  <div class="editor">
    <div>
      <div class="row">
        <div class="cell">
          <template v-for="(item, index) in contents">
            <span v-if="item.comment" class="highlight" :data-index="index"
                  @mouseenter="handleMouseEnter(item.comment)">{{ item.text }}</span>
            <span v-else :data-index="index">{{ item.text }}</span>
          </template>
        </div>
        <div class="cell">
          <span v-for="item in center" :class="item.removed ? 'rmv' : ''">{{ item.value }}</span>
        </div>
        <div contenteditable="true" v-html="right" class="cell" @input="handleInput" ref="div"></div>
<!--        <editable-div v-model="right" class="cell"></editable-div>-->
      </div>
    </div>
    <button @click="handleClick">术语</button>
    <input type="text" v-model="search">
  </div>

</template>

<script>
import { diffChars } from 'diff'
import { Grammarly, GrammarlyEditorPlugin } from '@grammarly/editor-sdk-vue'
import EditableDiv from './EditableDiv'

export default {
  components: { Grammarly, GrammarlyEditorPlugin, EditableDiv },
  data() {
    return {
      contents: [
        {
          text: '为了看日出，我常常早起，那是天还没有大亮，只听见船里机器的声音'
        }
      ],
      left: '123456',
      right: '为了测试搜索功能',
      center: '',
      search: ''
    }
  },
  mounted() {
    const diff = diffChars(this.left, this.right)
    this.center = diff
  },
  watch: {
    search(val) {
      this.handleSearch(val, this.right)
    },
    right(val) {
      this.handleSearch(this.search, val)
    }
  },
  methods: {
    handleSearch(search, content) {
      let temp = content
      temp = temp.replace(/<.*?>/ig, '');
      const regExp = new RegExp(search, 'g')
      if (!search || !regExp.test(temp)) {
        this.right = temp
        return
      }
      const values = temp.split(regExp);
      this.right = values.join('<span style="background:red;">' + search + '</span>')
    },
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
        this.createContentObj(center, '牛逼'),
        this.createContentObj(right)
      )
      this.contents = contents
    },
    createContentObj(text, comment) {
      return { text, comment }
    },
    handleMouseEnter(content) {
      console.log(content)
    },
    handleInput(e) {
      this.right = e.target.innerHTML
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

</style>
