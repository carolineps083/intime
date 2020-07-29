<template>
  <b-row>
    <b-col cols="2" class>
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
                <b-button
                  block
                  v-b-toggle.accordion-3
                  variant="info"
                  class="d-flex justify-content-start"
                >
                  Arts
                  <b-col class="d-flex justify-content-center">
                    <b-badge pill variant="warning">2</b-badge>
                  </b-col>
                  <b-col>
                    <span class="h5 mr-5">
                      <b-icon icon="arrow-down-short"></b-icon>
                    </span>
                  </b-col>
                </b-button>
              </b-card-header>
              <b-collapse id="accordion-3" accordion="my-accordion-3" role="tabpanel">
                <b-card-body>
                  <b-card-text>text</b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button
                  block
                  v-b-toggle.accordion-4
                  variant="info"
                  class="d-flex justify-content-start"
                >
                  Business
                  <b-col class="d-flex justify-content-center">
                    <b-badge pill variant="warning">2</b-badge>
                  </b-col>
                  <b-col class="d-flex justify-content-end">
                    <span class="h5 mr-5">
                      <b-icon icon="arrow-down-short"></b-icon>
                    </span>
                  </b-col>
                </b-button>
              </b-card-header>
              <b-collapse id="accordion-4" accordion="my-accordion-4" role="tabpanel">
                <b-card-body>
                  <b-card-text>text</b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button
                  block
                  v-b-toggle.accordion-5
                  variant="info"
                  class="d-flex justify-content-start"
                >
                  Sport
                  <b-col class="d-flex justify-content-center">
                    <b-badge pill variant="secondary">-</b-badge>
                  </b-col>
                  <b-col class="d-flex justify-content-end">
                    <span class="h5">
                      <b-icon icon="arrow-down-short"></b-icon>
                    </span>
                  </b-col>
                </b-button>
              </b-card-header>
              <b-collapse id="accordion-5" accordion="my-accordion-5" role="tabpanel">
                <b-card-body>
                  <b-card-text>
                    <div v-if="empty">
                      <p>No article available</p>
                    </div>
                  </b-card-text>
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
      sxMenu: false,
      empty: true
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
