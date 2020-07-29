<template>
  <b-row>
    <b-col cols="10" v-if="sxMenu">
      <div class="p-5">
        <h2 class="settings mt-2">Your settings</h2>
      </div>
      <b-row>
        <b-col>
          <div role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle.accordion-1 variant="info">
                  Keywords
                  <b-badge pill variant="warning">2</b-badge>
                  <span class="h5 ml-5">
                    <b-icon icon="arrow-down-short"></b-icon>
                  </span>
                </b-button>
              </b-card-header>
              <b-collapse visible id="accordion-1" accordion="my-accordion-1" role="tabpanel">
                <b-card-body class="d-flex justify-content-start">
                  <b-card-text>
                    <b-button variant="outline-primary" v-on:click="selectKeyword()" class="mr-1">
                      <b-button
                        type="button"
                        class="close"
                        aria-label="Close"
                        v-on:click.stop="cancelKeyword()"
                      >
                        <span aria-hidden="true">×</span>
                      </b-button>badge 1
                    </b-button>
                  </b-card-text>

                  <b-card-text>
                    <b-button variant="outline-primary" v-on:click="selectKeyword()" class="mr-1">
                      <b-button
                        type="button"
                        class="close"
                        aria-label="Close"
                        v-on:click.stop="cancelKeyword()"
                      >
                        <span aria-hidden="true">×</span>
                      </b-button>badge 2
                    </b-button>
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
                <b-button block v-b-toggle.accordion-2 variant="info">
                  Categories
                  <b-badge pill variant="warning">2</b-badge>
                  <span class="h5 ml-5">
                    <b-icon icon="arrow-down-short"></b-icon>
                  </span>
                </b-button>
              </b-card-header>
              <b-collapse visible id="accordion-2" accordion="my-accordion-2" role="tabpanel">
                <b-card-body>
                  <b-card-text v-for="category in categories" v-bind:key="category.id">
                    <!-- inizio for each category-->
                    <!-- <template v-for="category in categories">
                    
                      <div :state="isCategoryActive(category)" @click.native="onToggleCategory(category)">{{category}}</div>
                      </template>
                    -->
                    <b-row>
                      <b-col cols="8" class="d-flex justify-content-start .d-block">{{category}}</b-col>
                      <b-col cols="4">
                        <Toggle
                          :state="isCategoryActive(category)"
                          @v-on:click="onToggleCategory(category)"
                        ></Toggle>
                      </b-col>
                    </b-row>
                    <!-- fine for each -->
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="2">
      <a href="#" v-on:click="openClose()">
        <div class="h2 mb-0">
          <b-icon icon="chevron-double-right"></b-icon>
        </div>
      </a>
    </b-col>
  </b-row>
</template>

<script>
import Toggle from "./Toggle.vue";

export default {
  name: "leftMenu",
  components: {
    Toggle,
  },
  props: {
    activeCategories: Array,
  },
  data() {
    return {
      sxMenu: false,
      keywords: [],
      categories: [
        "arts",
        "automobiles",
        "books",
        "business",
        "fashion",
        "food",
        "health",
        "home",
        "insider",
        "magazine",
        "movies",
        "nyregion",
        "obituaries",
        "opinion",
        "politics",
        "realestate",
        "science",
        "sports",
        "sundayreview",
        "technology",
        "theater",
        "t - magazine",
        "travel",
        "upshot",
        "us",
        "world",
      ],
    };
  },
  methods: {
    selectKeyword: function () {
      alert("paparino");
    },
    cancelKeyword: function () {
      alert("mammamia");
    },
    onToggleCategory(category) {
      // passare a component centrale che si è fatto il toggle della categoria
      // this.categoryActive = !this.categoryActive;
      this.$emit("category-toggled-event", category);
    },
    isCategoryActive(category) {
      // ??? se la voce category è contenuta nell'array di activeCategories, allora true,
      // altrimenti false
      this.activeCategories.includes(category);
      return category == category;
    },
    openClose: function () {
      if (this.sxMenu === false) {
        this.sxMenu = true;
      } else {
        this.sxMenu = false;
      }
    },
  },
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
