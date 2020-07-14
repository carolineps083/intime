<template>
  <b-row>
    <b-col cols="2">
      <a href="#" v-on:click="openClose()">
        <div class="h2 mb-0">
          <b-icon icon="chevron-double-left"></b-icon>
        </div>
      </a>
    </b-col>
    <b-col cols="10" v-if="sxMenu">
      <div class="p-5">
        <h2 class="settings text-center mb-5">Your Feed</h2>
        <b-row class="justify-content-center">
          <b-button variant="outline-primary">Show all</b-button>
        </b-row>
      </div>

      <b-row>
        <b-col>
          <div role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle.accordion-1 variant="info">Arts</b-button>
              </b-card-header>
              <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text>I start opened because visible is true</b-card-text>
                  <b-card-text>text</b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle.accordion-2 variant="info">Business</b-button>
              </b-card-header>
              <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text>text</b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle.accordion-3 variant="info">Sport</b-button>
              </b-card-header>
              <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                  <b-card-text>text</b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "rightMenu",
  components: {},
  props: {},
  data() {
    return {
      sxMenu: false
    };
  },
  methods: {
    openClose: function() {
      if (this.sxMenu === false) {
        this.sxMenu = true;
      } else {
        this.sxMenu = false;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.settings {
  font-size: 20px;
}
.p-5 {
  border: 1px solid rgb(231, 231, 231);
}
</style>
