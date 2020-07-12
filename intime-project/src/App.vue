<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    
    <page />

    <!-- <HelloWorld msg="Kitchen Sink"/> -->
  </div>
</template>

<script>
import Page from './components/Page.vue'
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    Page,
    // HelloWorld
  }
}
</script>

<style>
#app {
 
}
</style>
