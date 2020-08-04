<template>
  <b-row>
    <template v-if="!isOpen">
      <b-col cols="10"></b-col>
      <b-col cols="2" class>
        <WidgetToggler v-bind:isRight="isOpen" v-on:click.native="openClose()"></WidgetToggler>
      </b-col>
    </template>

    <template v-if="isOpen">
      <b-col cols="2" class>
        <WidgetToggler v-bind:isRight="isOpen" v-on:click.native="openClose()"></WidgetToggler>
      </b-col>
      <b-col cols="10">
        <div class="p-5">
          <h2 class="settings text-center mb-5">Your Feed</h2>
          <b-row class="justify-content-center">
            <b-button variant="outline-primary">Show all</b-button>
          </b-row>
        </div>

        <b-row>
          <b-col>
            <div role="tablist">
              <b-card
                no-body
                class="mb-1"
                v-for="category in orderedCategories"
                v-bind:key="category"
              >
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button
                    block
                    v-b-toggle="'accordion-'+ category"
                    variant="info"
                    class="text-left"
                  >
                    <b-row>
                      <b-col cols="3">
                        <b-badge
                          pill
                          variant="warning"
                          class="ml-1"
                        >{{ getCategoryCount(category) }}</b-badge>
                      </b-col>
                      <b-col cols="6">{{ category }}</b-col>
                      <b-col cols="3">
                        <b-icon icon="arrow-down-short" font-scale="1"></b-icon>
                      </b-col>
                    </b-row>
                  </b-button>
                </b-card-header>
                <b-collapse
                  :id="'accordion-'+ category"
                  :accordion="'accordion-'+ category"
                  role="tabpanel"
                >
                  <b-card-body>
                    <b-card-text>
                      accordion {{category}}
                      <template
                        v-for="article in getCategoryArticles(category)"
                      >
                        <RightMenuContent
                          :key="article.url"
                          v-bind:pictureUrl="article.pictureUrl"
                          v-bind:title="article.title"
                          v-bind:body="article.body"
                        ></RightMenuContent>
                      </template>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </template>
  </b-row>
</template>

<script>
import RightMenuContent from "./RightMenuContent.vue";
import WidgetToggler from "./WidgetToggler.vue";

export default {
  name: "rightMenu",
  components: {
    RightMenuContent,
    WidgetToggler,
  },
  props: {
    results: Array,
    activeCategories: Array,
  },
  data() {
    return {
      isOpen: false,
      empty: true,
      articlesCategory: [],
    };
  },
  methods: {
    openClose: function () {
      if (this.isOpen === false) {
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    },
    getCategoryCount: function (category) {
      var section = this.results.find(
        (section) => section.category === category
      );
      var count = section ? section.result.num_results : 0;
      return count;
    },
    getCategoryArticles: function (category) {
      var section = this.results.find(
        (section) => section.category === category
      );
      if (!section) {
        return [];
      }

      var articles = section.result.results;
      articles = this._.orderBy(articles, "published_date", "desc");
      articles = this._.take(articles, 2);
      articles = articles.map((article) => {
        var normalInfo = article.multimedia.find(
          (m) => m.format === "Standard Thumbnail"
        );
        // this object "content" matches the vue-content format input props
        var content = {
          url: article.url,
          pictureUrl: normalInfo ? normalInfo.url : "",
          title: article.title,
          body: this._.truncate(article.abstract, {
            length: 50,
            separator: " ",
            omission: " [...]",
          }),
        };
        return content;
      });
      return articles;
    },
  },
  computed: {
    orderedCategories: function () {
      return this._.orderBy(this.activeCategories);
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
