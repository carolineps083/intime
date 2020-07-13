<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->

    <page />

    <HelloWorld msg="Kitchen Sink"/>
  </div>
</template>

<script>
import Page from './components/Page.vue';
// import Toggle from './components/Toggle.vue';
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    Page,
    // Toggle,
    // HelloWorld
  }
}
</script>

<style>
#app {
 
}
</style>
