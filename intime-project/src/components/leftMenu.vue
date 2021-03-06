<template>
  <b-row>
    <b-col cols="10" v-if="isOpen">
      <div class="p-5">
        <h2 class="settings mt-2">Your settings</h2>
      </div>
      <b-row>
        <b-col>
          <div role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle.accordion-1 variant="info">
                  <b-row>
                    <b-col cols="3">
                      <b-badge pill variant="warning" class="ml-1">{{ keywords.length }}</b-badge>
                    </b-col>
                    <b-col cols="6">Keywords</b-col>
                    <b-col cols="3">
                      <b-icon icon="arrow-down-short" font-scale="1"></b-icon>
                    </b-col>
                  </b-row>
                </b-button>
              </b-card-header>
              <b-row>
                <b-col>
                  <b-collapse visible id="accordion-1" accordion="my-accordion-1" role="tabpanel">
                    <b-card-body class="d-flex flex-wrap d-flex justify-content-center">

                      <b-card-text v-if="keywords.length == 0">
                        No keywords saved
                      </b-card-text>

                      <b-card-text v-for="keyword in keywords" v-bind:key="keyword">
                        <b-button
                          variant="outline-primary"
                          v-bind:class="{ active: isKeywordActive(keyword) }"
                          v-on:click="selectKeyword(keyword)"
                          class="mr-1"
                        >
                          <b-button
                            type="button"
                            class="close"
                            aria-label="Close"
                            v-on:click.stop="cancelKeyword(keyword)"
                          >
                            <span aria-hidden="true">×</span>
                          </b-button>
                          {{ keyword }}
                        </b-button>                  
                      </b-card-text>
                    </b-card-body>
                  </b-collapse>
                </b-col>
              </b-row>
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
                  <b-row>
                    <b-col cols="3">
                      <b-badge pill variant="warning">{{ activeCategories.length }}</b-badge>
                    </b-col>
                    <b-col cols="6">Categories</b-col>
                    <b-col cols="3">
                      <b-icon icon="arrow-down-short" font-scale="1"></b-icon>
                    </b-col>
                  </b-row>
                </b-button>
              </b-card-header>
              <b-collapse visible id="accordion-2" accordion="my-accordion-2" role="tabpanel">
                <b-card-body>
                  <b-card-text class="mb-0" v-for="category in categories" v-bind:key="category">
                    <b-row>
                      <b-col cols="8" class="d-flex justify-content-start .d-block">{{category}}</b-col>
                      <b-col cols="4">
                        <Toggle
                          v-bind:state="isCategoryActive(category)"
                          v-on:click.native="onToggleCategory(category)"
                        ></Toggle>
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
       <WidgetToggler v-bind:isRight="!isOpen" v-on:click.native="openClose()"></WidgetToggler>
    </b-col>
  </b-row>
</template>

<script>
import Toggle from "./Toggle.vue";
import WidgetToggler from "./WidgetToggler.vue";

export default {
  name: "leftMenu",
  components: {
    Toggle,
    WidgetToggler,
  },
  props: {
    categories: Array,
    activeCategories: Array,
    activeKeywords: Array,
  },
  data() {
    return {
      isOpen: false,
      keywords: this.$_loadKeywords(),
    };
  },
  methods: {
    // Obs. external reference
    saveKeyword: function (keyword) {
      var exists = this.keywords.includes(keyword);
      if (exists) {
        return;
      }

      this.keywords = [...this.keywords, keyword];
      this.$_saveKeywords();
    },
    selectKeyword: function (keyword) {
      this.$emit("keyword-toggled-event", keyword);
    },
    cancelKeyword: function (keyword) {
      this.keywords = this.keywords.filter((k) => k !== keyword);
      this.$_saveKeywords();
    },
    isKeywordActive(keyword) {
      var isActive = this.activeKeywords.includes(keyword);
      return isActive;
    },
    // $_ convenzione di vue per indicare una funzione privata/interna, da non essere utilizzata dall'esterno
    $_saveKeywords: function () {
      localStorage.setItem("keywords", this.keywords);
    },
    $_loadKeywords: function () {
      return localStorage.getItem("keywords")
        ? localStorage.getItem("keywords").split(",")
        : [];
    },

    onToggleCategory(category) {
      this.$emit("category-toggled-event", category);
    },
    isCategoryActive(category) {
      var isActive = this.activeCategories.includes(category);
      return isActive;
    },

    openClose: function () {
      if (this.isOpen === false) {
        this.isOpen = true;
      } else {
        this.isOpen = false;
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
