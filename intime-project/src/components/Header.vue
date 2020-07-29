<template>
  <b-row class="header">
    <b-col cols="3" class="text-center">
      <Hamburger></Hamburger>
    </b-col>

    <b-col cols="6" class="text-center">
      <h1 class="title">In.Time</h1>
    </b-col>

    <b-col cols="3" class="d-flex align-content-center flex-wrap d-flex justify-content-center">
      <a
        href="https://myaccount.nytimes.com/auth/login?response_type=cookie&client_id=vi&redirect_uri=https%3A%2F%2Fwww.nytimes.com%2Fsubscription%2Fmultiproduct%2Flp8KQUS.html%3FcampaignId%3D7JFJX%26EXIT_URI%3Dhttps%253A%252F%252Fwww.nytimes.com%252F&asset=masthead"
        target="_blank"
      >
        <div class="h2 mb-0">
          <b-icon icon="person-fill" class="text-dark"></b-icon>
        </div>
      </a>
    </b-col>
  </b-row>
</template>

<script>
import Hamburger from "./Hamburger.vue";

export default {
  name: "Header",
  components: {
    Hamburger,
  },
  props: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  background-color: #e0e0e0;
}
.title {
  font-size: 30px;
  margin-top: 8px;
}
</style>
