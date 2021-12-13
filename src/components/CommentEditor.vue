<template>
  <div v-contextmenu:contextmenu>
    <div v-html="html" class="html" @mouseup="handleMouseSelect"></div>
    <button @click="handleClick">注释</button>
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="handleClick">添加注释</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
export default {
  name: 'CommentEditor',
  data() {
    return {
      text: '为了看日出，我常常早起，那时天还没有大亮，只听见船里机器的声音。天空还是一片浅蓝，很浅很浅的。转眼间,天水相接的地方出现了一道红霞。',
      comments: [],
      selection: null
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
        result += `<span class="highlight">${this.text.substring(cur.s, cur.e + 1)}</span>`
        pointer = cur.e + 1
      }
      result += this.text.substring(pointer)
      return result
    }
  },
  methods: {
    handleMouseSelect() {
      const { anchorNode, focusNode, anchorOffset, focusOffset } = document.getSelection()
      if (anchorOffset === focusOffset) {
        this.selection = null
      } else {
        this.selection = {
          anchorNode, focusNode, anchorOffset, focusOffset
        }
      }
    },
    handleClick() {
      if (!this.selection) return
      const { anchorNode, focusNode, anchorOffset, focusOffset } = this.selection
      let startNode = anchorNode, endNode = focusNode
      let startOffset = anchorOffset, endOffset = focusOffset
      const startPrevLength = this.getPrevLength(startNode)
      const endPrevLength = this.getPrevLength(endNode)
      let s = startPrevLength + startOffset
      let e = endPrevLength + endOffset
      // 从后往前选择的情况
      if (e < s) [s, e] = [e, s]
      const comments = this.insertComment({ s, e: e - 1 }, this.comments)
      console.log(comments)
      this.comments = comments
      this.selection = null
    },
    insertComment(comment, commentsList) {
      // 二分法求当前插入位置
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
      // 如果前一个注释和要插入的注释有交集，则直接修改前一个注释
      if (prev && this.isIntersect(comment, prev)) {
        list[i - 1] = comment
        deletePointer = i
      } else {
        // 否则直接插入注释
        list.splice(i, 0, comment)
      }
      // 非纯函数，直接在原数组删除数据
      this.deleteBackIntersect(list, comment, deletePointer)
      return list
    },
    deleteBackIntersect(list, comment, _pointer) {
      // 删除插入注释之后的与插入注释有交集的注释
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
      // 求两个注释是否有交集
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
