<template>
  <div class="container">
    <div class="content" :style="`height: ${contentHeight}px`"></div>
    <vue-draggable-resizable
      :w="initWidth"
      :h="200"
      @resizing="onResize"
      :draggable="false"
      class-name-handle="my-handle"
      :handles="['tm']"
    >
      <p>Hello! I'm a flexible component. You can drag me around and you can resize me.<br>
        X: {{ x }} / Y: {{ y }} - Width: {{ width }} / Height: {{ height }}</p>
    </vue-draggable-resizable>
  </div>
</template>

<script>
export default {
  name: 'ResizableDiv',
  data: function () {
    return {
      width: 0,
      initWidth: 1,
      height: 0,
      x: 0,
      y: 0,
    }
  },
  methods: {
    onResize(x, y, width, height) {
      this.y = y
    }
  },
  computed: {
    contentHeight() {
      return 300 + this.y
    }
  },
  mounted() {
    this.initWidth = this.$el.clientWidth
  }
}
</script>

<style scoped>
.content {
  background: green;
}

.container {
  height: 500px;
  border: 1px solid red;
  position: relative;
}

</style>

<style>
.my-handle-tm {
  height: 1px;
  cursor: row-resize;
  position: absolute;
  width: 100%;
}

.resizable {
  top: 300px;
}
</style>
