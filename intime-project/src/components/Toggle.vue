<template>
  <div>
    <b-icon icon="toggle-on" font-scale="2" v-if="state"></b-icon>
    <b-icon icon="toggle-off" font-scale="2" v-if="!state"></b-icon>
  </div>
</template>

<script>
export default {
  name: "Toggle",
  components: {},
  props: {
    state: Boolean
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
