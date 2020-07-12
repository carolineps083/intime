<template>
  <b-container fluid class="m-0"> 
    <b-row class="border border-primary">
      <b-col cols="3" class="text-center">
        <!-- hamb -->
        Hamburger
      </b-col>
      <b-col cols="6" class="text-center">
        Title
      </b-col>
      <b-col cols="3" class="text-center">
        User
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
                              <b-icon icon="toggle-on"></b-icon>
                              toggle
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
export default {
  name: "Page",
  props: {
  },
  data() {
    return {
      };
  },
  methods: {
    
  } 
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
