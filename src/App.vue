<template>
  <div id="app">
    <!-- Janus Videos List -->
    <template v-for="(item,index) in list">
      <div v-if="!loading" :key='index'>
        <JanusVideo :janus="janus" :id='item'/>
      </div>
    </template>
  </div>
</template>

<script>
import Janus from './janus'

export default {
  components: {
    JanusVideo: () => import('@/components/JanusVideo')
  },
  data () {
    return {
      janus: null,
      loading: false,
      list: ['1320000002']
    }
  },
  mounted () {
    this.initJanus()
  },
  beforeDestroy () {
    this.janus.destroy()
  },
  methods: {
    initJanus () {
      this.loading = true
      let server = 'ws://172.16.4.8:8188'
      console.log('calling Janus init')
      Janus.init({
        callback: () => {
          this.janus = new Janus(
            {
              server,
              success: () => {
                this.loading = false
              },
              error: (cause) => {
                console.log(cause)
              },
              destroyed: () => {
                console.log('janus init destroyed')
              }
            })
        }
      })
    }
  }
}
</script>

<style lang="sass">
#app
  height: 100%
  width: 100%
  overflow: 'hidden'
  display: grid
  grid-template-columns: repeat(3, 33.33%)
  grid-template-rows: repeat(3, 33.33%)
</style>
