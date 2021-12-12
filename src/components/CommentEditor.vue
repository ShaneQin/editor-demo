<template>
  <div>
    <div v-html="html" class="html"></div>
    <button @click="handleClick">注释</button>
  </div>
</template>

<script>
export default {
  name: 'CommentEditor',
  data() {
    return {
      text: '为了看日出，我常常早起，那时天还没有大亮，只听见船里机器的声音。',
      comments: [],
    }
  },
  computed: {
    html() {
      let result = ''
      let pointer = 0
      for (let i = 0; i < this.comments.length; i++) {
        const cur = this.comments[i]
        if (cur.s > pointer) {
          result += this.text.substring(pointer, cur.s)
        }
        result += `<span class="highlight">${ this.text.substring(cur.s, cur.e + 1) }</span>`
        pointer = cur.e + 1
      }
      result += this.text.substring(pointer)
      return result
    }
  },
  methods: {
    handleClick() {
      const selection = document.getSelection()
      const { anchorNode, focusNode, anchorOffset, focusOffset } = selection
      let startNode = anchorNode, endNode = focusNode
      let startOffset = anchorOffset, endOffset = focusOffset
      const startPrevLength = this.getPrevLength(startNode)
      const endPrevLength = this.getPrevLength(endNode)
      let s = startPrevLength + startOffset
      let e = endPrevLength + endOffset
      if (e < s) [s, e] = [e, s]
      const comments = this.insertComment({ s, e: e - 1 }, this.comments)
      this.comments = comments
    },
    insertComment(comment, commentsList) {
      const list = [...commentsList]
      const len = list.length
      let i = 0
      let j = len - 1
      while (i <= j) {
        const mid = Math.floor((i + j) / 2)
        const cur = list[mid]
        if (cur.s <= comment.s) {
          i = mid + 1
        } else if (cur.s > comment.s) {
          j = mid - 1
        }
      }
      let deletePointer = i + 1
      const prev = list[i - 1]
      if (prev && this.isIntersect(comment, prev)) {
        list[i - 1] = comment
        deletePointer = i
      } else {
        list.splice(i, 0, comment)
      }
      // 非纯函数，直接在原数组删除数据
      this.deleteBackIntersect(list, comment, deletePointer)
      return list
    },
    deleteBackIntersect(list, comment, _pointer) {
      let pointer = _pointer
      if (list[pointer]) {
        let deleteLength = 0
        while (list[pointer] && this.isIntersect(comment, list[pointer])) {
          deleteLength++
          pointer++
        }
        list.splice(_pointer, deleteLength)
      }
    },
    getPrevLength(node) {
      const parentNode = node.parentNode
      let curNode = null
      if (parentNode.className === 'html') {
        curNode = node.previousSibling
      } else {
        curNode = parentNode.previousSibling
      }
      let prevLength = 0
      while (curNode) {
        switch (curNode.nodeType) {
          case 1:
            prevLength += curNode.textContent.length
            break;
          case 3:
            prevLength += curNode.length
            break;
        }
        curNode = curNode.previousSibling
      }
      return prevLength
    },
    isIntersect(comment1, comment2) {
      let start = [comment1.s, comment2.s]
      let end = [comment1.e, comment2.e]
      return Math.max(...start) <= Math.min(...end)
    }
  }
}
</script>

<style>
.highlight {
  background: green;
}
</style>
