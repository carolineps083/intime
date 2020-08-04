<template>
  <b-container fluid class="m-0">
    <Header></Header>
    <b-row>
      <b-col cols="3" class="text-center">
        <leftMenu
          ref="leftMenu"
          v-bind:categories="categories"
          v-bind:activeCategories="activeCategories"
          v-on:category-toggled-event="onToggleCategory"
          v-bind:activeKeywords="activeKeywords"
          v-on:keyword-toggled-event="onToggleKeyword"
        ></leftMenu>
      </b-col>

      <b-col cols="6">
        <div class="d-flex justify-content-center">
          <b-form-input v-model="search" type="search" placeholder="Search" class="mt-3"></b-form-input>
          <b-button variant="light" class="h4 m-3" v-on:click="onSearch()">
            <b-icon icon="search"></b-icon>
          </b-button>
          <b-button variant="light" class="h4 m-3" v-on:click="onSaveKeyword()">
            <b-icon icon="star"></b-icon>
          </b-button>
        </div>

        <div v-if="!firstTime">
          Articles found: {{ this.articles.length }}
          Active keywords: {{ this.activeKeywords.join(', ') }}
          <!-- for each article in all selected categories filtered by keywords -->
          <template v-for="article in articles">
            <Content
              :key="article.url"
              v-bind:url="article.url"
              v-bind:pictureUrl="article.pictureUrl"
              v-bind:title="article.title"
              v-bind:body="article.body"
            ></Content>
          </template>
          <!-- end for -->
        </div>

        <div v-if="firstTime">
          <b-row>
            <b-col>
              <b-row class="d-flex justify-content-center">
                <b-col>
                  <h4 class="text-center m-5">Welcome to In.time!</h4>
                  <div v-if="steps === 0">
                    <p>
                      11111 ipsum dolor sit amet consectetur, adipisicing
                      elit. Ipsum dolorem perspiciatis commodi voluptatibus
                      velit porro vel, id placeat aspernatur voluptatum dignissimos
                      assumenda, pariatur, harum quos expedita? Quos voluptate molestias
                      repudiandae.
                    </p>
                  </div>
                  <div v-if="steps === 1">
                    <p>
                      2222222 ipsum dolor sit amet consectetur, adipisicing
                      elit. Ipsum dolorem perspiciatis commodi voluptatibus
                      velit porro vel, id placeat aspernatur voluptatum dignissimos
                      assumenda, pariatur, harum quos expedita? Quos voluptate molestias
                      repudiandae.
                    </p>
                    <div class="progress">
                      <div
                        class="progress-bar"
                        role="progressbar"
                        style="width: 10%"
                        aria-valuenow="10"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </b-col>
              </b-row>

              <b-row>
                <b-col class="d-flex justify-content-center">
                  <b-button pill class="m-3">Skip</b-button>

                  <b-button pill variant="primary" class="m-3" v-on:click="wizard">Start</b-button>
                </b-col>
              </b-row>
              <b-row></b-row>
            </b-col>
          </b-row>
        </div>
      </b-col>

      <b-col cols="3">
        <rightMenu
          v-bind:activeCategories="activeCategories"
          v-bind:results="results"
          v-on:category-requested-event="onShowCategory"
          v-on:article-requested-event="onShowArticle"
        ></rightMenu>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import leftMenu from "./leftMenu.vue";
import rightMenu from "./rightMenu.vue";
import Header from "./Header.vue";
import Content from "./Content.vue";

export default {
  name: "Page",
  components: {
    leftMenu,
    rightMenu,
    Header,
    Content,
  },
  props: {},
  data() {
    return {
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
        "t-magazine",
        "travel",
        "upshot",
        "us",
        "world",
      ],
      search: "",
      firstTime: false,
      steps: 0,
      articles: [],
      activeCategories: this.$_loadCategories(),
      activeKeywords: [],
      results: [],
    };
  },

  created: function () {
    this.$_getActivesFromApi();
  },

  methods: {
    $_getActivesFromApi: function () {
      for (const category of this.activeCategories) {
        this.$_getCategoryFromApi(category);
      }
    },
    $_getCategoryFromApi: function (category) {
      var token = "u2Lz2DGGlSDP6sQyn7gDFrAG7yVGwQKO";
      const url = `https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=${token}`;
      this.axios.get(url).then((response) => {
        // questo viene eseguito asyncrono, nel futuro (Promise)
        this.results = this.results.filter(
          (result) => result.category !== category
        );
        this.results.push({
          category: category,
          result: response.data,
        });
        this.syncArticles();
      });
    },
    onSearch: function () {
      // current text is in >> this.search

      var searchText = this.search.toLowerCase().trim();
      if (!searchText) {
        return;
      }

      var articles = this.results
        .map((section) => section.result.results)
        .flat(1)
        .map((article) => {
          // it comes NYT article-format, and it converts to a "vue-Content component" format
          var content = mapToContent(article);
          return content;
        })
        .filter((article) => {
          var hasSearchText =
            article.title.toLowerCase().includes(searchText) ||
            article.body.toLowerCase().includes(searchText);

          return hasSearchText;
        });

      articles = this._.uniqBy(articles, "url");

      this.articles = articles;
    },

    onSaveKeyword: function () {
      this.$refs.leftMenu.saveKeyword(this.search);
    },

    onToggleCategory: function (category) {
      var wasActive = this.activeCategories.includes(category);
      if (wasActive) {
        // then it should be removed
        this.activeCategories = this.activeCategories.filter(
          (activeCategory) => activeCategory !== category
        );
        this.results = this.results.filter(
          (result) => result.category !== category
        );
      } else {
        // we can add it
        this.activeCategories = [...this.activeCategories, category];
        this.$_getCategoryFromApi(category);
      }

      this.$_saveCategories();

      this.syncArticles();
    },
    $_saveCategories: function () {
      localStorage.setItem("activeCategories", this.activeCategories);
    },
    $_loadCategories: function () {
      var defaultCategories = ["home"];

      // ternary operator =>> (condizione) ? se-vero : se-falso
      return localStorage.getItem("activeCategories")
        ? localStorage.getItem("activeCategories").split(",")
        : defaultCategories;
    },
    onShowCategory: function (category) {
      var section = this.results.find(
        (section) => section.category === category
      );
      if (!section) {
        return [];
      }

      var articles = section.result.results;
      articles = this._.orderBy(articles, "published_date", "desc");
      articles = articles.map((article) => {
        var content = mapToContent(article);
        return content;
      });
      this.articles = articles;
    },
    onShowArticle: function (category, url) {
      var section = this.results.find(
        (section) => section.category === category
      );
      if (!section) {
        return [];
      }

      var articles = section.result.results;
      var article = articles.find((x) => x.url === url);
      if (!article) {
        this.articles = [
          {
            url: "",
            pictureUrl: "",
            title: "Error",
            body: "Not found",
          },
        ];
        return;
      }

      this.articles = [mapToContent(article)];
    },

    onToggleKeyword: function (keyword) {
      var wasActive = this.activeKeywords.includes(keyword);
      if (wasActive) {
        // then it should be removed
        this.activeKeywords = this.activeKeywords.filter(
          (activeKeyword) => activeKeyword !== keyword
        );
      } else {
        // we can add it
        this.activeKeywords = [...this.activeKeywords, keyword];
      }

      this.syncArticles();
    },

    syncArticles: function () {
      // qui devo popolare l'array degli articoli da visualizzare nella pagina centrale
      // in base alle categorie selezionate e alle keywords attive

      var articles = this.results
        .filter(
          // result => result.category === "arts" || result.category === "home"
          (result) => {
            var xxx = this.activeCategories.includes(result.category);
            return xxx;
          }
        )
        .map((active) => {
          // for-each active category, return just only the list of articles (results.result.results)
          var xxx = active.result.results;
          return xxx;
        })
        .flat(1)
        .map((article) => {
          // it comes NYT article-format, and it converts to a "vue-Content component" format
          var content = mapToContent(article);
          return content;
        })
        .filter((article) => {
          if (this.activeKeywords.length === 0) {
            return true;
          }

          var hasKeywords = this.activeKeywords.some((keyword) => {
            var k = keyword.toLowerCase();

            var included =
              article.title.toLowerCase().includes(k) ||
              article.body.toLowerCase().includes(k);

            return included;
          });
          return hasKeywords;
        });

      articles = this._.uniqBy(articles, "url");

      this.articles = articles;
    },
  },
};

function mapToContent(article) {
  var normalInfo = null;
  if (article.multimedia) {
    normalInfo = article.multimedia.find((m) => m.format === "Normal");
  }

  var content = {
    url: article.url,
    pictureUrl: normalInfo ? normalInfo.url : "",
    title: article.title,
    body: article.abstract,
  };
  return content;
}
</script>

<style scoped lang="scss">
.mt-3 {
  width: 300px;
}
.headlines {
  margin-top: 1em;
}
.progress {
  width: 75%;
}
</style>