<template>
  <div class="editor">
    <div>
      <div class="row">
        <div class="cell">
          <comment-editor v-model="contents" ref="commentEditor"></comment-editor>
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
    <button @click="handleComment">术语</button>
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
          text: '为了看日出，我常常早起，那是天还没有大亮，只听见船里机器的声音'
        }
      ],
      left: '123456搜索能',
      right: '为了测试搜索功能为了',
      center: '',
      search: '',
      replace: '',
    }
  },
  mounted() {
    const diff = diffChars(this.left, this.right)
    this.center = diff
  },
  methods: {
    handleComment() {
      this.$refs.commentEditor.$emit('comment')
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

</style>
