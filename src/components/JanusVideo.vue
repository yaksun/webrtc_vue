<template>
  <!-- Janus Video -->
  <div class='item'>
    <button @click="stopStream">关闭</button>
    <video
      :key='id'
      :id='id'
      controls
      class="video-js vjs-default-skin vjs-big-play-centered"
      playsinline
      preload="auto"
      autoplay
      muted
    ></video>
  </div>
</template>

<script>
import Janus from '../janus'

export default {
  name: 'JanusVideo',
  props: {
    id: {
      type: String,
      required: true
    },
    janus: {
      type: Object
    }
  },
  data () {
    return {
      streaming: [],
      tempfoundStream: { }
    }
  },
  mounted () {
    this.initJanus()
  },
  methods: {
    // Init Janus
    initJanus () {
      const vm = this
      vm.janus.attach(
        {
          opaqueId: 'test-' + vm.id,

          plugin: 'janus.plugin.streaming',
          success: function (pluginHandle) {
            console.log(`iteration ${vm.id} janus attach - onSuccess called, plugin handle::`, pluginHandle)
            console.log('pluginHandle=', pluginHandle)
            vm.tempfoundStream = pluginHandle
            vm.streaming.push({ id: vm.id, plugin: pluginHandle })
            let body = { 'request': 'watch', id: parseInt(vm.id) }
            console.log(`iteration ${vm.id} sending watch request::`)
            pluginHandle.send({
              message: {
                type: 'rtsp',
                id: vm.id * 1,
                description: vm.id,
                audio: false,
                video: true,
                url: `rtsp://172.16.14.84:554/deviceid=4201550086${vm.id}channelid=4201550086${vm.id}realm=4201550086`,
                rtsp_user: 'admin',
                rtsp_pwd: 'admin12345',
                request: 'create',
                admin_key: '123456',
                name: 'xx',
                is_private: false,
                data: true
              },
              success: function () {
                pluginHandle.send({ 'message': body })
              }
            })
          },
          error: function (error) { console.log(error) },
          onmessage: function (msg, jsep) {
            console.log(`iteration ${vm.id} new message received! msg::`, msg)
            console.log(`iteration ${vm.id} the accompanying jsep was::`, jsep)

            if (jsep !== undefined && jsep !== null) {
              console.log(`iteration ${vm.id} jsep was not null or undefined THIS IS GOOD`)

              const foundStream = vm.streaming.find(s => s.id === vm.id)
              if (jsep.type === 'offer') {
                console.log(`iteration ${vm.id} the jsep type was an offer, lets make an answer`)
                foundStream.plugin.createAnswer(
                  {
                    jsep,
                    media: { audioSend: false, videoSend: false },
                    success: function (jsep) {
                      console.log(`iteration ${vm.id} sending a message to request the stream starts`)
                      const body = { 'request': 'start' }

                      foundStream.plugin.send({ 'message': body, 'jsep': jsep })
                    },
                    error: function (error) {
                      Janus.error('WebRTC error:', error)
                    }
                  }
                )
              }
            }
          },
          onremotestream: function (stream) {
            console.log(`iteration ${vm.id} on remote stream being called`)
            const element = document.getElementById(vm.id)
            Janus.attachMediaStream(element, stream)
          }
        })
    },
    stopStream () {
      let body = { request: 'stop' }
      let body2 = {
        request: 'destroy',
        id: this.id * 1
      }
      this.tempfoundStream.send({ message: body })
      this.tempfoundStream.send({ message: body2 })
      this.tempfoundStream.hangup()
    }

  }
}
</script>

<style scoped lang='sass'>
.item
   height: 100%
   width:100%
   .janus-video
    height: 100%
    width:100%
</style>
