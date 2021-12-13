<template>

</template>

<script>
import Worker from '../worker/indexdb.worker'

export default {
  name: 'IndexdbWorker',
  mounted() {
    const worker = new Worker()
    worker.postMessage('1')
    console.log(worker)
    worker.onmessage = function (e) {
      console.log(e.data)
    }
  }
}
</script>

<style scoped>

</style>
