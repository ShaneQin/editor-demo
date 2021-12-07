<template>
  <div>
    <template v-for="(item, index) in value">
    <span
      v-if="item.comment"
      class="highlight"
      :data-index="index"
      @mouseenter="handleMouseEnter(item.comment)"
    >{{ item.text }}</span>
      <span v-else :data-index="index">{{ item.text }}</span>
    </template>
    <div>{{ 123 }}</div>
  </div>
</template>

<script>
export default {
  name: 'CommentEditor',
  props: {
    value: {
      type: Array,
      default: ''
    }
  },
  data() {
    return {
      currentComment: ''
    }
  },
  methods: {
    addComment() {
      if (document.getSelection) {
        const selection = document.getSelection()
        const { anchorNode, focusNode, anchorOffset, focusOffset } = selection
        let startNode = anchorNode, endNode = focusNode
        let startOffset = anchorOffset, endOffset = focusOffset
        let startParentNode = startNode.parentNode, endParentNode = endNode.parentNode
        let startIndex = Number(startParentNode.dataset.index), endIndex = Number(endParentNode.dataset.index)
        /**/
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
          text += this.value[i].text
          if (i === endIndex - 1) {
            totalFocusOffset += text.length
          }
        }
        const contents = [...this.value]
        contents.splice(startIndex, endIndex - startIndex + 1, { text })
        this.$emit('change', contents)
        this.appendContent(startIndex, startOffset, totalFocusOffset)
        selection.removeAllRanges()
        this.$nextTick(() => {
          const contents = []
          let text = ''
          for (let i = 0; i < this.value.length; i++) {
            if (this.value[i].comment) {
              if (text) {
                contents.push({ text })
                text = ''
              }
              contents.push(this.value[i])
            } else {
              text += this.value[i].text
            }
          }
          if (text) {
            contents.push({ text })
          }
          this.$emit('change', contents)
        })
      } else {
        console.log('不支持注释功能')
      }

    },
    appendContent(start, startOffset, endOffset) {
      const currentText = this.value[start].text
      const left = currentText.substring(0, startOffset)
      const center = currentText.substring(startOffset, endOffset)
      const right = currentText.substring(endOffset)
      const contents = [...this.value]
      contents.splice(
        start,
        1,
        this.createContentObj(left),
        this.createContentObj(center, '牛逼'),
        this.createContentObj(right)
      )
      return contents
    },
    createContentObj(text, comment) {
      return { text, comment }
    },
    handleMouseEnter(content) {
      console.log(content)
    }
  },
  mounted() {
    this.$on('comment', function() {
      this.addComment()
    });
  }
}
</script>

<style scoped>

</style>
