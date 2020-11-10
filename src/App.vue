<template>
  <div id="app">
    <!-- Janus Videos List -->
    <div v-if="!loading">
      <JanusVideo :janus="janus" id='1320000002'/>
    </div>
    <div v-if='!loading'>
       <JanusVideo :janus="janus" id='1320000003'/>
    </div>
    <div v-if='!loading'>
       <JanusVideo :janus="janus" id='1320000004'/>
    </div>
      <div v-if='!loading'>
       <JanusVideo :janus="janus" id='1320000004'/>
    </div>
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
      list: [1320000002, 1320000003, 1320000004, 1320000005]
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
              success: (pluginHandle) => {
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
  height: 90vh
  display: flex
  flex-wrap: wrap
  align-items: center
  justify-content: center
</style>
