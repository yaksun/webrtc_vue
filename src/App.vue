<template>
  <div id="app">
    <!-- Janus Videos List -->
    <template v-for="(item,index) in list">
      <div v-if="!loading" :key='index'>
        <JanusVideo :janus="janus" :id='item' :baseUrl='$config.baseUrl' :realm='$config.realm'/>
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
      // list: ['1320000002', '1320000003', '1320000004', '1320000005']
      list: [],
      server: ''
    }
  },
  mounted () {
    this.initJanus()
    const { $config } = this
    console.log(this.$config)
    this.list = $config.idList
    this.server = $config.server
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
