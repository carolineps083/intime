<template>
  <b-container fluid class="m-0">
    <Header></Header>
    <b-row>
      <b-col cols="3" class="text-center">
        <leftMenu></leftMenu>
      </b-col>
      <b-col cols="6">
        <div class="d-flex justify-content-center">
          <b-form-input v-model="search" placeholder="Search" class="mt-3"></b-form-input>
          <b-button variant="light" class="h4 m-3">
            <b-icon icon="search"></b-icon>
          </b-button>

          <b-button variant="light" class="h4 m-3">
            <b-icon icon="search"></b-icon>
          </b-button>
        </div>
      </b-col>
      <b-col cols="3">
        <rightMenu></rightMenu>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import leftMenu from "./leftMenu.vue";
import rightMenu from "./rightMenu.vue";
import Header from "./Header.vue";

export default {
  name: "Page",
  components: {
    leftMenu,
    rightMenu,
    Header
  },
  props: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.mt-3 {
  width: 300px;
}
</style>
