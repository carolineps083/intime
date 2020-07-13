<template>
  <b-container fluid class="m-0"> 
    <b-row class="header">
          <b-col cols="3" class="text-center">
            <!-- hamb -->
            <Hamburger></Hamburger>
          </b-col>

          <b-col cols="6" class="text-center">
            <h1>In.Time</h1>
          </b-col>

          <b-col cols="3" class="d-flex align-content-center flex-wrap d-flex justify-content-center">
            <a href="https://myaccount.nytimes.com/auth/login?response_type=cookie&client_id=vi&redirect_uri=https%3A%2F%2Fwww.nytimes.com%2Fsubscription%2Fmultiproduct%2Flp8KQUS.html%3FcampaignId%3D7JFJX%26EXIT_URI%3Dhttps%253A%252F%252Fwww.nytimes.com%252F&asset=masthead" target="_blank">
            <div class="h2 mb-0">
              <b-icon icon="person-fill" class="text-dark"></b-icon>
            </div>
            </a>
          </b-col>
    </b-row>

    <b-row>
      <b-col cols="3" class="text-center border border-warning">
        Sx menu
        <b-row>
          <b-col cols="10">
            <!-- Menu Settings -->
            <b-row>
              <b-col class="text-center">
                Your Settings
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <div role="tablist">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-button
                        block
                        v-b-toggle.accordion-1
                        variant="info"
                      >Keywords</b-button>
                    </b-card-header>
                    <b-collapse visible id="accordion-1" accordion="my-accordion-1" role="tabpanel">
                      <b-card-body>
                        <b-card-text>
                          badge 1 
                        </b-card-text>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <div role="tablist">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-button
                        block
                        v-b-toggle.accordion-2
                        variant="info"
                      >Categories</b-button>
                    </b-card-header>
                    <b-collapse visible id="accordion-2" accordion="my-accordion-2" role="tabpanel">
                      <b-card-body>
                        <b-card-text>

                          <b-row>
                            <b-col cols="8">
                              blabla
                            </b-col>
                            <b-col cols="4">
                              <Toggle :state="category" @click.native="onToggleCategory()"></Toggle>
                            </b-col> 
                          </b-row>

                          <b-row>
                            <b-col cols="8">
                              blabla 2
                            </b-col>
                            <b-col cols="4">
                              <Toggle :state="category" @click.native="onToggleCategory()"></Toggle>
                            </b-col> 
                          </b-row>

                        </b-card-text>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
              </b-col>
            </b-row>

          </b-col>
          <b-col cols="2">
            X
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="6" class="text-center border border-success">
        Content
      </b-col>
      <b-col cols="3" class="text-center border border-danger">
        Dx menu
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Toggle from './Toggle.vue';
import Hamburger from './Hamburger.vue';

export default {

  name: "Page",
  components: {
    Toggle,
    Hamburger
  },
  props: {
  },
  data() {
    return {
      category: true,
      category2: false,
      };
  },
  methods: {
    onToggleCategory() {
      this.category = !this.category;
    }
  } 
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  background-color: #e0e0e0;
}
</style>
