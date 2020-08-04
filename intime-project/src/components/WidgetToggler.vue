<template>
  <a href="#">
    <div class="h2 mb-0" v-if="isRight">
      <b-icon icon="chevron-double-right"></b-icon>
    </div>
    <div class="h2 mb-0" v-if="!isRight">
      <b-icon icon="chevron-double-left"></b-icon>
    </div>
   </a>
</template>

<script>
export default {
  name: "WidgetToggler",
  components: {},
  props: {
    isRight: Boolean,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>


<style scoped>
</style>
