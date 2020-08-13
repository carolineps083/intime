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

        <template v-if="!firstTime">
          <b-row>
            <b-col class="d-flex justify-content-center">
              <p class="infoArticles">
                Articles found:
                <b-badge
                  v-if="this.articles.length > 0"
                  variant="success"
                >{{ this.articles.length }}</b-badge>
                <b-badge
                  v-if="this.articles.length == 0"
                  variant="danger"
                >{{ this.articles.length }}</b-badge>
              </p>
            </b-col>
          </b-row>
          <b-row v-if="activeKeywords.length > 0">
            <b-col class="d-flex justify-content-center">
              <p class="infoArticles">
                Active keywords:
                <b-badge variant="success">{{ this.activeKeywords.join(', ') }}</b-badge>
              </p>
            </b-col>
          </b-row>
          <hr />
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
        </template>

        <template v-if="firstTime">
          <b-row class="d-flex justify-content-center">
            <b-col>
              <h4 class="text-center mt-5">Welcome to In.time!</h4>
              <div v-if="steps === 0">
                <div class="boxParagraph">
                  <span class="d-flex justify-content-center m-4">
                    <p class="stepsText"></p>
                  </span>
                  <p class="text-justify">
                    This is the new NYT platform that makes it easier than
                    ever for you to find exactly what you are looking for.
                    Here you can search for articles based on
                    <b>keywords</b> and
                    <b>categories</b>,
                    and have a quick overview over all the topics your interested in.
                    This short tutorial will help you navigate the page and set up your settings.
                    <br />
                    <br />To begin just click the "Start tutorial" button below!
                  </p>
                </div>
                <div class="progress">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    style="width: 20%"
                    aria-valuenow="1"
                    aria-valuemin="0"
                    aria-valuemax="5"
                  ></div>
                </div>
              </div>

              <div v-if="steps === 1">
                <div class="boxParagraph">
                  <span class="d-flex justify-content-center m-4">
                    <p class="stepsText">Step 1</p>
                  </span>
                  <p>
                    The main feautures of this new portal is the option
                    to
                    <b>filter articles</b> based on the keywords and categories
                    you saved.
                    Write a keyword in the search bar, then press
                    <b-icon icon="star"></b-icon>&nbsp;to save it.
                    <br />
                    <br />You can see the new saved keyword in the left menu,
                    under "Keywords".
                    Click once on the keyword to
                    <b>select</b> it, once again to
                    <b>deselect</b> it.
                    Click on
                    "
                    <span aria-hidden="true">×</span>" &nbsp; to
                    <b>remove</b>
                    the keyword from the list.
                  </p>
                </div>
                <div class="progress">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    style="width: 40%"
                    aria-valuenow="2"
                    aria-valuemin="0"
                    aria-valuemax="5"
                  ></div>
                </div>
              </div>

              <div v-if="steps === 2">
                <div class="boxParagraph">
                  <span class="d-flex justify-content-center m-4">
                    <p class="stepsText">Step 2</p>
                  </span>
                  <p>
                    On the left menu, under the "Keywords" panel, you can see a panel
                    called "Categories". These are all the different sections the NYT articles
                    are divided into, and they are helpful to filter
                    <b>
                      the content you are most
                      interested in.
                    </b>
                    You can toggle on maximum
                    <b>5 categories</b> at the time.
                    Click on
                    <b-icon icon="chevron-double-left"></b-icon>&nbsp; to close the left menu.
                    <br />
                    <br />Proceed in the tutorial
                    to understand better how the articles categories work.
                  </p>
                </div>
                <div class="progress">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    style="width: 60%"
                    aria-valuenow="3"
                    aria-valuemin="0"
                    aria-valuemax="5"
                  ></div>
                </div>
              </div>

              <div v-if="steps === 3">
                <div class="boxParagraph">
                  <span class="d-flex justify-content-center m-4">
                    <p class="stepsText">Step 3</p>
                  </span>
                  <p>
                    The right menu, called
                    <b>"Your feed"</b>, gives you an overview
                    over the articles available in each selected category.
                    Click on the
                    <b>"Show all"</b> button to display all the articles
                    available in all the selected categories.
                    <br />
                    <br />Click on a category to see its top articles.
                    The
                    <b>"See all articles"</b> button displays all the articles
                    in that category, while the
                    <b>"See more"</b> button display the full
                    selected article.
                  </p>
                </div>
                <div class="progress">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    style="width: 80%"
                    aria-valuenow="4"
                    aria-valuemin="0"
                    aria-valuemax="5"
                  ></div>
                </div>
              </div>

              <div v-if="steps === 4">
                <div class="boxParagraph">
                  <span class="d-flex justify-content-center m-4">
                    <p class="stepsText">Step 4</p>
                  </span>
                  <p>
                    Lastly,
                    in order to have
                    <b>full access</b> to all the articles in the NYT,
                    you need to
                    <b>create an account</b> or
                    <b>login</b>.
                    <br />
                    <br />If you click on
                    <b-icon icon="person-fill" class="text-dark"></b-icon>&nbsp;
                    on the right of the navigation bar, you will be redirected to
                    the NYT login page.
                    You just need to
                    <b>login once</b>, and you will be automatically authenticated
                    in this page.
                  </p>
                </div>
                <div class="progress">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    style="width: 100%"
                    aria-valuenow="5"
                    aria-valuemin="0"
                    aria-valuemax="5"
                  ></div>
                </div>
              </div>
            </b-col>
          </b-row>

          <!-- row of buttons -->
          <b-row v-if="steps == 0">
            <b-col cols="6" class="d-flex justify-content-end">
              <b-button pill v-on:click="changeFirstTime()">Skip Tutorial</b-button>
            </b-col>
            <b-col cols="6" class="d-flex justify-content-start">
              <b-button pill variant="primary" v-on:click="steps++">Start Tutorial</b-button>
            </b-col>
          </b-row>

          <b-row v-if="steps > 0 && steps < 4">
            <b-col cols="6" class="d-flex justify-content-end">
              <b-button v-on:click="steps--" pill>Back</b-button>
            </b-col>

            <b-col cols="6" class="d-flex justify-content-start">
              <b-button pill variant="primary" v-on:click="steps++">Next</b-button>
            </b-col>
          </b-row>

          <b-row v-if="steps == 4">
            <b-col cols="6" class="d-flex justify-content-end">
              <b-button pill v-on:click="steps--">Back</b-button>
            </b-col>

            <b-col cols="6" class="d-flex justify-content-start">
              <b-button pill variant="primary" v-on:click="changeFirstTime()">End tutorial</b-button>
            </b-col>
          </b-row>
        </template>
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
      firstTime: true,
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
      var promises = [];

      for (const category of this.activeCategories) {
        const promise = this.$_getCategoryFromApi(category);
        promises.push(promise);
      }

      Promise.all(promises)
        .then((responses) => {
          // questo viene eseguito asyncrono, nel futuro (Promise)

          for (var i = 0; i < responses.length; i++) {
            const response = responses[i];

            const category = response.data.section.toLowerCase();
            this.results = this.results.filter(
              (result) => result.category !== category
            );
            this.results.push({
              category: category,
              result: response.data,
            });
          }

          this.syncArticles();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeFirstTime: function () {
      this.firstTime = !this.firstTime;
    },

    $_getCategoryFromApi: function (category) {
      var token = "u2Lz2DGGlSDP6sQyn7gDFrAG7yVGwQKO";
      const url = `https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=${token}`;

      const promise = this.axios.get(url);
      return promise;
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
        var countActive = this.activeCategories.length;
        if (countActive >= 5) {
          // non posso aggiungerla, le API mi darebbero errore 409 (too many requests)
          alert("Max 5 categories");
          return;
        }

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
.infoArticles {
  font-size: 20px;
  margin: 20px 0px 20px;
}
.progress {
  margin: 40px auto;
}
.boxParagraph {
  height: 200px;
  text-align: justify;
}
.stepsText {
  font-weight: bold;
  color: rgb(66, 162, 226);
}
.TESTING {
  border: solid 1px red;
}
</style>