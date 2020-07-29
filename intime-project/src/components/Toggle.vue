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


<style scoped>
</style>
