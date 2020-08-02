<template>
  <b-container fluid class="m-0">
    <Header></Header>
    <b-row>
      <b-col cols="3" class="text-center">
        <leftMenu
          ref="leftMenu"
          v-bind:activeCategories="activeCategories"
          v-on:category-toggled-event="onToggleCategory"
          v-bind:activeKeywords="activeKeywords"
          v-on:keyword-toggled-event="onToggleKeyword"
        ></leftMenu>
      </b-col>

      <b-col cols="6">
        <div class="d-flex justify-content-center">
          <b-form-input v-model="search" placeholder="Search" class="mt-3"></b-form-input>
          <b-button variant="light" class="h4 m-3" v-on:click="onSearch()">
            <b-icon icon="search"></b-icon>
          </b-button>
          <b-button variant="light" class="h4 m-3" v-on:click="onSaveKeyword()">
            <b-icon icon="star"></b-icon>
          </b-button>
        </div>

        <div v-if="!firstTime">
          <!-- for each article in all selected categories filtered by keywords -->
          <template v-for="article in articles">
            <Content
              :key="article.url"
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
        <rightMenu v-bind:activeCategories="activeCategories"></rightMenu>
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
      search: "",
      firstTime: false,
      steps: 0,
      articles: [
        {
          pictureUrl:
            "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-virus-reconstruct1/18dc-virus-reconstruct1-thumbStandard.jpg",
          title:
            "Inside Trump’s Failure: The Rush to Abandon Leadership Role on the Virus",
          body:
            "The roots of the nation’s current inability to control the pandemic can be traced to mid-April, when the White House embraced overly rosy projections to proclaim victory and move on.",
        },
        {
          pictureUrl:
            "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-virus-takeaways/18dc-virus-takeaways-thumbLarge.jpg",
          title:
            "Inside the Failure: 5 Takeaways on Trump’s Effort to Shift Responsibility",
          body:
            "President Trump and his top aides sharply shifted their pandemic strategy in mid-April after seizing on optimistic data suggesting the virus would disappear, a Times investigation found.",
        },
      ],
      // ternary operator =>> (condizione) ? se-vero : se-falso
      activeCategories: localStorage.getItem("activeCategories")
        ? localStorage.getItem("activeCategories").split(",")
        : ["home"],
      activeKeywords: [],
      results: getFromApi(),
    };
  },
  methods: {
    onSearch: function () {
      // TODO: current text is in >> this.search
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
      } else {
        // we can add it
        this.activeCategories = [...this.activeCategories, category];
      }

      localStorage.setItem("activeCategories", this.activeCategories);

      var xxxx = localStorage.getItem("activeCategories");
      console.log(xxxx);

      this.syncArticles();
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
      this.articles = [];
      this.articles = this.results
        .filter(
          // result => result.category === "arts" || result.category === "home"
          (result) => {
            var xxx = result.category === "arts" || result.category === "home";
            return xxx;
          }
        )
        .map((active) => {
          var xxx = active.result.results;
          return xxx;
        })
        .map((articles) => {
          var xxx = articles.map((article) => {
            var normalInfo = article.multimedia.find(
              (m) => m.format === "Normal"
            );
            var content = {
              pictureUrl: normalInfo ? normalInfo.url : "",
              title: article.title,
              body: article.abstract,
            };
            return content;
          });

          return xxx;
        })
        .flat(1);

      console.log(this.articles);
    },
  },
};

function getFromApi() {
  var homeObjectFromApi = {
    status: "OK",
    copyright:
      "Copyright (c) 2020 The New York Times Company. All Rights Reserved.",
    section: "home",
    last_updated: "2020-07-19T13:14:02-04:00",
    num_results: 55,
    results: [
      {
        section: "us",
        subsection: "politics",
        title:
          "Inside Trump’s Failure: The Rush to Abandon Leadership Role on the Virus",
        abstract:
          "The roots of the nation’s current inability to control the pandemic can be traced to mid-April, when the White House embraced overly rosy projections to proclaim victory and move on.",
        url:
          "https://www.nytimes.com/2020/07/18/us/politics/trump-coronavirus-response-failure-leadership.html",
        uri: "nyt://article/9d06d351-5e1c-5e67-aa76-eef3397e6d2d",
        byline:
          "By Michael D. Shear, Noah Weiland, Eric Lipton, Maggie Haberman and David E. Sanger",
        item_type: "Article",
        updated_date: "2020-07-19T11:25:52-04:00",
        created_date: "2020-07-18T13:54:01-04:00",
        published_date: "2020-07-18T13:54:01-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Coronavirus (2019-nCoV)",
          "Coronavirus Reopenings",
          "Disease Rates",
          "Quarantines",
          "Tests (Medical)",
          "Masks",
          "United States Politics and Government",
          "Federal-State Relations (US)",
        ],
        org_facet: ["University of Washington"],
        per_facet: [
          "Trump, Donald J",
          "Birx, Deborah L",
          "Meadows, Mark R (1959- )",
          "Kushner, Jared",
          "Fauci, Anthony S",
        ],
        geo_facet: ["Italy", "United States"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-virus-reconstruct1/merlin_174575826_5ad4eed3-8b2b-4c14-9421-dded152c4852-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "President Trump speaking during a televised news conference this week, as seen from a coronavirus ward at Houston Methodist Hospital.",
            copyright: "Erin Schaff/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-virus-reconstruct1/18dc-virus-reconstruct1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "President Trump speaking during a televised news conference this week, as seen from a coronavirus ward at Houston Methodist Hospital.",
            copyright: "Erin Schaff/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-virus-reconstruct1/18dc-virus-reconstruct1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "President Trump speaking during a televised news conference this week, as seen from a coronavirus ward at Houston Methodist Hospital.",
            copyright: "Erin Schaff/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-virus-reconstruct1/merlin_174575826_5ad4eed3-8b2b-4c14-9421-dded152c4852-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "President Trump speaking during a televised news conference this week, as seen from a coronavirus ward at Houston Methodist Hospital.",
            copyright: "Erin Schaff/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-virus-reconstruct1/merlin_174575826_5ad4eed3-8b2b-4c14-9421-dded152c4852-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "President Trump speaking during a televised news conference this week, as seen from a coronavirus ward at Houston Methodist Hospital.",
            copyright: "Erin Schaff/The New York Times",
          },
        ],
        short_url: "https://nyti.ms/32x1DgH",
      },
      {
        section: "us",
        subsection: "politics",
        title:
          "Inside the Failure: 5 Takeaways on Trump’s Effort to Shift Responsibility",
        abstract:
          "President Trump and his top aides sharply shifted their pandemic strategy in mid-April after seizing on optimistic data suggesting the virus would disappear, a Times investigation found.",
        url:
          "https://www.nytimes.com/2020/07/18/us/politics/trump-coronavirus-failure-takeaways.html",
        uri: "nyt://article/1e20c958-07af-56d4-8dac-e679dc49259e",
        byline: "By Michael D. Shear",
        item_type: "Article",
        updated_date: "2020-07-19T11:25:49-04:00",
        created_date: "2020-07-18T14:01:46-04:00",
        published_date: "2020-07-18T14:01:46-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Coronavirus (2019-nCoV)",
          "Presidential Election of 2020",
          "United States Politics and Government",
          "Federal-State Relations (US)",
          "Disease Rates",
        ],
        org_facet: ["Centers for Disease Control and Prevention"],
        per_facet: [
          "Trump, Donald J",
          "Birx, Deborah L",
          "Fauci, Anthony S",
          "Pence, Mike",
          "Liddell, Christopher P",
          "Hassett, Kevin A",
          "Kushner, Jared",
          "Newsom, Gavin",
          "Meadows, Mark R (1959- )",
        ],
        geo_facet: ["United States", "Italy"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-virus-takeaways/merlin_174590136_a925b981-6318-4418-bec5-8ed83f553fbf-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "President Trump on Wednesday in the  Oval Office.",
            copyright: "Anna Moneymaker for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-virus-takeaways/18dc-virus-takeaways-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "President Trump on Wednesday in the  Oval Office.",
            copyright: "Anna Moneymaker for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-virus-takeaways/18dc-virus-takeaways-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "President Trump on Wednesday in the  Oval Office.",
            copyright: "Anna Moneymaker for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-virus-takeaways/merlin_174590136_a925b981-6318-4418-bec5-8ed83f553fbf-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "President Trump on Wednesday in the  Oval Office.",
            copyright: "Anna Moneymaker for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-virus-takeaways/merlin_174590136_a925b981-6318-4418-bec5-8ed83f553fbf-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "President Trump on Wednesday in the  Oval Office.",
            copyright: "Anna Moneymaker for The New York Times",
          },
        ],
        short_url: "https://nyti.ms/2CsFRzP",
      },
      {
        section: "world",
        subsection: "",
        title:
          "Coronavirus Live Updates: Trump Adds to White House Criticism of Fauci",
        abstract:
          "President Trump calls Dr. Anthony S. Fauci “a little bit of an alarmist.” The White House seeks to cut billions from Senate Republicans’ next relief bill. During lockdowns around the world, premature births have fallen.",
        url:
          "https://www.nytimes.com/2020/07/19/world/coronavirus-live-updates.html",
        uri: "nyt://article/7677ee0a-c883-577d-a6af-6cfced2b0915",
        byline: "",
        item_type: "Article",
        updated_date: "2020-07-19T12:34:57-04:00",
        created_date: "2020-07-19T07:04:34-04:00",
        published_date: "2020-07-19T07:04:34-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Coronavirus (2019-nCoV)"],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/us-briefing-promo-image-print/us-briefing-promo-image-superJumbo.jpg",
            format: "superJumbo",
            height: 1080,
            width: 1920,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/us-briefing-promo-image-print/us-briefing-promo-image-thumbStandard-v2.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/us-briefing-promo-image-print/us-briefing-promo-image-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/us-briefing-promo-image-print/us-briefing-promo-image-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/us-briefing-promo-image-print/us-briefing-promo-image-articleInline.jpg",
            format: "Normal",
            height: 107,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The New York Times",
          },
        ],
        short_url: "https://nyti.ms/2CJinX3",
      },
      {
        section: "us",
        subsection: "",
        title: "This Border Town Was on the Rise. Then the Pandemic Hit.",
        abstract:
          "How the closure of the U.S.-Canada border in March devastated the economy of a Washington town.",
        url:
          "https://www.nytimes.com/2020/07/18/us/coronavirus-canada-border-washington.html",
        uri: "nyt://article/2fbb57c8-dcab-5b22-9dd3-bf9f14212156",
        byline: "By Rachel Abrams",
        item_type: "Article",
        updated_date: "2020-07-19T11:25:48-04:00",
        created_date: "2020-07-18T09:06:25-04:00",
        published_date: "2020-07-18T09:06:25-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Coronavirus (2019-nCoV)",
          "Shutdowns (Institutional)",
          "Economic Conditions and Trends",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: ["British Columbia (Canada)", "Blaine (Wash)"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/us/00virus-northernborder-top/merlin_174683715_ff291ce2-d462-4d9a-9f64-d8ba1e45c40a-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Mark Seymour, right, the owner of Drayton Oysters, hauled oysters at the pier in the border town of Blaine, Wash., on Thursday.",
            copyright: "Ruth Fremson/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/us/00virus-northernborder-top/merlin_174683715_ff291ce2-d462-4d9a-9f64-d8ba1e45c40a-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Mark Seymour, right, the owner of Drayton Oysters, hauled oysters at the pier in the border town of Blaine, Wash., on Thursday.",
            copyright: "Ruth Fremson/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/us/00virus-northernborder-top/merlin_174683715_ff291ce2-d462-4d9a-9f64-d8ba1e45c40a-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Mark Seymour, right, the owner of Drayton Oysters, hauled oysters at the pier in the border town of Blaine, Wash., on Thursday.",
            copyright: "Ruth Fremson/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/us/00virus-northernborder-top/merlin_174683715_ff291ce2-d462-4d9a-9f64-d8ba1e45c40a-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Mark Seymour, right, the owner of Drayton Oysters, hauled oysters at the pier in the border town of Blaine, Wash., on Thursday.",
            copyright: "Ruth Fremson/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/us/00virus-northernborder-top/merlin_174683715_ff291ce2-d462-4d9a-9f64-d8ba1e45c40a-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Mark Seymour, right, the owner of Drayton Oysters, hauled oysters at the pier in the border town of Blaine, Wash., on Thursday.",
            copyright: "Ruth Fremson/The New York Times",
          },
        ],
        short_url: "https://nyti.ms/2BcfFJl",
      },
      {
        section: "business",
        subsection: "",
        title:
          "Federal Aid Has So Far Averted Personal Bankruptcies, but Trouble Looms",
        abstract:
          "Once federal benefits dry up, highly indebted consumers could be forced to file.",
        url:
          "https://www.nytimes.com/2020/07/17/business/personal-bankruptcies-coronavirus.html",
        uri: "nyt://article/b8299e12-2f7e-5109-bc87-b3351678dd34",
        byline: "By Mary Williams Walsh",
        item_type: "Article",
        updated_date: "2020-07-19T11:25:50-04:00",
        created_date: "2020-07-17T11:27:59-04:00",
        published_date: "2020-07-17T11:27:59-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "United States Economy",
          "Credit and Debt",
          "Personal Finances",
          "Banking and Financial Institutions",
          "Personal Bankruptcies",
          "Debt Collection",
          "Consumer Protection",
          "Unemployment",
          "Coronavirus Aid, Relief, and Economic Security Act (2020)",
          "Labor and Jobs",
          "Coronavirus (2019-nCoV)",
        ],
        org_facet: ["Federal Reserve Bank of New York"],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/business/17virus-personaldebt/17virus-personaldebt-superJumbo-v3.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Credit card debt piled up for Jess Brown, and the $600 federal unemployment supplement has kept her afloat. That benefit ends this month.",
            copyright: "Eamon Queeney for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/business/17virus-personaldebt/17virus-personaldebt-thumbStandard-v3.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Credit card debt piled up for Jess Brown, and the $600 federal unemployment supplement has kept her afloat. That benefit ends this month.",
            copyright: "Eamon Queeney for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/business/17virus-personaldebt/17virus-personaldebt-thumbLarge-v3.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Credit card debt piled up for Jess Brown, and the $600 federal unemployment supplement has kept her afloat. That benefit ends this month.",
            copyright: "Eamon Queeney for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/business/17virus-personaldebt/17virus-personaldebt-mediumThreeByTwo210-v3.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Credit card debt piled up for Jess Brown, and the $600 federal unemployment supplement has kept her afloat. That benefit ends this month.",
            copyright: "Eamon Queeney for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/business/17virus-personaldebt/17virus-personaldebt-articleInline-v3.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Credit card debt piled up for Jess Brown, and the $600 federal unemployment supplement has kept her afloat. That benefit ends this month.",
            copyright: "Eamon Queeney for The New York Times",
          },
        ],
        short_url: "https://nyti.ms/2ClK2gW",
      },
      {
        section: "us",
        subsection: "",
        title:
          "As the Virus Deepens Financial Trouble, Colleges Turn to Layoffs",
        abstract:
          "The University of Akron this week became one of the first schools in the country to make profound cuts in the number of full-time professors on its staff. Others might have to follow.",
        url:
          "https://www.nytimes.com/2020/07/16/us/coronavirus-college-faculty-layoffs.html",
        uri: "nyt://article/fc52b0f3-8507-5adf-b6b6-27d81252e77a",
        byline: "By Daniel McGraw, Shawn Hubler and Dan Levin",
        item_type: "Article",
        updated_date: "2020-07-19T11:25:49-04:00",
        created_date: "2020-07-16T19:16:35-04:00",
        published_date: "2020-07-16T19:16:35-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Colleges and Universities",
          "Layoffs and Job Reductions",
          "Coronavirus (2019-nCoV)",
          "Wages and Salaries",
        ],
        org_facet: ["University of Akron", "Ohio University"],
        per_facet: [],
        geo_facet: ["Ohio"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/16virus-collegelayoffs02-sub/merlin_171166869_86a2d73c-b1a8-420f-882d-d3e4f2e68991-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "The chancellor of the University of California, Berkeley, cited uncertain fall enrollment, “particularly with our international student population,” as one of several financial pressures facing the university.",
            copyright: "Jeff Chiu/Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/16virus-collegelayoffs02-sub/merlin_171166869_86a2d73c-b1a8-420f-882d-d3e4f2e68991-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "The chancellor of the University of California, Berkeley, cited uncertain fall enrollment, “particularly with our international student population,” as one of several financial pressures facing the university.",
            copyright: "Jeff Chiu/Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/16virus-collegelayoffs02-sub/merlin_171166869_86a2d73c-b1a8-420f-882d-d3e4f2e68991-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "The chancellor of the University of California, Berkeley, cited uncertain fall enrollment, “particularly with our international student population,” as one of several financial pressures facing the university.",
            copyright: "Jeff Chiu/Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/16virus-collegelayoffs02-sub/merlin_171166869_86a2d73c-b1a8-420f-882d-d3e4f2e68991-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "The chancellor of the University of California, Berkeley, cited uncertain fall enrollment, “particularly with our international student population,” as one of several financial pressures facing the university.",
            copyright: "Jeff Chiu/Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/16virus-collegelayoffs02-sub/merlin_171166869_86a2d73c-b1a8-420f-882d-d3e4f2e68991-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "The chancellor of the University of California, Berkeley, cited uncertain fall enrollment, “particularly with our international student population,” as one of several financial pressures facing the university.",
            copyright: "Jeff Chiu/Associated Press",
          },
        ],
        short_url: "https://nyti.ms/392uE4W",
      },
      {
        section: "us",
        subsection: "",
        title: "How Buying Beans Became a Political Statement",
        abstract:
          "The boycott and counter-boycott of Goya comes as the major political parties seek to energize Hispanic support ahead of the 2020 election.",
        url:
          "https://www.nytimes.com/2020/07/19/us/goya-trump-hispanic-vote.html",
        uri: "nyt://article/04b40f78-b967-530b-b855-f7b9e05ecd1b",
        byline: "By Farah Stockman, Kate Kelly and Jennifer Medina",
        item_type: "Article",
        updated_date: "2020-07-19T12:55:58-04:00",
        created_date: "2020-07-19T05:00:11-04:00",
        published_date: "2020-07-19T05:00:11-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Race and Ethnicity",
          "Hispanic-Americans",
          "Presidential Election of 2020",
        ],
        org_facet: ["Goya Foods Inc"],
        per_facet: ["Trump, Donald J", "Unanue, Robert I"],
        geo_facet: ["United States"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/us/19goya-print1-sub/merlin_174687735_4788dd33-f0cf-4042-9e87-ba40c9252ff4-superJumbo.jpg",
            format: "superJumbo",
            height: 1367,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "A Goya distribution center near Brookshire, Texas. A once-beloved brand became anathema in many Latino homes across the United States.",
            copyright: "Sergio Flores for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/us/19goya-print1-sub/18goya05-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "A Goya distribution center near Brookshire, Texas. A once-beloved brand became anathema in many Latino homes across the United States.",
            copyright: "Sergio Flores for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/us/19goya-print1-sub/18goya05-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "A Goya distribution center near Brookshire, Texas. A once-beloved brand became anathema in many Latino homes across the United States.",
            copyright: "Sergio Flores for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/us/19goya-print1-sub/18goya05-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "A Goya distribution center near Brookshire, Texas. A once-beloved brand became anathema in many Latino homes across the United States.",
            copyright: "Sergio Flores for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/us/19goya-print1-sub/merlin_174687735_4788dd33-f0cf-4042-9e87-ba40c9252ff4-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "A Goya distribution center near Brookshire, Texas. A once-beloved brand became anathema in many Latino homes across the United States.",
            copyright: "Sergio Flores for The New York Times",
          },
        ],
        short_url: "https://nyti.ms/3jkTCBe",
      },
      {
        section: "us",
        subsection: "politics",
        title:
          "Why a ‘Do No Harm’ General Election Strategy Could Work for Joe Biden",
        abstract:
          "Mr. Biden is running a risk-averse campaign in states like Wisconsin, where a broad coalition of supporters is emerging. Even Republicans are noticing.",
        url:
          "https://www.nytimes.com/2020/07/19/us/politics/joe-biden-wisconsin-election.html",
        uri: "nyt://article/3da4ea79-f013-5957-8e80-308a4403f4d3",
        byline: "By Astead W. Herndon",
        item_type: "Article",
        updated_date: "2020-07-19T11:25:54-04:00",
        created_date: "2020-07-19T05:00:12-04:00",
        published_date: "2020-07-19T05:00:12-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Presidential Election of 2020"],
        org_facet: [],
        per_facet: ["Biden, Joseph R Jr", "Trump, Donald J"],
        geo_facet: ["Wisconsin"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/us/politics/00wisconsin1/merlin_174353838_afbca6ab-4cfa-4da0-b767-3106d374a861-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "People cheered on the Independence Day parade in Friendship, Wis., this month. The village is located in one of the 22 Wisconsin counties that voted for President Trump after backing President Obama in 2012.",
            copyright: "Lauren Justice for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/us/politics/00wisconsin1/00wisconsin1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "People cheered on the Independence Day parade in Friendship, Wis., this month. The village is located in one of the 22 Wisconsin counties that voted for President Trump after backing President Obama in 2012.",
            copyright: "Lauren Justice for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/us/politics/00wisconsin1/00wisconsin1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "People cheered on the Independence Day parade in Friendship, Wis., this month. The village is located in one of the 22 Wisconsin counties that voted for President Trump after backing President Obama in 2012.",
            copyright: "Lauren Justice for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/us/politics/00wisconsin1/merlin_174353838_afbca6ab-4cfa-4da0-b767-3106d374a861-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "People cheered on the Independence Day parade in Friendship, Wis., this month. The village is located in one of the 22 Wisconsin counties that voted for President Trump after backing President Obama in 2012.",
            copyright: "Lauren Justice for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/us/politics/00wisconsin1/merlin_174353838_afbca6ab-4cfa-4da0-b767-3106d374a861-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "People cheered on the Independence Day parade in Friendship, Wis., this month. The village is located in one of the 22 Wisconsin counties that voted for President Trump after backing President Obama in 2012.",
            copyright: "Lauren Justice for The New York Times",
          },
        ],
        short_url: "https://nyti.ms/32zDfL5",
      },
      {
        section: "us",
        subsection: "politics",
        title:
          "Bill Stepien Takes Helm of Trump Campaign as a Data-Obsessed Political Fighter",
        abstract:
          "Mr. Stepien, a former aide to Chris Christie who has been shadowed by the Bridgegate scandal, brings a data-centric style to the president’s lagging re-election effort.",
        url: "https://www.nytimes.com/article/bill-stepien.html",
        uri: "nyt://article/28f7156a-50b9-5816-a2c4-27c28d2b3048",
        byline: "By Nick Corasaniti and Stephanie Saul",
        item_type: "Article",
        updated_date: "2020-07-19T11:25:54-04:00",
        created_date: "2020-07-16T18:24:21-04:00",
        published_date: "2020-07-16T18:24:21-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Presidential Election of 2020",
          "George Washington Bridge Scandal (2013)",
        ],
        org_facet: ["Republican Party"],
        per_facet: [
          "Parscale, Brad (1976- )",
          "Stepien, Bill",
          "Trump, Donald J",
          "Christie, Christopher J",
        ],
        geo_facet: ["New Jersey"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/politics/16stepien/merlin_174612870_cb4b73ba-0e78-422e-ac28-50c2b0eeee83-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Bill Stepien is replacing Brad Parscale as President Trump’s campaign manager.",
            copyright: "Amy Newman/The Record, via Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/politics/16stepien/16stepien-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Bill Stepien is replacing Brad Parscale as President Trump’s campaign manager.",
            copyright: "Amy Newman/The Record, via Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/politics/16stepien/16stepien-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Bill Stepien is replacing Brad Parscale as President Trump’s campaign manager.",
            copyright: "Amy Newman/The Record, via Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/politics/16stepien/merlin_174612870_cb4b73ba-0e78-422e-ac28-50c2b0eeee83-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Bill Stepien is replacing Brad Parscale as President Trump’s campaign manager.",
            copyright: "Amy Newman/The Record, via Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/us/politics/16stepien/merlin_174612870_cb4b73ba-0e78-422e-ac28-50c2b0eeee83-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Bill Stepien is replacing Brad Parscale as President Trump’s campaign manager.",
            copyright: "Amy Newman/The Record, via Associated Press",
          },
        ],
        short_url: "https://nyti.ms/2OyO3Ru",
      },
      {
        section: "us",
        subsection: "politics",
        title: "Who Were the Freedom Riders?",
        abstract:
          "Representative John Lewis was among the 13 original Freedom Riders, who encountered violence and resistance as they rode buses across the South, challenging the nation’s segregation laws.",
        url:
          "https://www.nytimes.com/2020/07/18/us/politics/freedom-riders-john-lewis-work.html",
        uri: "nyt://article/7d5cabed-0e4e-5574-81c2-06e2ef2a8c7b",
        byline: "By Derrick Bryson Taylor",
        item_type: "Article",
        updated_date: "2020-07-19T12:08:13-04:00",
        created_date: "2020-07-18T18:51:44-04:00",
        published_date: "2020-07-18T18:51:44-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Civil Rights and Liberties",
          "Civil Rights Movement (1954-68)",
          "Race and Ethnicity",
          "Segregation and Desegregation",
          "Discrimination",
          "Black People",
          "Buses",
        ],
        org_facet: [
          "Congress of Racial Equality",
          "Student Nonviolent Coordinating Committee (SNCC)",
        ],
        per_facet: ["Lewis, John R"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18xp-freedom-pix1/18xp-freedom-pix1-superJumbo.jpg",
            format: "superJumbo",
            height: 1789,
            width: 2000,
            type: "image",
            subtype: "photo",
            caption:
              "John Lewis, top left, was among the Freedom Riders who were arrested in Jackson, Miss., in May 1961, and hastily convicted of breach of peace.",
            copyright: "Mississippi Department of Archives and History",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18xp-freedom-pix1/18xp-freedom-pix1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "John Lewis, top left, was among the Freedom Riders who were arrested in Jackson, Miss., in May 1961, and hastily convicted of breach of peace.",
            copyright: "Mississippi Department of Archives and History",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18xp-freedom-pix1/18xp-freedom-pix1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "John Lewis, top left, was among the Freedom Riders who were arrested in Jackson, Miss., in May 1961, and hastily convicted of breach of peace.",
            copyright: "Mississippi Department of Archives and History",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18xp-freedom-pix1/18xp-freedom-pix1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "John Lewis, top left, was among the Freedom Riders who were arrested in Jackson, Miss., in May 1961, and hastily convicted of breach of peace.",
            copyright: "Mississippi Department of Archives and History",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18xp-freedom-pix1/18xp-freedom-pix1-articleInline.jpg",
            format: "Normal",
            height: 170,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "John Lewis, top left, was among the Freedom Riders who were arrested in Jackson, Miss., in May 1961, and hastily convicted of breach of peace.",
            copyright: "Mississippi Department of Archives and History",
          },
        ],
        short_url: "https://nyti.ms/3jiI6q3",
      },
      {
        section: "us",
        subsection: "",
        title: "John Lewis, Towering Figure of Civil Rights Era, Dies at 80",
        abstract:
          "Images of his beating at Selma shocked the nation and led to swift passage of the 1965 Voting Rights Act. He was later called the conscience of the Congress.",
        url: "https://www.nytimes.com/2020/07/17/us/john-lewis-dead.html",
        uri: "nyt://article/18f12052-849f-5228-b675-a6a9d05d8d9a",
        byline: "By Katharine Q. Seelye",
        item_type: "Article",
        updated_date: "2020-07-19T11:25:59-04:00",
        created_date: "2020-07-17T23:45:20-04:00",
        published_date: "2020-07-17T23:45:20-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Deaths (Obituaries)",
          "Civil Rights Movement (1954-68)",
          "United States Politics and Government",
          "Black People",
          "Race and Ethnicity",
        ],
        org_facet: ["House of Representatives"],
        per_facet: ["Lewis, John R"],
        geo_facet: ["Georgia"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/01/14/obituaries/14Lewis-John1-sub/merlin_166560153_c207f2db-7cc6-4567-94ab-58f4ce96db16-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1398,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Andrea Mohin",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/01/14/obituaries/14Lewis-John1-sub/14Lewis-John1-sub-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Andrea Mohin",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/01/14/obituaries/14Lewis-John1-sub/14Lewis-John1-sub-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Andrea Mohin",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/01/14/obituaries/14Lewis-John1-sub/14Lewis-John1-sub-mediumThreeByTwo210-v2.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Andrea Mohin",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/01/14/obituaries/14Lewis-John1-sub/merlin_166560153_c207f2db-7cc6-4567-94ab-58f4ce96db16-articleInline.jpg",
            format: "Normal",
            height: 278,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Andrea Mohin",
          },
        ],
        short_url: "https://nyti.ms/32xSLXY",
      },
      {
        section: "us",
        subsection: "",
        title:
          "Amid a Pandemic, Supporters Hope John Lewis Can Still Lie in State in the Capitol",
        abstract:
          "More than 40 people have lain in state in the Capitol after their deaths. Some in Congress want the civil rights icon and 17-term congressman to receive the honor, even as the building remains closed to the public.",
        url:
          "https://www.nytimes.com/2020/07/18/us/coronavirus-john-lewis-lie-in-state-capitol.html",
        uri: "nyt://article/f2ae3d9e-4a30-509c-80b5-58d0242171fa",
        byline: "By Luke Broadwater",
        item_type: "Article",
        updated_date: "2020-07-19T11:25:57-04:00",
        created_date: "2020-07-18T19:43:34-04:00",
        published_date: "2020-07-18T19:43:34-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "United States Politics and Government",
          "Coronavirus Risks and Safety Concerns",
        ],
        org_facet: ["Congressional Black Caucus"],
        per_facet: ["Lewis, John R"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-lie-in-state/merlin_163233945_dcb01cdc-9703-44ea-9f5c-a9b022ffd42b-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "The memorial service for Representative Elijah E. Cummings in 2019. The coronavirus pandemic has leaders in Congress considering how to safely honor Rep. John Lewis, an icon of the civil rights movement who died Friday.",
            copyright: "Erin Schaff/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-lie-in-state/merlin_163233945_dcb01cdc-9703-44ea-9f5c-a9b022ffd42b-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "The memorial service for Representative Elijah E. Cummings in 2019. The coronavirus pandemic has leaders in Congress considering how to safely honor Rep. John Lewis, an icon of the civil rights movement who died Friday.",
            copyright: "Erin Schaff/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-lie-in-state/merlin_163233945_dcb01cdc-9703-44ea-9f5c-a9b022ffd42b-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "The memorial service for Representative Elijah E. Cummings in 2019. The coronavirus pandemic has leaders in Congress considering how to safely honor Rep. John Lewis, an icon of the civil rights movement who died Friday.",
            copyright: "Erin Schaff/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-lie-in-state/merlin_163233945_dcb01cdc-9703-44ea-9f5c-a9b022ffd42b-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "The memorial service for Representative Elijah E. Cummings in 2019. The coronavirus pandemic has leaders in Congress considering how to safely honor Rep. John Lewis, an icon of the civil rights movement who died Friday.",
            copyright: "Erin Schaff/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/politics/18dc-lie-in-state/merlin_163233945_dcb01cdc-9703-44ea-9f5c-a9b022ffd42b-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "The memorial service for Representative Elijah E. Cummings in 2019. The coronavirus pandemic has leaders in Congress considering how to safely honor Rep. John Lewis, an icon of the civil rights movement who died Friday.",
            copyright: "Erin Schaff/The New York Times",
          },
        ],
        short_url: "https://nyti.ms/3eJ5nOy",
      },
      {
        section: "briefing",
        subsection: "",
        title: "11 of Our Best Weekend Reads",
        abstract:
          "Colin Powell. Lessons from a New Jersey city. Koalas with chlamydia. Changes in the publishing world. And more.",
        url:
          "https://www.nytimes.com/2020/07/17/briefing/11-of-our-best-weekend-reads.html",
        uri: "nyt://article/3010059a-7976-53ec-9ce1-87dae1588e02",
        byline: "By Jillian Rayfield",
        item_type: "Article",
        updated_date: "2020-07-19T11:25:59-04:00",
        created_date: "2020-07-17T12:19:59-04:00",
        published_date: "2020-07-17T12:19:59-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Coronavirus (2019-nCoV)",
          "Police Reform",
          "Race and Ethnicity",
          "Living Wills and Health Care Proxies",
          "Classical Music",
          "Sexually Transmitted Diseases",
        ],
        org_facet: ["National Football League"],
        per_facet: ["Powell, Colin L"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18weekend-reads-promo/18weekend-reads-promo-superJumbo.jpg",
            format: "superJumbo",
            height: 1334,
            width: 2000,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18weekend-reads-promo/18weekend-reads-promo-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18weekend-reads-promo/18weekend-reads-promo-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18weekend-reads-promo/18weekend-reads-promo-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18weekend-reads-promo/18weekend-reads-promo-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
        ],
        short_url: "https://nyti.ms/30pFI8e",
      },
      {
        section: "briefing",
        subsection: "",
        title: "News Quiz: China, Twitter, Disney",
        abstract: "Did you follow the headlines this week?",
        url:
          "https://www.nytimes.com/interactive/2020/07/17/briefing/china-twitter-disney-news-quiz.html",
        uri: "nyt://interactive/26d3ee2c-2968-5d03-815d-a448d44be4f1",
        byline:
          "Compiled by Will Dudding, Jessica Anderson and Anna Schaverien",
        item_type: "Interactive",
        updated_date: "2020-07-19T11:25:57-04:00",
        created_date: "2020-07-17T03:30:01-04:00",
        published_date: "2020-07-17T03:30:01-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/business/17newsquiz-db-newsletter-twitter/merlin_172428240_d547c793-b1c0-49da-b2c6-71935f2fafc6-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Glenn Chapman/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/business/17newsquiz-db-newsletter-twitter/merlin_172428240_d547c793-b1c0-49da-b2c6-71935f2fafc6-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Glenn Chapman/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/business/17newsquiz-db-newsletter-twitter/merlin_172428240_d547c793-b1c0-49da-b2c6-71935f2fafc6-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Glenn Chapman/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/business/17newsquiz-db-newsletter-twitter/merlin_172428240_d547c793-b1c0-49da-b2c6-71935f2fafc6-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Glenn Chapman/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/business/17newsquiz-db-newsletter-twitter/merlin_172428240_d547c793-b1c0-49da-b2c6-71935f2fafc6-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Glenn Chapman/Agence France-Presse — Getty Images",
          },
        ],
        short_url: "https://nyti.ms/2WvySgx",
      },
      {
        section: "briefing",
        subsection: "",
        title:
          "Coronavirus Surge, John Lewis, Fall Gardens: Your Weekend Briefing",
        abstract: "Here’s what you need to know about the week’s top stories.",
        url:
          "https://www.nytimes.com/2020/07/19/briefing/coronavirus-surge-john-lewis-fall-gardens.html",
        uri: "nyt://article/944c6f37-ab4f-570b-a5a8-f75d83f4dcb7",
        byline: "By Remy Tumin and Elijah Walker",
        item_type: "Article",
        updated_date: "2020-07-19T07:30:07-04:00",
        created_date: "2020-07-19T06:20:50-04:00",
        published_date: "2020-07-19T06:20:50-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/briefing/19weekend-briefing-promo/19weekend-briefing-slide-SV2M-superJumbo.jpg",
            format: "superJumbo",
            height: 1423,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Joshua Lott for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/briefing/19weekend-briefing-promo/19weekend-briefing-slide-SV2M-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Joshua Lott for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/briefing/19weekend-briefing-promo/19weekend-briefing-slide-SV2M-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Joshua Lott for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/briefing/19weekend-briefing-promo/19weekend-briefing-slide-SV2M-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Joshua Lott for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/briefing/19weekend-briefing-promo/19weekend-briefing-slide-SV2M-articleInline.jpg",
            format: "Normal",
            height: 132,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Joshua Lott for The New York Times",
          },
        ],
        short_url: "https://nyti.ms/2ZFIPd6",
      },
      {
        section: "podcasts",
        subsection: "the-daily",
        title: "The Man Who Cracked the Lottery",
        abstract:
          "This a story about mortality — about our greed, hubris and, ultimately, humility.",
        url:
          "https://www.nytimes.com/2020/07/19/podcasts/the-daily/lottery-winner-scam.html",
        uri: "nyt://article/c8d3c9b4-d18a-5369-928c-5b177fcc658f",
        byline: "",
        item_type: "Article",
        updated_date: "2020-07-19T12:49:57-04:00",
        created_date: "2020-07-19T09:00:07-04:00",
        published_date: "2020-07-19T09:00:07-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Lotteries"],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2018/05/05/magazine/31audm-image/05mag-lottery-image1-superJumbo-v2.png",
            format: "superJumbo",
            height: 2048,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Illustration by Francesco Francavilla",
          },
          {
            url:
              "https://static01.nyt.com/images/2018/05/05/magazine/31audm-image/05mag-lottery-image1-thumbStandard-v4.png",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Illustration by Francesco Francavilla",
          },
          {
            url:
              "https://static01.nyt.com/images/2018/05/05/magazine/31audm-image/05mag-lottery-image1-thumbLarge-v4.png",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Illustration by Francesco Francavilla",
          },
          {
            url:
              "https://static01.nyt.com/images/2018/05/05/magazine/31audm-image/05mag-lottery-image1-mediumThreeByTwo210-v4.png",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Illustration by Francesco Francavilla",
          },
          {
            url:
              "https://static01.nyt.com/images/2018/05/05/magazine/31audm-image/05mag-lottery-image1-articleInline-v2.png",
            format: "Normal",
            height: 190,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Illustration by Francesco Francavilla",
          },
        ],
        short_url: "https://nyti.ms/399BEgq",
      },
      {
        section: "podcasts",
        subsection: "",
        title: "One: Wonderland",
        abstract:
          "A young man finds escape on the internet. He doesn’t realize that on the other side of the screen, a force is pulling him in.",
        url:
          "https://www.nytimes.com/2020/04/16/podcasts/rabbit-hole-internet-youtube-virus.html",
        uri: "nyt://article/8c90210c-1d8f-51fe-a8da-81807f1d265f",
        byline: "",
        item_type: "Article",
        updated_date: "2020-07-19T12:49:56-04:00",
        created_date: "2020-04-16T15:34:02-04:00",
        published_date: "2020-04-16T15:34:02-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Podcasts",
          "Science and Technology",
          "Computers and the Internet",
        ],
        org_facet: ["New York Times", "YouTube.com"],
        per_facet: ["Cain, Caleb"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/05/30/podcasts/rabbit-hole-album-art-article-pages/rabbit-hole-album-art-article-pages-superJumbo-v3.jpg",
            format: "superJumbo",
            height: 956,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/05/30/podcasts/rabbit-hole-album-art-article-pages/rabbit-hole-album-art-article-pages-thumbStandard-v4.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/05/30/podcasts/rabbit-hole-album-art-article-pages/rabbit-hole-album-art-article-pages-thumbLarge-v4.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/05/30/podcasts/rabbit-hole-album-art-article-pages/rabbit-hole-album-art-article-pages-mediumThreeByTwo210-v3.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/05/30/podcasts/rabbit-hole-album-art-article-pages/rabbit-hole-album-art-article-pages-articleInline-v3.jpg",
            format: "Normal",
            height: 89,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The New York Times",
          },
        ],
        short_url: "https://nyti.ms/2RMl9zA",
      },
      {
        section: "technology",
        subsection: "",
        title: "The Pandemic Is Straining Airbnb",
        abstract: "For a start-up, not growing is basically the same as dying.",
        url:
          "https://www.nytimes.com/2020/07/17/technology/airbnb-coronavirus.html",
        uri: "nyt://article/51a07ca2-59e5-5e72-bfdf-082f9c8e1463",
        byline: "By Shira Ovide",
        item_type: "Article",
        updated_date: "2020-07-19T12:49:56-04:00",
        created_date: "2020-07-17T13:19:31-04:00",
        published_date: "2020-07-17T13:19:31-04:00",
        material_type_facet: "",
        kicker: "On Tech",
        des_facet: [
          "Travel and Vacations",
          "Coronavirus (2019-nCoV)",
          "Start-ups",
        ],
        org_facet: ["Airbnb"],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/business/17ontech/17ontech-superJumbo-v9.jpg",
            format: "superJumbo",
            height: 1082,
            width: 1622,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Shawna X",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/business/17ontech/17ontech-thumbStandard-v3.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Shawna X",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/business/17ontech/17ontech-thumbLarge-v3.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Shawna X",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/business/17ontech/17ontech-mediumThreeByTwo210-v2.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Shawna X",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/business/17ontech/17ontech-articleInline-v2.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Shawna X",
          },
        ],
        short_url: "https://nyti.ms/3jfTDX6",
      },
      {
        section: "sunday-review",
        subsection: "",
        title: "Your Ancestors Knew Death in Ways You Never Will",
        abstract:
          "Some say we’re doomed. But science and public spending have saved us from pandemics worse than this one.",
        url:
          "https://www.nytimes.com/2020/07/15/sunday-review/coronavirus-history-pandemics.html",
        uri: "nyt://article/b31ff489-c6e8-5568-8f6a-690fa97569f7",
        byline: "By Donald G. McNeil Jr.",
        item_type: "Article",
        updated_date: "2020-07-19T12:34:18-04:00",
        created_date: "2020-07-15T05:00:14-04:00",
        published_date: "2020-07-15T05:00:14-04:00",
        material_type_facet: "",
        kicker: "news analysis",
        des_facet: [
          "Epidemics",
          "Deaths (Fatalities)",
          "Coronavirus (2019-nCoV)",
          "Quarantines",
          "Death and Dying",
          "Plague",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: ["New York City", "United States"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/15/opinion/sunday/15McNeil2/15McNeil2-superJumbo.jpg",
            format: "superJumbo",
            height: 1519,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "A depiction by the 17th-century painter Nicolas Poussin of a plague described in the Book of Samuel.",
            copyright: "G. Dagli Orti/De Agostini, via Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/15/opinion/sunday/15McNeil2/15McNeil2-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "A depiction by the 17th-century painter Nicolas Poussin of a plague described in the Book of Samuel.",
            copyright: "G. Dagli Orti/De Agostini, via Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/15/opinion/sunday/15McNeil2/15McNeil2-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "A depiction by the 17th-century painter Nicolas Poussin of a plague described in the Book of Samuel.",
            copyright: "G. Dagli Orti/De Agostini, via Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/15/opinion/sunday/15McNeil2/15McNeil2-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "A depiction by the 17th-century painter Nicolas Poussin of a plague described in the Book of Samuel.",
            copyright: "G. Dagli Orti/De Agostini, via Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/15/opinion/sunday/15McNeil2/15McNeil2-articleInline.jpg",
            format: "Normal",
            height: 141,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "A depiction by the 17th-century painter Nicolas Poussin of a plague described in the Book of Samuel.",
            copyright: "G. Dagli Orti/De Agostini, via Getty Images",
          },
        ],
        short_url: "https://nyti.ms/32iMejO",
      },
      {
        section: "opinion",
        subsection: "sunday",
        title: "The Doctor Versus the Denier",
        abstract: "Anthony Fauci’s at the pool, but Donald Trump’s in deep.",
        url:
          "https://www.nytimes.com/2020/07/18/opinion/sunday/fauci-trump-coronavirus.html",
        uri: "nyt://article/857390fd-ded9-509d-b4fd-2064ea037b06",
        byline: "By Maureen Dowd",
        item_type: "Article",
        updated_date: "2020-07-19T12:34:16-04:00",
        created_date: "2020-07-18T11:16:06-04:00",
        published_date: "2020-07-18T11:16:06-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Coronavirus (2019-nCoV)", "Coronavirus Reopenings"],
        org_facet: [],
        per_facet: ["Fauci, Anthony S", "Trump, Donald J", "Navarro, Peter"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19Dowd/merlin_174082506_adbfb907-7c17-4002-93c8-e705007d2dab-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Dr. Anthony Fauci trusts science, making him a White House outcast.",
            copyright: "Pool photo by Al Drago",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19Dowd/19Dowd-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Dr. Anthony Fauci trusts science, making him a White House outcast.",
            copyright: "Pool photo by Al Drago",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19Dowd/19Dowd-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Dr. Anthony Fauci trusts science, making him a White House outcast.",
            copyright: "Pool photo by Al Drago",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19Dowd/merlin_174082506_adbfb907-7c17-4002-93c8-e705007d2dab-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Dr. Anthony Fauci trusts science, making him a White House outcast.",
            copyright: "Pool photo by Al Drago",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19Dowd/merlin_174082506_adbfb907-7c17-4002-93c8-e705007d2dab-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Dr. Anthony Fauci trusts science, making him a White House outcast.",
            copyright: "Pool photo by Al Drago",
          },
        ],
        short_url: "https://nyti.ms/30sDbKH",
      },
      {
        section: "opinion",
        subsection: "sunday",
        title: "We Interrupt This Gloom to Offer … Hope",
        abstract: "Yes, America is suffering needlessly. That may save us.",
        url:
          "https://www.nytimes.com/2020/07/16/opinion/sunday/coronavirus-blm-america-hope.html",
        uri: "nyt://article/f9c8dddc-af6a-56f6-9a56-ccaf2e8c41a2",
        byline: "By Nicholas Kristof",
        item_type: "Article",
        updated_date: "2020-07-19T12:34:20-04:00",
        created_date: "2020-07-16T11:00:09-04:00",
        published_date: "2020-07-16T11:00:09-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "United States Politics and Government",
          "Black People",
          "Polls and Public Opinion",
          "Race and Ethnicity",
          "Coronavirus (2019-nCoV)",
          "Recession and Depression",
          "States (US)",
          "Health Insurance and Managed Care",
          "Welfare (US)",
          "Income Inequality",
        ],
        org_facet: [],
        per_facet: ["Biden, Joseph R Jr", "Trump, Donald J"],
        geo_facet: ["United States"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/20/opinion/sunday/20kristof/19kristof-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1691,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright:
              "Illustration by Nicolas Ortega; Photograph from Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/20/opinion/sunday/20kristof/19kristof-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright:
              "Illustration by Nicolas Ortega; Photograph from Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/20/opinion/sunday/20kristof/19kristof-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright:
              "Illustration by Nicolas Ortega; Photograph from Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/20/opinion/sunday/20kristof/19kristof-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright:
              "Illustration by Nicolas Ortega; Photograph from Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/20/opinion/sunday/20kristof/19kristof-articleInline.jpg",
            format: "Normal",
            height: 230,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright:
              "Illustration by Nicolas Ortega; Photograph from Getty Images",
          },
        ],
        short_url: "https://nyti.ms/3h0YSIc",
      },
      {
        section: "opinion",
        subsection: "sunday",
        title: "The Real White Fragility",
        abstract:
          "Does the white upper class feel exhausted and oppressed by meritocracy?",
        url:
          "https://www.nytimes.com/2020/07/18/opinion/sunday/white-fragility-meritocracy.html",
        uri: "nyt://article/0aa9526d-e008-567a-aef8-0242da329dd2",
        byline: "By Ross Douthat",
        item_type: "Article",
        updated_date: "2020-07-19T12:34:18-04:00",
        created_date: "2020-07-18T15:01:37-04:00",
        published_date: "2020-07-18T15:01:37-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Colleges and Universities",
          "Admissions Standards",
          "Race and Ethnicity",
          "Whites",
          "Discrimination",
        ],
        org_facet: [],
        per_facet: ["Brooks, David"],
        geo_facet: ["United States"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19Douthat/19Douthat-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "The Columbia University campus in Manhattan.",
            copyright: "Hiroko Masuike/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19Douthat/19Douthat-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "The Columbia University campus in Manhattan.",
            copyright: "Hiroko Masuike/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19Douthat/19Douthat-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "The Columbia University campus in Manhattan.",
            copyright: "Hiroko Masuike/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19Douthat/19Douthat-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "The Columbia University campus in Manhattan.",
            copyright: "Hiroko Masuike/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19Douthat/19Douthat-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "The Columbia University campus in Manhattan.",
            copyright: "Hiroko Masuike/The New York Times",
          },
        ],
        short_url: "https://nyti.ms/3jmcDUa",
      },
      {
        section: "opinion",
        subsection: "",
        title: "If the Church Door Is Closed, Find the Sacred on the Road",
        abstract:
          "The pandemic has scattered us from our communal rituals. But that isn’t where our journey should end.",
        url:
          "https://www.nytimes.com/2020/07/19/opinion/if-the-church-door-is-closed-find-the-sacred-on-the-road.html",
        uri: "nyt://article/404624e4-69ec-5310-9b28-4f66a8acc964",
        byline: "By Emily M.D. Scott",
        item_type: "Article",
        updated_date: "2020-07-19T12:34:17-04:00",
        created_date: "2020-07-19T11:00:07-04:00",
        published_date: "2020-07-19T11:00:07-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Bread",
          "Coronavirus (2019-nCoV)",
          "Christians and Christianity",
          "Religion and Belief",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19scott1/merlin_109705606_62988d08-1ee8-4ff0-b0b6-90dff312d14b-superJumbo.jpg",
            format: "superJumbo",
            height: 1368,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Todd Heisler/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19scott1/19scott1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Todd Heisler/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19scott1/19scott1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Todd Heisler/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19scott1/19scott1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Todd Heisler/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/opinion/19scott1/merlin_109705606_62988d08-1ee8-4ff0-b0b6-90dff312d14b-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Todd Heisler/The New York Times",
          },
        ],
        short_url: "https://nyti.ms/3eFmaC9",
      },
      {
        section: "opinion",
        subsection: "sunday",
        title: "Doing Schoolwork in the Parking Lot Is Not a Solution",
        abstract:
          "In a pandemic-plagued country, high-speed internet connections are a civil rights issue.",
        url:
          "https://www.nytimes.com/2020/07/18/opinion/sunday/broadband-internet-access-civil-rights.html",
        uri: "nyt://article/379a8031-f5f0-5a57-81df-3adbd8622cb4",
        byline: "By The Editorial Board",
        item_type: "Article",
        updated_date: "2020-07-19T12:34:20-04:00",
        created_date: "2020-07-18T14:44:29-04:00",
        published_date: "2020-07-18T14:44:29-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Computers and the Internet",
          "Rural Areas",
          "Quarantines",
          "Coronavirus (2019-nCoV)",
          "Education (K-12)",
          "Buses",
          "Law and Legislation",
          "Wireless Communications",
        ],
        org_facet: ["Federal Communications Commission"],
        per_facet: ["Clyburn, James E", "Upton, Fred"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18broad1/merlin_172041402_6fd6bcc5-e5e1-4386-b8f2-5607309ccc69-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "A kindergarten teacher accessing the internet from the parking lot of her school in Port Angeles, Wash.",
            copyright: "Ruth Fremson/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18broad1/18broad1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "A kindergarten teacher accessing the internet from the parking lot of her school in Port Angeles, Wash.",
            copyright: "Ruth Fremson/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18broad1/18broad1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "A kindergarten teacher accessing the internet from the parking lot of her school in Port Angeles, Wash.",
            copyright: "Ruth Fremson/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18broad1/merlin_172041402_6fd6bcc5-e5e1-4386-b8f2-5607309ccc69-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "A kindergarten teacher accessing the internet from the parking lot of her school in Port Angeles, Wash.",
            copyright: "Ruth Fremson/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18broad1/merlin_172041402_6fd6bcc5-e5e1-4386-b8f2-5607309ccc69-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "A kindergarten teacher accessing the internet from the parking lot of her school in Port Angeles, Wash.",
            copyright: "Ruth Fremson/The New York Times",
          },
        ],
        short_url: "https://nyti.ms/32vzkyW",
      },
      {
        section: "opinion",
        subsection: "",
        title: "Testing Is on the Brink of Paralysis. That’s Very Bad News.",
        abstract:
          "Our pandemic fight requires prompt testing results — and singular cooperation among the states to achieve them.",
        url:
          "https://www.nytimes.com/2020/07/16/opinion/coronavirus-testing-us.html",
        uri: "nyt://article/56b0a492-9731-55b8-ac48-be3d758b2389",
        byline: "By Margaret Bourdeaux, Beth Cameron and Jonathan Zittrain",
        item_type: "Article",
        updated_date: "2020-07-19T12:34:21-04:00",
        created_date: "2020-07-16T05:00:16-04:00",
        published_date: "2020-07-16T05:00:16-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "States (US)",
          "Federal-State Relations (US)",
          "Coronavirus (2019-nCoV)",
          "Governors (US)",
          "Contact Tracing (Public Health)",
          "Tests (Medical)",
        ],
        org_facet: [
          "Broad Institute",
          "Laboratory Corporation of America Holdings",
          "Quest Diagnostics Inc",
        ],
        per_facet: [
          "Bottoms, Keisha Lance",
          "Mulvaney, Mick",
          "Pence, Mike",
          "Trump, Donald J",
        ],
        geo_facet: ["United States"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/opinion/14zittrain/merlin_174305244_e1b01acb-00fe-41a0-84da-f69670293ced-superJumbo.jpg",
            format: "superJumbo",
            height: 1343,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Drivers waiting to be tested for the coronavirus at the Hard Rock Stadium parking lot in Miami Gardens, Fla., last week.",
            copyright: "Joe Raedle/Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/opinion/14zittrain/14zittrain-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Drivers waiting to be tested for the coronavirus at the Hard Rock Stadium parking lot in Miami Gardens, Fla., last week.",
            copyright: "Joe Raedle/Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/opinion/14zittrain/14zittrain-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Drivers waiting to be tested for the coronavirus at the Hard Rock Stadium parking lot in Miami Gardens, Fla., last week.",
            copyright: "Joe Raedle/Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/opinion/14zittrain/14zittrain-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Drivers waiting to be tested for the coronavirus at the Hard Rock Stadium parking lot in Miami Gardens, Fla., last week.",
            copyright: "Joe Raedle/Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/opinion/14zittrain/merlin_174305244_e1b01acb-00fe-41a0-84da-f69670293ced-articleInline.jpg",
            format: "Normal",
            height: 125,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Drivers waiting to be tested for the coronavirus at the Hard Rock Stadium parking lot in Miami Gardens, Fla., last week.",
            copyright: "Joe Raedle/Getty Images",
          },
        ],
        short_url: "https://nyti.ms/2C7hhof",
      },
      {
        section: "opinion",
        subsection: "",
        title: "John Lewis Risked His Life for Justice",
        abstract:
          "His willingness to do so was essential to the quest for civil rights.",
        url: "https://www.nytimes.com/2020/07/17/opinion/john-lewis.html",
        uri: "nyt://article/8e209b53-c72e-5f28-92d7-c9fce45565b9",
        byline: "By The Editorial Board",
        item_type: "Article",
        updated_date: "2020-07-19T12:34:23-04:00",
        created_date: "2020-07-17T23:51:16-04:00",
        published_date: "2020-07-17T23:51:16-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Civil Rights Movement (1954-68)",
          "Black People",
          "Voting Rights Act (1965)",
          "Race and Ethnicity",
          "Voter Registration and Requirements",
        ],
        org_facet: [
          "Ku Klux Klan",
          "Student Nonviolent Coordinating Committee (SNCC)",
          "Supreme Court (US)",
        ],
        per_facet: ["Lewis, John R"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/opinion/00LewisEditorial/00LewisEditorial-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1948,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright:
              "Illustration by Nicholas Konrad/The New York Times; photograph by Nashville Police Department",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/opinion/00LewisEditorial/00LewisEditorial-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright:
              "Illustration by Nicholas Konrad/The New York Times; photograph by Nashville Police Department",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/opinion/00LewisEditorial/00LewisEditorial-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright:
              "Illustration by Nicholas Konrad/The New York Times; photograph by Nashville Police Department",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/opinion/00LewisEditorial/00LewisEditorial-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright:
              "Illustration by Nicholas Konrad/The New York Times; photograph by Nashville Police Department",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/opinion/00LewisEditorial/00LewisEditorial-articleInline.jpg",
            format: "Normal",
            height: 200,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright:
              "Illustration by Nicholas Konrad/The New York Times; photograph by Nashville Police Department",
          },
        ],
        short_url: "https://nyti.ms/2WNdNyn",
      },
      {
        section: "opinion",
        subsection: "",
        title: "The First Time John Lewis and I Integrated the Buses",
        abstract:
          "We just got on and sat in the front row. The bus driver insisted that we move to the back. But we didn’t move.",
        url: "https://www.nytimes.com/2020/07/18/opinion/john-lewis-dead.html",
        uri: "nyt://article/3a6d288a-9703-58ad-86a3-072b0a3e7b73",
        byline: "By Bernard Lafayette Jr.",
        item_type: "Article",
        updated_date: "2020-07-19T12:34:23-04:00",
        created_date: "2020-07-18T13:04:25-04:00",
        published_date: "2020-07-18T13:04:25-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Civil Rights Movement (1954-68)",
          "Black People",
          "Buses",
          "Segregation and Desegregation",
        ],
        org_facet: ["Student Nonviolent Coordinating Committee (SNCC)"],
        per_facet: ["Lewis, John R"],
        geo_facet: ["Southern States (US)"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18lafayette-3/merlin_166560168_68b3fdf0-d945-4d61-aa52-bb4ec9556efc-superJumbo.jpg",
            format: "superJumbo",
            height: 1354,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "John Lewis in 1967.",
            copyright: "Sam Falk/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18lafayette-3/18lafayette-3-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "John Lewis in 1967.",
            copyright: "Sam Falk/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18lafayette-3/18lafayette-3-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "John Lewis in 1967.",
            copyright: "Sam Falk/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18lafayette-3/18lafayette-3-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "John Lewis in 1967.",
            copyright: "Sam Falk/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18lafayette-3/merlin_166560168_68b3fdf0-d945-4d61-aa52-bb4ec9556efc-articleInline.jpg",
            format: "Normal",
            height: 126,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "John Lewis in 1967.",
            copyright: "Sam Falk/The New York Times",
          },
        ],
        short_url: "https://nyti.ms/30pJtKX",
      },
      {
        section: "opinion",
        subsection: "sunday",
        title: "Please Don’t Make Me Risk Getting Covid-19 to Teach Your Child",
        abstract: "If I’m asked to return, I’ll have to walk away.",
        url:
          "https://www.nytimes.com/2020/07/18/opinion/sunday/covid-schools-reopen-teacher-safety.html",
        uri: "nyt://article/abd7cf55-3363-5c57-9f25-734d72ce6530",
        byline: "By Rebecca Martinson",
        item_type: "Article",
        updated_date: "2020-07-19T12:34:22-04:00",
        created_date: "2020-07-18T11:18:42-04:00",
        published_date: "2020-07-18T11:18:42-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "E-Learning",
          "School Shootings and Armed Attacks",
          "Coronavirus (2019-nCoV)",
          "Coronavirus Reopenings",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18Martinson/merlin_174054975_9f48fae7-d46d-487e-a3af-5119c5f3162b-superJumbo.jpg",
            format: "superJumbo",
            height: 1364,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "A teacher entering a classroom on June 29 to collect her belongings left behind before schools in New York were shut down in March.",
            copyright: "Michael Loccisano/Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18Martinson/18Martinson-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "A teacher entering a classroom on June 29 to collect her belongings left behind before schools in New York were shut down in March.",
            copyright: "Michael Loccisano/Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18Martinson/18Martinson-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "A teacher entering a classroom on June 29 to collect her belongings left behind before schools in New York were shut down in March.",
            copyright: "Michael Loccisano/Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18Martinson/18Martinson-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "A teacher entering a classroom on June 29 to collect her belongings left behind before schools in New York were shut down in March.",
            copyright: "Michael Loccisano/Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/opinion/18Martinson/merlin_174054975_9f48fae7-d46d-487e-a3af-5119c5f3162b-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "A teacher entering a classroom on June 29 to collect her belongings left behind before schools in New York were shut down in March.",
            copyright: "Michael Loccisano/Getty Images",
          },
        ],
        short_url: "https://nyti.ms/30o8OFg",
      },
      {
        section: "books",
        subsection: "review",
        title: "Why Intellectuals Support Dictators",
        abstract:
          "Anne Applebaum’s “Twilight of Democracy” examines the role of thinkers and writers who back modern authoritarians.",
        url:
          "https://www.nytimes.com/2020/07/19/books/review/twilight-of-democracy-anne-applebaum.html",
        uri: "nyt://article/4de0587e-870d-58a7-833c-444c64bd2aaf",
        byline: "By Bill Keller",
        item_type: "Article",
        updated_date: "2020-07-19T05:02:38-04:00",
        created_date: "2020-07-19T05:00:04-04:00",
        published_date: "2020-07-19T05:00:04-04:00",
        material_type_facet: "",
        kicker: "nonfiction",
        des_facet: [
          "Books and Literature",
          "Politics and Government",
          "Democracy (Theory and Philosophy)",
          "Twilight of Democracy: The Seductive Lure of the Authoritarian State (Book)",
        ],
        org_facet: ["Law and Justice (Poland)"],
        per_facet: ["Applebaum, Anne", "Soros, George"],
        geo_facet: ["Poland"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/08/02/books/review/02Keller/Keller-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "The Polish presidential campaign, May 2015.",
            copyright: "Wojtek Radwansky/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/02/books/review/02Keller/Keller-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "The Polish presidential campaign, May 2015.",
            copyright: "Wojtek Radwansky/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/02/books/review/02Keller/Keller-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "The Polish presidential campaign, May 2015.",
            copyright: "Wojtek Radwansky/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/02/books/review/02Keller/Keller-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "The Polish presidential campaign, May 2015.",
            copyright: "Wojtek Radwansky/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/02/books/review/02Keller/Keller-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "The Polish presidential campaign, May 2015.",
            copyright: "Wojtek Radwansky/Agence France-Presse — Getty Images",
          },
        ],
        short_url: "https://nyti.ms/30otBZ7",
      },
      {
        section: "nyregion",
        subsection: "",
        title: "Citi Bikes, Scooters, Skateboards: Anything but the Subway",
        abstract:
          "Some New Yorkers, still nervous about public transit, are getting around town in the fresh air, regardless of how long it takes.",
        url:
          "https://www.nytimes.com/2020/07/17/nyregion/coronavirus-subways-spread-nyc.html",
        uri: "nyt://article/4dc6e507-e9fc-5f0a-ac65-40cc913485ca",
        byline: "By Alyson Krueger",
        item_type: "Article",
        updated_date: "2020-07-19T12:57:13-04:00",
        created_date: "2020-07-17T05:00:37-04:00",
        published_date: "2020-07-17T05:00:37-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Bicycles and Bicycling",
          "Subways",
          "Coronavirus (2019-nCoV)",
          "Ferries",
          "Walking",
          "Skateboarding",
          "Motorcycles, Motor Bikes and Motorscooters",
          "Commuting",
        ],
        org_facet: ["Citi Bike", "Revel Transit Inc"],
        per_facet: [],
        geo_facet: ["New York City"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/nyregion/19nyvirus-commute-1/17nyvirus-commute-1-superJumbo.jpg",
            format: "superJumbo",
            height: 1366,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Megan Scruggs will often rent an electric moped to get her where she needs to go. Or at least part of the way.",
            copyright: "Amir Hamja for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/nyregion/19nyvirus-commute-1/17nyvirus-commute-1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Megan Scruggs will often rent an electric moped to get her where she needs to go. Or at least part of the way.",
            copyright: "Amir Hamja for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/nyregion/19nyvirus-commute-1/17nyvirus-commute-1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Megan Scruggs will often rent an electric moped to get her where she needs to go. Or at least part of the way.",
            copyright: "Amir Hamja for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/nyregion/19nyvirus-commute-1/17nyvirus-commute-1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Megan Scruggs will often rent an electric moped to get her where she needs to go. Or at least part of the way.",
            copyright: "Amir Hamja for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/nyregion/19nyvirus-commute-1/17nyvirus-commute-1-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Megan Scruggs will often rent an electric moped to get her where she needs to go. Or at least part of the way.",
            copyright: "Amir Hamja for The New York Times",
          },
        ],
        short_url: "https://nyti.ms/32qz2cI",
      },
      {
        section: "us",
        subsection: "",
        title: "How I Came Out About My Disability",
        abstract:
          "Three writers share how they revealed their disability, to a family member, to a love interest on a dating app and to oneself.",
        url: "https://www.nytimes.com/2020/07/13/us/disability-reveal.html",
        uri: "nyt://article/4b002419-c6c3-5b5a-b191-1f90dbdbb548",
        byline: "",
        item_type: "Article",
        updated_date: "2020-07-19T05:02:42-04:00",
        created_date: "2020-07-13T10:50:09-04:00",
        published_date: "2020-07-13T10:50:09-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Autism",
          "Disabilities",
          "Writing and Writers",
          "Prostheses",
          "Homosexuality and Bisexuality",
          "Americans With Disabilities Act",
        ],
        org_facet: [],
        per_facet: ["Hoang, Helen", "Haddad, Ryan J", "Chambrot, Krysten"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/multimedia/14ADA-Coming-Out-01/14ADA-Coming-Out-01-superJumbo.jpg",
            format: "superJumbo",
            height: 1551,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Helen Hoang, a romance novelist, outside her home in San Diego, Calif. She explains how she practiced masking, in which autistic people hide their autistic traits to better fit in with society.",
            copyright: "John Francis Peters for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/multimedia/14ADA-Coming-Out-01/14ADA-Coming-Out-01-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Helen Hoang, a romance novelist, outside her home in San Diego, Calif. She explains how she practiced masking, in which autistic people hide their autistic traits to better fit in with society.",
            copyright: "John Francis Peters for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/multimedia/14ADA-Coming-Out-01/14ADA-Coming-Out-01-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Helen Hoang, a romance novelist, outside her home in San Diego, Calif. She explains how she practiced masking, in which autistic people hide their autistic traits to better fit in with society.",
            copyright: "John Francis Peters for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/multimedia/14ADA-Coming-Out-01/14ADA-Coming-Out-01-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Helen Hoang, a romance novelist, outside her home in San Diego, Calif. She explains how she practiced masking, in which autistic people hide their autistic traits to better fit in with society.",
            copyright: "John Francis Peters for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/multimedia/14ADA-Coming-Out-01/14ADA-Coming-Out-01-articleInline.jpg",
            format: "Normal",
            height: 144,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Helen Hoang, a romance novelist, outside her home in San Diego, Calif. She explains how she practiced masking, in which autistic people hide their autistic traits to better fit in with society.",
            copyright: "John Francis Peters for The New York Times",
          },
        ],
        short_url: "https://nyti.ms/3gSGS2Q",
      },
      {
        section: "health",
        subsection: "",
        title:
          "Older Children Spread the Coronavirus Just as Much as Adults, Large Study Finds",
        abstract:
          "The study of nearly 65,000 people in South Korea suggests that school reopenings will trigger more outbreaks.",
        url:
          "https://www.nytimes.com/2020/07/18/health/coronavirus-children-schools.html",
        uri: "nyt://article/3714c13c-68e8-5002-8c75-b0f29941728f",
        byline: "By Apoorva Mandavilli",
        item_type: "Article",
        updated_date: "2020-07-19T12:43:15-04:00",
        created_date: "2020-07-18T14:46:10-04:00",
        published_date: "2020-07-18T14:46:10-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Education (K-12)",
          "Coronavirus Reopenings",
          "Shutdowns (Institutional)",
          "Quarantines",
          "Coronavirus (2019-nCoV)",
          "Disease Rates",
          "Children and Childhood",
          "Teenagers and Adolescence",
          "Teachers and School Employees",
          "Research",
          "your-feed-science",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: ["South Korea"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/science/18virus--kids/merlin_174135054_aed03bad-4e4b-4a8f-8ee7-b89113da5478-superJumbo.jpg",
            format: "superJumbo",
            height: 1212,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Students, parents and teachers of Cheondong Elementary School in Daejeon, South Korea, got tested in early July after two students were found to be infected with the virus.",
            copyright: "Yonhap, via EPA, via Shutterstock",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/science/18virus--kids/merlin_174135054_aed03bad-4e4b-4a8f-8ee7-b89113da5478-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Students, parents and teachers of Cheondong Elementary School in Daejeon, South Korea, got tested in early July after two students were found to be infected with the virus.",
            copyright: "Yonhap, via EPA, via Shutterstock",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/science/18virus--kids/merlin_174135054_aed03bad-4e4b-4a8f-8ee7-b89113da5478-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Students, parents and teachers of Cheondong Elementary School in Daejeon, South Korea, got tested in early July after two students were found to be infected with the virus.",
            copyright: "Yonhap, via EPA, via Shutterstock",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/science/18virus--kids/merlin_174135054_aed03bad-4e4b-4a8f-8ee7-b89113da5478-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Students, parents and teachers of Cheondong Elementary School in Daejeon, South Korea, got tested in early July after two students were found to be infected with the virus.",
            copyright: "Yonhap, via EPA, via Shutterstock",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/science/18virus--kids/merlin_174135054_aed03bad-4e4b-4a8f-8ee7-b89113da5478-articleInline.jpg",
            format: "Normal",
            height: 112,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Students, parents and teachers of Cheondong Elementary School in Daejeon, South Korea, got tested in early July after two students were found to be infected with the virus.",
            copyright: "Yonhap, via EPA, via Shutterstock",
          },
        ],
        short_url: "https://nyti.ms/3jpd7cb",
      },
      {
        section: "us",
        subsection: "",
        title:
          "2 Republican Senators Post Photos of Elijah Cummings in John Lewis Tributes",
        abstract:
          "Marco Rubio and Dan Sullivan were each trying to honor Mr. Lewis on social media when they mistakenly posted photos of Mr. Cummings, a Black congressman who died in October.",
        url:
          "https://www.nytimes.com/2020/07/18/us/marco-rubio-elijah-cummings-john-lewis.html",
        uri: "nyt://article/af9ca12f-dd0a-5d35-90fe-ed003c75512e",
        byline: "By Christina Morales",
        item_type: "Article",
        updated_date: "2020-07-19T12:43:12-04:00",
        created_date: "2020-07-18T18:19:10-04:00",
        published_date: "2020-07-18T18:19:10-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [],
        org_facet: [],
        per_facet: ["Cummings, Elijah E", "Lewis, John R", "Rubio, Marco"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18xp-rubio-lewis-pix/merlin_174120825_f0c4fbd3-835c-4204-afed-1e1177993e0a-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Senator Marco Rubio later acknowledged having used an incorrect photo in a Twitter tribute to Representative John Lewis, who died on Friday.",
            copyright: "Pool photo by Andrew Harnik",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18xp-rubio-lewis-pix/18xp-rubio-lewis-pix-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Senator Marco Rubio later acknowledged having used an incorrect photo in a Twitter tribute to Representative John Lewis, who died on Friday.",
            copyright: "Pool photo by Andrew Harnik",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18xp-rubio-lewis-pix/18xp-rubio-lewis-pix-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Senator Marco Rubio later acknowledged having used an incorrect photo in a Twitter tribute to Representative John Lewis, who died on Friday.",
            copyright: "Pool photo by Andrew Harnik",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18xp-rubio-lewis-pix/merlin_174120825_f0c4fbd3-835c-4204-afed-1e1177993e0a-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Senator Marco Rubio later acknowledged having used an incorrect photo in a Twitter tribute to Representative John Lewis, who died on Friday.",
            copyright: "Pool photo by Andrew Harnik",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18xp-rubio-lewis-pix/merlin_174120825_f0c4fbd3-835c-4204-afed-1e1177993e0a-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Senator Marco Rubio later acknowledged having used an incorrect photo in a Twitter tribute to Representative John Lewis, who died on Friday.",
            copyright: "Pool photo by Andrew Harnik",
          },
        ],
        short_url: "https://nyti.ms/32BhwT9",
      },
      {
        section: "us",
        subsection: "politics",
        title: "Roger Stone Uses Racial Slur on Radio Show",
        abstract:
          "Mr. Stone, while being questioned about the commutation of his sentence by President Trump, used a racial slur in referring to his interviewer, who is Black.",
        url:
          "https://www.nytimes.com/2020/07/19/us/politics/roger-stone-mo-kelly-slur.html",
        uri: "nyt://article/09a04731-db04-5477-90dd-5bd94c3d9619",
        byline: "By Aimee Ortiz and Marie Fazio",
        item_type: "Article",
        updated_date: "2020-07-19T12:43:16-04:00",
        created_date: "2020-07-19T01:00:52-04:00",
        published_date: "2020-07-19T01:00:52-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Black People",
          "Radio",
          "Race and Ethnicity",
          "The Mo'Kelly Show (Radio Program)",
        ],
        org_facet: [],
        per_facet: ["Stone, Roger J Jr", "O'Kelly, Morris W."],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/08/17/us/politics/17xp-stone-radio/merlin_174523263_7eab793e-8087-4ae0-a2c7-cc19582c5424-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Roger Stone arriving at his criminal trial in Washington last November. On Saturday night, he used a racial slur in referring to a radio host who was interviewing him.",
            copyright: "Tom Brenner/Reuters",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/17/us/politics/17xp-stone-radio/merlin_174523263_7eab793e-8087-4ae0-a2c7-cc19582c5424-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Roger Stone arriving at his criminal trial in Washington last November. On Saturday night, he used a racial slur in referring to a radio host who was interviewing him.",
            copyright: "Tom Brenner/Reuters",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/17/us/politics/17xp-stone-radio/merlin_174523263_7eab793e-8087-4ae0-a2c7-cc19582c5424-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Roger Stone arriving at his criminal trial in Washington last November. On Saturday night, he used a racial slur in referring to a radio host who was interviewing him.",
            copyright: "Tom Brenner/Reuters",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/17/us/politics/17xp-stone-radio/merlin_174523263_7eab793e-8087-4ae0-a2c7-cc19582c5424-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Roger Stone arriving at his criminal trial in Washington last November. On Saturday night, he used a racial slur in referring to a radio host who was interviewing him.",
            copyright: "Tom Brenner/Reuters",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/17/us/politics/17xp-stone-radio/merlin_174523263_7eab793e-8087-4ae0-a2c7-cc19582c5424-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Roger Stone arriving at his criminal trial in Washington last November. On Saturday night, he used a racial slur in referring to a radio host who was interviewing him.",
            copyright: "Tom Brenner/Reuters",
          },
        ],
        short_url: "https://nyti.ms/3h76DfY",
      },
      {
        section: "world",
        subsection: "canada",
        title: "3 Dead After Glacier Tour Bus Rolls Over in Canadian Rockies",
        abstract:
          "The vehicle, with 27 people on board, was specially designed to carry visitors onto one of North America’s largest glaciers, in Jasper National Park in Alberta.",
        url:
          "https://www.nytimes.com/2020/07/18/world/canada/bus-crash-glacier-jasper-alberta.html",
        uri: "nyt://article/63dd67ba-c229-5345-a801-d3420494ac8d",
        byline: "By Ian Austen",
        item_type: "Article",
        updated_date: "2020-07-19T12:43:17-04:00",
        created_date: "2020-07-18T21:10:12-04:00",
        published_date: "2020-07-18T21:10:12-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Buses", "Glaciers", "Parks and Other Recreation Areas"],
        org_facet: ["Royal Canadian Mounted Police"],
        per_facet: [],
        geo_facet: [
          "Jasper National Park (Canada)",
          "Alberta (Canada)",
          "Rocky Mountains",
        ],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/08/18/world/18canada-bus-promo/18canada-bus-promo-superJumbo.jpg",
            format: "superJumbo",
            height: 1321,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/18/world/18canada-bus-promo/18canada-bus-promo-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/18/world/18canada-bus-promo/18canada-bus-promo-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/18/world/18canada-bus-promo/18canada-bus-promo-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/18/world/18canada-bus-promo/18canada-bus-promo-articleInline.jpg",
            format: "Normal",
            height: 123,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Getty Images",
          },
        ],
        short_url: "https://nyti.ms/2OEl4fa",
      },
      {
        section: "us",
        subsection: "",
        title: "Dorothy Parker’s Ashes Could Be Moved. Again.",
        abstract:
          "The writer’s ashes may be disinterred when the N.A.A.C.P. moves its headquarters to Washington from Baltimore. But where should they go?",
        url:
          "https://www.nytimes.com/2020/07/19/us/dorothy-parker-ashes-baltimore.html",
        uri: "nyt://article/945e5f42-a49d-5ff0-bbd6-2bec0da886a2",
        byline: "By Jenny Gross",
        item_type: "Article",
        updated_date: "2020-07-19T12:43:19-04:00",
        created_date: "2020-07-19T09:09:49-04:00",
        published_date: "2020-07-19T09:09:49-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Monuments and Memorials (Structures)",
          "Civil Rights and Liberties",
          "Civil Rights Movement (1954-68)",
          "Black People",
          "Wills and Estates",
          "Writing and Writers",
          "Relocation of Business",
          "Cremation",
          "Books and Literature",
        ],
        org_facet: [
          "National Assn for the Advancement of Colored People",
          "Algonquin Hotel (Manhattan, NY)",
        ],
        per_facet: ["Parker, Dorothy", "King, Martin Luther Jr"],
        geo_facet: ["Baltimore (Md)", "Washington (DC)", "Manhattan (NYC)"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/multimedia/17xp-parker-pix2/merlin_8861518_aa9325a0-fa7b-4ec4-8cde-cb54941bf02d-superJumbo.jpg",
            format: "superJumbo",
            height: 1575,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "Dorothy Parker at work in 1941.",
            copyright: "Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/multimedia/17xp-parker-pix2/17xp-parker-pix2-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "Dorothy Parker at work in 1941.",
            copyright: "Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/multimedia/17xp-parker-pix2/17xp-parker-pix2-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "Dorothy Parker at work in 1941.",
            copyright: "Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/multimedia/17xp-parker-pix2/17xp-parker-pix2-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "Dorothy Parker at work in 1941.",
            copyright: "Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/multimedia/17xp-parker-pix2/merlin_8861518_aa9325a0-fa7b-4ec4-8cde-cb54941bf02d-articleInline.jpg",
            format: "Normal",
            height: 146,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "Dorothy Parker at work in 1941.",
            copyright: "Associated Press",
          },
        ],
        short_url: "https://nyti.ms/2OHJzYM",
      },
      {
        section: "sports",
        subsection: "",
        title: "The Tokyo Olympics Will Open a Year From Now. Maybe.",
        abstract:
          "Japan has largely controlled the coronavirus. Large parts of the rest of the world, especially the United States, have not. A year before the rescheduled Games, that is still a major problem.",
        url:
          "https://www.nytimes.com/2020/07/19/sports/2021-tokyo-olympics-protocols.html",
        uri: "nyt://article/99f5e55b-9a34-5064-b11e-52d968457dd7",
        byline: "By Matthew Futterman, Motoko Rich and Andrew Keh",
        item_type: "Article",
        updated_date: "2020-07-19T12:43:13-04:00",
        created_date: "2020-07-19T03:00:07-04:00",
        published_date: "2020-07-19T03:00:07-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Olympic Games (2020)", "Coronavirus (2019-nCoV)"],
        org_facet: ["International Olympic Committee"],
        per_facet: ["Bach, Thomas"],
        geo_facet: ["Tokyo (Japan)"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/sports/19Olympics2/merlin_174485964_6cfbfd27-65d7-4b3e-8cd6-6c2dd24c0903-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "A spreading coronavirus outbreak in the United States is being closely watch by the International Olympic Committee and organizers of the Tokyo Games.",
            copyright:
              "Philip Fong/Agence France-Presse \u0026mdash; Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/sports/19Olympics2/19Olympics2-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "A spreading coronavirus outbreak in the United States is being closely watch by the International Olympic Committee and organizers of the Tokyo Games.",
            copyright:
              "Philip Fong/Agence France-Presse \u0026mdash; Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/sports/19Olympics2/19Olympics2-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "A spreading coronavirus outbreak in the United States is being closely watch by the International Olympic Committee and organizers of the Tokyo Games.",
            copyright:
              "Philip Fong/Agence France-Presse \u0026mdash; Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/sports/19Olympics2/merlin_174485964_6cfbfd27-65d7-4b3e-8cd6-6c2dd24c0903-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "A spreading coronavirus outbreak in the United States is being closely watch by the International Olympic Committee and organizers of the Tokyo Games.",
            copyright:
              "Philip Fong/Agence France-Presse \u0026mdash; Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/sports/19Olympics2/merlin_174485964_6cfbfd27-65d7-4b3e-8cd6-6c2dd24c0903-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "A spreading coronavirus outbreak in the United States is being closely watch by the International Olympic Committee and organizers of the Tokyo Games.",
            copyright:
              "Philip Fong/Agence France-Presse \u0026mdash; Getty Images",
          },
        ],
        short_url: "https://nyti.ms/2WBXVhM",
      },
      {
        section: "nyregion",
        subsection: "",
        title: "With Tourists Gone, St. Patrick’s Cathedral Pleads for Help",
        abstract:
          "The Manhattan landmark is struggling to pay its bills while the pandemic keeps visitors and Midtown workers away.",
        url:
          "https://www.nytimes.com/2020/07/19/nyregion/st-patricks-cathedral-pandemic-budget.html",
        uri: "nyt://article/66b13a89-d3a0-5c50-8cb6-d359e83db6c0",
        byline: "By Liam Stack",
        item_type: "Article",
        updated_date: "2020-07-19T12:43:13-04:00",
        created_date: "2020-07-19T10:47:55-04:00",
        published_date: "2020-07-19T10:47:55-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Churches (Buildings)",
          "Finances",
          "Coronavirus (2019-nCoV)",
          "Coronavirus Reopenings",
          "Income",
          "Shutdowns (Institutional)",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: ["Fifth Avenue (Manhattan, NY)"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/13/nyregion/00nyvirus-cathedral/00nyvirus-cathedral-superJumbo.jpg",
            format: "superJumbo",
            height: 1367,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "A public health crisis has meant a severe drop in tourism and lack of fund-raising options for the landmark cathedral.",
            copyright: "September Dawn Bottoms/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/13/nyregion/00nyvirus-cathedral/00nyvirus-cathedral-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "A public health crisis has meant a severe drop in tourism and lack of fund-raising options for the landmark cathedral.",
            copyright: "September Dawn Bottoms/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/13/nyregion/00nyvirus-cathedral/00nyvirus-cathedral-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "A public health crisis has meant a severe drop in tourism and lack of fund-raising options for the landmark cathedral.",
            copyright: "September Dawn Bottoms/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/13/nyregion/00nyvirus-cathedral/00nyvirus-cathedral-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "A public health crisis has meant a severe drop in tourism and lack of fund-raising options for the landmark cathedral.",
            copyright: "September Dawn Bottoms/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/13/nyregion/00nyvirus-cathedral/00nyvirus-cathedral-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "A public health crisis has meant a severe drop in tourism and lack of fund-raising options for the landmark cathedral.",
            copyright: "September Dawn Bottoms/The New York Times",
          },
        ],
        short_url: "https://nyti.ms/3eHVxMR",
      },
      {
        section: "us",
        subsection: "",
        title:
          "Federal Officers Deployed in Portland Didn’t Have Proper Training, D.H.S. Memo Said",
        abstract:
          "Rather than tamping down persistent protests in Portland, Ore., a militarized presence from federal officers seems to have re-energized them.",
        url: "https://www.nytimes.com/2020/07/18/us/portland-protests.html",
        uri: "nyt://article/6cc4b2ca-c614-597f-b9d2-698822b4d02e",
        byline: "By Sergio Olmos, Mike Baker and Zolan Kanno-Youngs",
        item_type: "Article",
        updated_date: "2020-07-19T12:46:35-04:00",
        created_date: "2020-07-18T10:34:22-04:00",
        published_date: "2020-07-18T10:34:22-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "George Floyd Protests (2020)",
          "Black Lives Matter Movement",
          "Police Brutality, Misconduct and Shootings",
        ],
        org_facet: ["Homeland Security Department"],
        per_facet: [
          "Wolf, Chad F",
          "Trump, Donald J",
          "Brown, Kate (1960- )",
          "Wheeler, Edward Tevis (1962- )",
        ],
        geo_facet: ["Portland (Ore)"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/18unrest-portland-1/merlin_174697392_435eafd8-b9c5-4edf-a542-9107c1d8e866-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Protesters at the Multnomah County Justice Center on Friday night.",
            copyright: "Mason Trinca/Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/18unrest-portland-1/merlin_174697392_435eafd8-b9c5-4edf-a542-9107c1d8e866-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Protesters at the Multnomah County Justice Center on Friday night.",
            copyright: "Mason Trinca/Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/18unrest-portland-1/merlin_174697392_435eafd8-b9c5-4edf-a542-9107c1d8e866-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Protesters at the Multnomah County Justice Center on Friday night.",
            copyright: "Mason Trinca/Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/18unrest-portland-1/merlin_174697392_435eafd8-b9c5-4edf-a542-9107c1d8e866-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Protesters at the Multnomah County Justice Center on Friday night.",
            copyright: "Mason Trinca/Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/us/18unrest-portland-1/merlin_174697392_435eafd8-b9c5-4edf-a542-9107c1d8e866-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Protesters at the Multnomah County Justice Center on Friday night.",
            copyright: "Mason Trinca/Getty Images",
          },
        ],
        short_url: "https://nyti.ms/30hC8gk",
      },
      {
        section: "your-money",
        subsection: "",
        title:
          "Financial Brokers Must Now Act in Your ‘Best Interest.’ What Does That Mean?",
        abstract:
          "A new standard established by the Securities and Exchange Commission may sound better than it actually is, consumer advocates say.",
        url:
          "https://www.nytimes.com/2020/07/16/your-money/fiduciary-duty-investments-best-interest.html",
        uri: "nyt://article/fe6fe8e3-1882-5712-9b93-4703ce9f14b4",
        byline: "By Tara Siegel Bernard",
        item_type: "Article",
        updated_date: "2020-07-19T12:43:14-04:00",
        created_date: "2020-07-16T09:00:14-04:00",
        published_date: "2020-07-16T09:00:14-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Consumer Protection",
          "Financial Brokers",
          "Regulation and Deregulation of Industry",
          "Content Type: Service",
          "Personal Finances",
        ],
        org_facet: [
          "Securities and Exchange Commission",
          "Labor Department (US)",
          "Consumer Federation of America",
        ],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/14/business/14fiduciary1/merlin_170290788_9164b021-0a71-45e8-a2d1-b11a61173db1-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "A Securities and Exchange Commission rule that took effect June 30 requires brokers who sell financial products to act in a client’s best interest.",
            copyright: "Shawn Thew/EPA, via Shutterstock",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/14/business/14fiduciary1/14fiduciary1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "A Securities and Exchange Commission rule that took effect June 30 requires brokers who sell financial products to act in a client’s best interest.",
            copyright: "Shawn Thew/EPA, via Shutterstock",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/14/business/14fiduciary1/14fiduciary1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "A Securities and Exchange Commission rule that took effect June 30 requires brokers who sell financial products to act in a client’s best interest.",
            copyright: "Shawn Thew/EPA, via Shutterstock",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/14/business/14fiduciary1/merlin_170290788_9164b021-0a71-45e8-a2d1-b11a61173db1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "A Securities and Exchange Commission rule that took effect June 30 requires brokers who sell financial products to act in a client’s best interest.",
            copyright: "Shawn Thew/EPA, via Shutterstock",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/14/business/14fiduciary1/merlin_170290788_9164b021-0a71-45e8-a2d1-b11a61173db1-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "A Securities and Exchange Commission rule that took effect June 30 requires brokers who sell financial products to act in a client’s best interest.",
            copyright: "Shawn Thew/EPA, via Shutterstock",
          },
        ],
        short_url: "https://nyti.ms/2WtBmfo",
      },
      {
        section: "well",
        subsection: "move",
        title: "How We Get Stronger",
        abstract:
          "Weight training prompts changes in the nervous system that prime the muscles to get bigger and stronger.",
        url:
          "https://www.nytimes.com/2020/07/01/well/move/how-we-get-stronger.html",
        uri: "nyt://article/33c0d74f-8d27-50a0-a079-43bbc00c2078",
        byline: "By Gretchen Reynolds",
        item_type: "Article",
        updated_date: "2020-07-07T10:42:25-04:00",
        created_date: "2020-07-01T05:00:08-04:00",
        published_date: "2020-07-01T05:00:08-04:00",
        material_type_facet: "",
        kicker: "PHYS ED",
        des_facet: [
          "Muscles",
          "Monkeys and Apes",
          "Research",
          "Nerves and Nervous System",
          "Exercise",
          "Weight Lifting",
          "Content Type: Service",
        ],
        org_facet: ["Journal of Neuroscience", "Newcastle University"],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/well/physed-stronger/physed-stronger-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/well/physed-stronger/physed-stronger-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/well/physed-stronger/physed-stronger-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/well/physed-stronger/physed-stronger-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/well/physed-stronger/physed-stronger-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Getty Images",
          },
        ],
        short_url: "https://nyti.ms/3gcSI7B",
      },
      {
        section: "smarter-living",
        subsection: "",
        title: "Why You’re Probably Not So Great at Risk Assessment",
        abstract:
          "Our minds don’t always see risk clearly — and that’s important to remember as you navigate life after lockdown.",
        url:
          "https://www.nytimes.com/2020/06/30/smarter-living/why-youre-probably-not-so-great-at-risk-assessment.html",
        uri: "nyt://article/224f25d2-6886-5317-ac1d-2c6499b4f058",
        byline: "By A.C. Shilton",
        item_type: "Article",
        updated_date: "2020-07-05T23:12:36-04:00",
        created_date: "2020-06-30T09:44:34-04:00",
        published_date: "2020-06-30T09:44:34-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Coronavirus Risks and Safety Concerns",
          "Coronavirus (2019-nCoV)",
          "Content Type: Service",
          "Quarantines",
          "Psychology and Psychologists",
          "Quarantine (Life and Culture)",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/06/smarter-living/00sl-safe-to-come-out-now/00sl-safe-to-come-out-now-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Xinmei Liu",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/06/smarter-living/00sl-safe-to-come-out-now/00sl-safe-to-come-out-now-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Xinmei Liu",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/06/smarter-living/00sl-safe-to-come-out-now/00sl-safe-to-come-out-now-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Xinmei Liu",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/06/smarter-living/00sl-safe-to-come-out-now/00sl-safe-to-come-out-now-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Xinmei Liu",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/06/smarter-living/00sl-safe-to-come-out-now/00sl-safe-to-come-out-now-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Xinmei Liu",
          },
        ],
        short_url: "https://nyti.ms/3dTdSGt",
      },
      {
        section: "smarter-living",
        subsection: "",
        title: "How to Manage the Emotional Impact of Getting Laid Off",
        abstract: "Stop spirals before they start.",
        url:
          "https://www.nytimes.com/2020/06/21/smarter-living/coronavirus-laid-off-career-advice.html",
        uri: "nyt://article/3a66576b-1cc9-5c4b-bdb9-cffab2a8b07c",
        byline: "By Holly Epstein Ojalvo",
        item_type: "Article",
        updated_date: "2020-06-24T09:51:18-04:00",
        created_date: "2020-06-21T19:18:33-04:00",
        published_date: "2020-06-21T19:18:33-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Content Type: Service",
          "Layoffs and Job Reductions",
          "Careers and Professions",
          "Psychology and Psychologists",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/06/21/smarter-living/21sl-job-loss/00sl-job-loss-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 2028,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Grace J. Kim",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/06/21/smarter-living/21sl-job-loss/00sl-job-loss-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Grace J. Kim",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/06/21/smarter-living/21sl-job-loss/00sl-job-loss-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Grace J. Kim",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/06/21/smarter-living/21sl-job-loss/00sl-job-loss-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Grace J. Kim",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/06/21/smarter-living/21sl-job-loss/00sl-job-loss-articleInline.jpg",
            format: "Normal",
            height: 192,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Grace J. Kim",
          },
        ],
        short_url: "https://nyti.ms/2NhP3sL",
      },
      {
        section: "parenting",
        subsection: "",
        title: "How Are My Kids Still Getting Sick in Lockdown?",
        abstract:
          "Many infections come from within. Doctors explain what they are and what to do about them.",
        url:
          "https://www.nytimes.com/2020/06/24/parenting/virus-kids-sick-quarantine-infection.html",
        uri: "nyt://article/146addfa-aebe-5112-b23c-a9d37372e6e5",
        byline: "By Melinda Wenner Moyer",
        item_type: "Article",
        updated_date: "2020-07-04T01:06:19-04:00",
        created_date: "2020-06-24T05:00:20-04:00",
        published_date: "2020-06-24T05:00:20-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Coronavirus (2019-nCoV)",
          "Children and Childhood",
          "Content Type: Service",
          "Fever",
          "Bacteria",
          "Salmonella (Bacteria)",
          "Lice",
          "Diabetes",
          "Impetigo",
          "Eczema",
          "Lyme Disease",
          "Hand, Foot and Mouth Disease",
          "internal-essential",
          "Parenting",
          "Quarantines",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/06/24/multimedia/24parenting-getting-sick-hp/24parenting-getting-sick-hp-superJumbo-v2.png",
            format: "superJumbo",
            height: 800,
            width: 1200,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Alex Kiesling",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/06/24/multimedia/24parenting-getting-sick-hp/24parenting-getting-sick-hp-thumbStandard-v2.png",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Alex Kiesling",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/06/24/multimedia/24parenting-getting-sick-hp/24parenting-getting-sick-hp-thumbLarge-v2.png",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Alex Kiesling",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/06/24/multimedia/24parenting-getting-sick-hp/24parenting-getting-sick-hp-mediumThreeByTwo210-v2.png",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Alex Kiesling",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/06/24/multimedia/24parenting-getting-sick-hp/24parenting-getting-sick-hp-articleInline-v2.png",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Alex Kiesling",
          },
        ],
        short_url: "https://nyti.ms/2Z1T220",
      },
      {
        section: "well",
        subsection: "family",
        title: "How to Raise an Anti-Racist Kid",
        abstract:
          "The books we read, the movies we watch, the friends we make, the doctors we visit and the conversations we have at home all shape our children’s views of race.",
        url:
          "https://www.nytimes.com/2020/06/24/well/family/how-to-raise-an-anti-racist-kid.html",
        uri: "nyt://article/fe71f8fb-6e47-5f94-bf73-f068c3c8d737",
        byline: "By Tara Parker-Pope",
        item_type: "Article",
        updated_date: "2020-06-29T09:58:03-04:00",
        created_date: "2020-06-24T05:00:16-04:00",
        published_date: "2020-06-24T05:00:16-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Black People",
          "Race and Ethnicity",
          "Discrimination",
          "Education (K-12)",
          "Parenting",
          "Black Lives Matter Movement",
          "Children and Childhood",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2017/01/22/us/24WELL-COLEMAN-MORTLEY/24WELL-COLEMAN-MORTLEY-superJumbo-v2.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Amber Coleman-Mortley, left, with daughter Garvey Mortley and mother Jessica Coleman at the Women’s March on Washington in 2017.",
            copyright: "Ben C. Solomon/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2017/01/22/us/24WELL-COLEMAN-MORTLEY/24WELL-COLEMAN-MORTLEY-thumbStandard-v2.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Amber Coleman-Mortley, left, with daughter Garvey Mortley and mother Jessica Coleman at the Women’s March on Washington in 2017.",
            copyright: "Ben C. Solomon/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2017/01/22/us/24WELL-COLEMAN-MORTLEY/24WELL-COLEMAN-MORTLEY-thumbLarge-v2.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Amber Coleman-Mortley, left, with daughter Garvey Mortley and mother Jessica Coleman at the Women’s March on Washington in 2017.",
            copyright: "Ben C. Solomon/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2017/01/22/us/24WELL-COLEMAN-MORTLEY/24WELL-COLEMAN-MORTLEY-mediumThreeByTwo210-v2.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Amber Coleman-Mortley, left, with daughter Garvey Mortley and mother Jessica Coleman at the Women’s March on Washington in 2017.",
            copyright: "Ben C. Solomon/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2017/01/22/us/24WELL-COLEMAN-MORTLEY/24WELL-COLEMAN-MORTLEY-articleInline-v2.jpg",
            format: "Normal",
            height: 130,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Amber Coleman-Mortley, left, with daughter Garvey Mortley and mother Jessica Coleman at the Women’s March on Washington in 2017.",
            copyright: "Ben C. Solomon/The New York Times",
          },
        ],
        short_url: "https://nyti.ms/2zWBiMW",
      },
      {
        section: "fashion",
        subsection: "weddings",
        title: "Paired During a Medical Rotation, and Then in Life",
        abstract:
          "Drs. Nina Suda and Charles Murphy met as residents five years ago, and when he was told to quarantine because of the coronavirus, she stood by his side — at a safe distance.",
        url:
          "https://www.nytimes.com/2020/07/17/fashion/weddings/paired-during-a-medical-rotation-and-then-in-life.html",
        uri: "nyt://article/7305a329-f960-5afb-8e08-c83d474d3d84",
        byline: "By Vincent M. Mallozzi",
        item_type: "Article",
        updated_date: "2020-07-19T09:34:36-04:00",
        created_date: "2020-07-17T05:00:29-04:00",
        published_date: "2020-07-17T05:00:29-04:00",
        material_type_facet: "",
        kicker: "vows",
        des_facet: [
          "Weddings and Engagements",
          "Quarantines",
          "Coronavirus (2019-nCoV)",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/fashion/17Vows-SudaMurphy1/merlin_173544882_ac73d0b3-d303-481e-b7f8-20a7ab5c5f25-superJumbo.jpg",
            format: "superJumbo",
            height: 1362,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Dr. Nina Suda and Dr. Charles Murphy were married June 13 at the home of the bride\u0026rsquo;s parents in Kinnelon, N.J.",
            copyright: "Nina Westervelt for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/fashion/17Vows-SudaMurphy1/17Vows-SudaMurphy1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Dr. Nina Suda and Dr. Charles Murphy were married June 13 at the home of the bride\u0026rsquo;s parents in Kinnelon, N.J.",
            copyright: "Nina Westervelt for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/fashion/17Vows-SudaMurphy1/17Vows-SudaMurphy1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Dr. Nina Suda and Dr. Charles Murphy were married June 13 at the home of the bride\u0026rsquo;s parents in Kinnelon, N.J.",
            copyright: "Nina Westervelt for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/fashion/17Vows-SudaMurphy1/17Vows-SudaMurphy1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Dr. Nina Suda and Dr. Charles Murphy were married June 13 at the home of the bride\u0026rsquo;s parents in Kinnelon, N.J.",
            copyright: "Nina Westervelt for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/fashion/17Vows-SudaMurphy1/merlin_173544882_ac73d0b3-d303-481e-b7f8-20a7ab5c5f25-articleInline.jpg",
            format: "Normal",
            height: 126,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Dr. Nina Suda and Dr. Charles Murphy were married June 13 at the home of the bride\u0026rsquo;s parents in Kinnelon, N.J.",
            copyright: "Nina Westervelt for The New York Times",
          },
        ],
        short_url: "https://nyti.ms/30icrwl",
      },
      {
        section: "nyregion",
        subsection: "",
        title: "How the Central Park Barber Spends His Sundays",
        abstract:
          "Herman James has set up shop under a pergola near Strawberry Fields, where he has provided free haircuts since May.",
        url:
          "https://www.nytimes.com/2020/07/17/nyregion/central-park-barber-nyc.html",
        uri: "nyt://article/a869f262-ab9d-590a-a1aa-23994d8d0cde",
        byline: "By Emily Palmer",
        item_type: "Article",
        updated_date: "2020-07-19T09:34:36-04:00",
        created_date: "2020-07-17T05:00:16-04:00",
        published_date: "2020-07-17T05:00:16-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Barbers and Barbering", "Hair"],
        org_facet: ["Parks and Recreation Department (NYC)"],
        per_facet: ["James, Herman (1988- )"],
        geo_facet: [
          "Central Park (Manhattan, NY)",
          "Brownsville (Brooklyn, NY)",
        ],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/nyregion/17nyvirus-barberroutine1/merlin_174290565_99ba9770-25ae-4e16-8bdc-cdaeeb7f568c-superJumbo.jpg",
            format: "superJumbo",
            height: 1536,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "Herman James gives a cut to Brandon Fay in Central Park.",
            copyright: "Simbarashe Cha for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/nyregion/17nyvirus-barberroutine1/17nyvirus-barberroutine1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "Herman James gives a cut to Brandon Fay in Central Park.",
            copyright: "Simbarashe Cha for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/nyregion/17nyvirus-barberroutine1/17nyvirus-barberroutine1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "Herman James gives a cut to Brandon Fay in Central Park.",
            copyright: "Simbarashe Cha for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/nyregion/17nyvirus-barberroutine1/17nyvirus-barberroutine1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "Herman James gives a cut to Brandon Fay in Central Park.",
            copyright: "Simbarashe Cha for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/nyregion/17nyvirus-barberroutine1/merlin_174290565_99ba9770-25ae-4e16-8bdc-cdaeeb7f568c-articleInline.jpg",
            format: "Normal",
            height: 143,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "Herman James gives a cut to Brandon Fay in Central Park.",
            copyright: "Simbarashe Cha for The New York Times",
          },
        ],
        short_url: "https://nyti.ms/2CkbU53",
      },
      {
        section: "realestate",
        subsection: "",
        title: "Yes, It’s Already Time to Buy Bulbs for Fall Planting",
        abstract:
          "But there are a few things to consider before you go shopping.",
        url:
          "https://www.nytimes.com/2020/07/15/realestate/Tips-bulbs-for-fall-planting-garden.html",
        uri: "nyt://article/16b052b2-369c-5393-bbb0-327dede16287",
        byline: "By Margaret Roach",
        item_type: "Article",
        updated_date: "2020-07-19T09:34:36-04:00",
        created_date: "2020-07-15T06:00:15-04:00",
        published_date: "2020-07-15T06:00:15-04:00",
        material_type_facet: "",
        kicker: "IN THE GARDEN",
        des_facet: [
          "Real Estate and Housing (Residential)",
          "Gardens and Gardening",
          "Flowers and Plants",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/13/realestate/15garden1/oakImage-1594675756166-superJumbo.jpg",
            format: "superJumbo",
            height: 1200,
            width: 1800,
            type: "image",
            subtype: "photo",
            caption:
              "A trough at Chanticleer spills over with color, including bronze Tulipa whittallii, blue Muscari armeniacum and an underplanting of gold Sedum rupestre Angelina.",
            copyright: "Lisa Roper",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/13/realestate/15garden1/oakImage-1594675756166-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "A trough at Chanticleer spills over with color, including bronze Tulipa whittallii, blue Muscari armeniacum and an underplanting of gold Sedum rupestre Angelina.",
            copyright: "Lisa Roper",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/13/realestate/15garden1/oakImage-1594675756166-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "A trough at Chanticleer spills over with color, including bronze Tulipa whittallii, blue Muscari armeniacum and an underplanting of gold Sedum rupestre Angelina.",
            copyright: "Lisa Roper",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/13/realestate/15garden1/oakImage-1594675756166-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "A trough at Chanticleer spills over with color, including bronze Tulipa whittallii, blue Muscari armeniacum and an underplanting of gold Sedum rupestre Angelina.",
            copyright: "Lisa Roper",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/13/realestate/15garden1/oakImage-1594675756166-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "A trough at Chanticleer spills over with color, including bronze Tulipa whittallii, blue Muscari armeniacum and an underplanting of gold Sedum rupestre Angelina.",
            copyright: "Lisa Roper",
          },
        ],
        short_url: "https://nyti.ms/393M5lQ",
      },
      {
        section: "sports",
        subsection: "baseball",
        title: "How the Yankees Are Adapting to a Season of Distancing",
        abstract:
          "M.L.B.’s protocols require it, but it’s not easy to suddenly stop spitting, high-fiving and wiping your face in a sport where doing so can be second nature.",
        url:
          "https://www.nytimes.com/2020/07/17/sports/baseball/baseball-mlb-coronavirus-spitting.html",
        uri: "nyt://article/a8cc04b3-b857-5cdb-ba39-cd47c2b7baed",
        byline: "By James Wagner",
        item_type: "Article",
        updated_date: "2020-07-19T11:31:01-04:00",
        created_date: "2020-07-17T15:31:40-04:00",
        published_date: "2020-07-17T15:31:40-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Baseball"],
        org_facet: ["Major League Baseball", "New York Yankees"],
        per_facet: ["Judge, Aaron (1992- )"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/sports/XXYankees-1/merlin_174610182_b7ed53a0-3932-47f8-bdf5-4314f10715f7-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "M.L.B.\u0026rsquo;s virus protocols say players should avoid high-fives and fist-bumps. At least Giancarlo Stanton and Aaron Judge wore gloves for theirs.",
            copyright: "Kathy Willens/Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/sports/XXYankees-1/XXYankees-1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "M.L.B.\u0026rsquo;s virus protocols say players should avoid high-fives and fist-bumps. At least Giancarlo Stanton and Aaron Judge wore gloves for theirs.",
            copyright: "Kathy Willens/Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/sports/XXYankees-1/XXYankees-1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "M.L.B.\u0026rsquo;s virus protocols say players should avoid high-fives and fist-bumps. At least Giancarlo Stanton and Aaron Judge wore gloves for theirs.",
            copyright: "Kathy Willens/Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/sports/XXYankees-1/merlin_174610182_b7ed53a0-3932-47f8-bdf5-4314f10715f7-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "M.L.B.\u0026rsquo;s virus protocols say players should avoid high-fives and fist-bumps. At least Giancarlo Stanton and Aaron Judge wore gloves for theirs.",
            copyright: "Kathy Willens/Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/sports/XXYankees-1/merlin_174610182_b7ed53a0-3932-47f8-bdf5-4314f10715f7-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "M.L.B.\u0026rsquo;s virus protocols say players should avoid high-fives and fist-bumps. At least Giancarlo Stanton and Aaron Judge wore gloves for theirs.",
            copyright: "Kathy Willens/Associated Press",
          },
        ],
        short_url: "https://nyti.ms/2CP4Lta",
      },
      {
        section: "fashion",
        subsection: "",
        title: "Buying Fine Jewelry on Instagram (Without Tears)",
        abstract:
          "Eager to order a new sparkler? Here are some tips to help make it a pleasant experience.",
        url:
          "https://www.nytimes.com/2020/07/17/fashion/jewelry-instagram-buying-online.html",
        uri: "nyt://article/48436c89-19a7-5445-afca-c78a1939798e",
        byline: "By Libby Banks",
        item_type: "Article",
        updated_date: "2020-07-19T09:34:36-04:00",
        created_date: "2020-07-17T05:04:07-04:00",
        published_date: "2020-07-17T05:04:07-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Jewels and Jewelry",
          "E-Commerce",
          "Content Type: Service",
          "your-feed-fashion",
          "Coronavirus (2019-nCoV)",
        ],
        org_facet: ["Instagram Inc"],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18instabuying-illo/18instabuying-illo-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1416,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Monica Garwood",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18instabuying-illo/18instabuying-illo-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Monica Garwood",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18instabuying-illo/18instabuying-illo-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Monica Garwood",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18instabuying-illo/18instabuying-illo-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Monica Garwood",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18instabuying-illo/18instabuying-illo-articleInline.jpg",
            format: "Normal",
            height: 275,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Monica Garwood",
          },
        ],
        short_url: "https://nyti.ms/3h9exoY",
      },
      {
        section: "science",
        subsection: "",
        title: "Beyond the Milky Way, a Galactic Wall",
        abstract:
          "Astronomers have discovered a vast assemblage of galaxies hidden behind our own, in the “zone of avoidance.”",
        url:
          "https://www.nytimes.com/2020/07/10/science/astronomy-galaxies-attractor-universe.html",
        uri: "nyt://article/7307b63d-4a8c-5622-9e9a-53ea42d3fd34",
        byline: "By Dennis Overbye",
        item_type: "Article",
        updated_date: "2020-07-12T19:46:09-04:00",
        created_date: "2020-07-10T11:25:00-04:00",
        published_date: "2020-07-10T11:25:00-04:00",
        material_type_facet: "",
        kicker: "Out There",
        des_facet: [
          "Space and Astronomy",
          "Stars and Galaxies",
          "Dark Matter (Astronomy)",
          "Gravitation and Gravity",
          "Milky Way Galaxy",
          "your-feed-science",
        ],
        org_facet: ["Astrophysical Journal"],
        per_facet: ["Tully, R Brent"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/21/science/10cosmicwall-mw/10cosmicwall-mw-superJumbo-v3.jpg",
            format: "superJumbo",
            height: 1477,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "The starry core of our spiral Milky Way galaxy, in an infrared image from NASA Spitzer Space Telescope. Obscured behind it is the South Pole Wall, a curtain of thousands of galaxies across at least 700 million light-years.",
            copyright: "NASA",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/21/science/10cosmicwall-mw/10cosmicwall-mw-thumbStandard-v5.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "The starry core of our spiral Milky Way galaxy, in an infrared image from NASA Spitzer Space Telescope. Obscured behind it is the South Pole Wall, a curtain of thousands of galaxies across at least 700 million light-years.",
            copyright: "NASA",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/21/science/10cosmicwall-mw/10cosmicwall-mw-thumbLarge-v5.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "The starry core of our spiral Milky Way galaxy, in an infrared image from NASA Spitzer Space Telescope. Obscured behind it is the South Pole Wall, a curtain of thousands of galaxies across at least 700 million light-years.",
            copyright: "NASA",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/21/science/10cosmicwall-mw/10cosmicwall-mw-mediumThreeByTwo210-v3.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "The starry core of our spiral Milky Way galaxy, in an infrared image from NASA Spitzer Space Telescope. Obscured behind it is the South Pole Wall, a curtain of thousands of galaxies across at least 700 million light-years.",
            copyright: "NASA",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/21/science/10cosmicwall-mw/10cosmicwall-mw-articleInline-v3.jpg",
            format: "Normal",
            height: 137,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "The starry core of our spiral Milky Way galaxy, in an infrared image from NASA Spitzer Space Telescope. Obscured behind it is the South Pole Wall, a curtain of thousands of galaxies across at least 700 million light-years.",
            copyright: "NASA",
          },
        ],
        short_url: "https://nyti.ms/3037asy",
      },
      {
        section: "science",
        subsection: "",
        title: "356 Elephants Died Suddenly. The Cause Is a Mystery.",
        abstract:
          "Some conservationists say the recent die-off in Botswana could be natural, but others expressed more concern.",
        url:
          "https://www.nytimes.com/2020/07/06/science/elephants-dead-botswana.html",
        uri: "nyt://article/b2b7ac39-473b-554e-96b9-84e066b0592f",
        byline: "By Rachel Nuwer",
        item_type: "Article",
        updated_date: "2020-07-14T00:23:53-04:00",
        created_date: "2020-07-06T13:58:44-04:00",
        published_date: "2020-07-06T13:58:44-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Elephants",
          "Conservation of Resources",
          "Poisoning and Poisons",
          "Research",
          "your-feed-science",
          "your-feed-animals",
          "Wildlife Die-Offs",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: ["Botswana"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/14/science/06sci-elephants02/06sci-elephants02-superJumbo.jpg",
            format: "superJumbo",
            height: 1154,
            width: 1732,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Via Reuters",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/14/science/06sci-elephants02/06sci-elephants02-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Via Reuters",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/14/science/06sci-elephants02/06sci-elephants02-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Via Reuters",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/14/science/06sci-elephants02/06sci-elephants02-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Via Reuters",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/14/science/06sci-elephants02/06sci-elephants02-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Via Reuters",
          },
        ],
        short_url: "https://nyti.ms/38urmr1",
      },
      {
        section: "science",
        subsection: "",
        title: "Could You Make a Snowball of Neutrinos?",
        abstract:
          "You’ll need more than a few — say, 300 decillion. And good luck trying to throw it.",
        url:
          "https://www.nytimes.com/2020/07/07/science/neutrinos-snowball-randall-munroe.html",
        uri: "nyt://article/4bc89808-00bd-53cd-a35f-5faf5d95a17d",
        byline: "By Randall Munroe",
        item_type: "Article",
        updated_date: "2020-07-08T09:47:53-04:00",
        created_date: "2020-07-07T02:30:12-04:00",
        published_date: "2020-07-07T02:30:12-04:00",
        material_type_facet: "",
        kicker: "good question",
        des_facet: [
          "Neutrinos",
          "Space and Astronomy",
          "Physics",
          "your-feed-science",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/science/07SCI-MUNROE-NEUTRINO/07SCI-MUNROE-NEUTRINO-superJumbo.jpg",
            format: "superJumbo",
            height: 674,
            width: 1313,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Randall Munroe",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/science/07SCI-MUNROE-NEUTRINO/07SCI-MUNROE-NEUTRINO-thumbStandard-v2.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Randall Munroe",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/science/07SCI-MUNROE-NEUTRINO/07SCI-MUNROE-NEUTRINO-thumbLarge-v2.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Randall Munroe",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/science/07SCI-MUNROE-NEUTRINO/07SCI-MUNROE-NEUTRINO-mediumThreeByTwo210-v2.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Randall Munroe",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/science/07SCI-MUNROE-NEUTRINO/07SCI-MUNROE-NEUTRINO-articleInline.jpg",
            format: "Normal",
            height: 98,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Randall Munroe",
          },
        ],
        short_url: "https://nyti.ms/3e6SWeQ",
      },
      {
        section: "health",
        subsection: "",
        title:
          "Inside Johnson \u0026 Johnson’s Nonstop Hunt for a Coronavirus Vaccine",
        abstract:
          "In Boston and in the Netherlands, scientists are racing to build a vaccine against the virus strangling the world.",
        url:
          "https://www.nytimes.com/2020/07/17/health/coronavirus-vaccine-johnson-janssen.html",
        uri: "nyt://article/f47ba824-2881-5fae-9cd2-3e05b7817187",
        byline: "By Carl Zimmer",
        item_type: "Article",
        updated_date: "2020-07-18T19:18:03-04:00",
        created_date: "2020-07-17T13:00:21-04:00",
        published_date: "2020-07-17T13:00:21-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "your-feed-science",
          "Clinical Trials",
          "Coronavirus Risks and Safety Concerns",
          "Vaccination and Immunization",
          "Public-Private Sector Cooperation",
          "Coronavirus (2019-nCoV)",
        ],
        org_facet: [
          "Beth Israel Deaconess Medical Center",
          "Harvard University",
          "Janssen Pharmaceutica",
          "Johnson \u0026 Johnson",
        ],
        per_facet: [],
        geo_facet: ["Netherlands", "Boston (Mass)"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/21/science/00VIRUS-JNJ1/00VIRUS-JNJ1-superJumbo.jpg",
            format: "superJumbo",
            height: 1367,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Noe Mercado, a scientist at the Center for Virology and Vaccine Research in Boston, which is developing a coronavirus vaccine with Johnson \u0026 Johnson.",
            copyright: "Tony Luong for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/21/science/00VIRUS-JNJ1/00VIRUS-JNJ1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Noe Mercado, a scientist at the Center for Virology and Vaccine Research in Boston, which is developing a coronavirus vaccine with Johnson \u0026 Johnson.",
            copyright: "Tony Luong for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/21/science/00VIRUS-JNJ1/00VIRUS-JNJ1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Noe Mercado, a scientist at the Center for Virology and Vaccine Research in Boston, which is developing a coronavirus vaccine with Johnson \u0026 Johnson.",
            copyright: "Tony Luong for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/21/science/00VIRUS-JNJ1/00VIRUS-JNJ1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Noe Mercado, a scientist at the Center for Virology and Vaccine Research in Boston, which is developing a coronavirus vaccine with Johnson \u0026 Johnson.",
            copyright: "Tony Luong for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/21/science/00VIRUS-JNJ1/00VIRUS-JNJ1-articleInline.jpg",
            format: "Normal",
            height: 119,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Noe Mercado, a scientist at the Center for Virology and Vaccine Research in Boston, which is developing a coronavirus vaccine with Johnson \u0026 Johnson.",
            copyright: "Tony Luong for The New York Times",
          },
        ],
        short_url: "https://nyti.ms/3jemueE",
      },
      {
        section: "dining",
        subsection: "",
        title: "Sheet-Pan Summer",
        abstract: "Make cleanup all the easier on yourself with these recipes.",
        url: "https://www.nytimes.com/2020/07/17/dining/sheet-pan-summer.html",
        uri: "nyt://article/e38be34b-7720-51f8-a7f3-4b4718c3e1b7",
        byline: "By Emily Weinstein",
        item_type: "Article",
        updated_date: "2020-07-18T21:47:35-04:00",
        created_date: "2020-07-17T12:30:07-04:00",
        published_date: "2020-07-17T12:30:07-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Cooking and Cookbooks", "Content Type: Service"],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/dining/heuck-salmon-nicoise/heuck-salmon-nicoise-superJumbo.jpg",
            format: "superJumbo",
            height: 1417,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "Lidey Heuck\u0026rsquo;s roasted salmon nicoise.",
            copyright:
              "Ryan Liebe for The New York Times. Food Stylist: Barrett Washburne.",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/dining/heuck-salmon-nicoise/heuck-salmon-nicoise-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "Lidey Heuck\u0026rsquo;s roasted salmon nicoise.",
            copyright:
              "Ryan Liebe for The New York Times. Food Stylist: Barrett Washburne.",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/dining/heuck-salmon-nicoise/heuck-salmon-nicoise-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "Lidey Heuck\u0026rsquo;s roasted salmon nicoise.",
            copyright:
              "Ryan Liebe for The New York Times. Food Stylist: Barrett Washburne.",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/dining/heuck-salmon-nicoise/heuck-salmon-nicoise-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "Lidey Heuck\u0026rsquo;s roasted salmon nicoise.",
            copyright:
              "Ryan Liebe for The New York Times. Food Stylist: Barrett Washburne.",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/dining/heuck-salmon-nicoise/heuck-salmon-nicoise-articleInline.jpg",
            format: "Normal",
            height: 131,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "Lidey Heuck\u0026rsquo;s roasted salmon nicoise.",
            copyright:
              "Ryan Liebe for The New York Times. Food Stylist: Barrett Washburne.",
          },
        ],
        short_url: "https://nyti.ms/3jfL52s",
      },
    ],
  };

  var artsObjectFromApi = {
    status: "OK",
    copyright:
      "Copyright (c) 2020 The New York Times Company. All Rights Reserved.",
    section: "Arts",
    last_updated: "2020-07-17T16:57:46-04:00",
    num_results: 33,
    results: [
      {
        section: "movies",
        subsection: "",
        title:
          "Christopher Nolan Says ‘Tenet’ Will Come Out This Summer. Should It?",
        abstract:
          "The director had hoped to aid theater owners imperiled by the pandemic, but his oft-delayed film may be prolonging their pain.",
        url:
          "https://www.nytimes.com/2020/07/17/movies/tenet-release-pandemic.html",
        uri: "nyt://article/950aa439-fbcb-5f5a-af59-6a3cb6096f9a",
        byline: "By Kyle Buchanan",
        item_type: "Article",
        updated_date: "2020-07-18T01:40:17-04:00",
        created_date: "2020-07-17T15:14:49-04:00",
        published_date: "2020-07-17T15:14:49-04:00",
        material_type_facet: "",
        kicker: "Reporter’s Notebook",
        des_facet: ["Movies", "Coronavirus Reopenings", "Tenet (Movie)"],
        org_facet: ["Warner Brothers"],
        per_facet: ["Nolan, Christopher"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17tenet-release1/merlin_173956575_9618f239-6472-42fe-bffd-f0cccc739ab0-superJumbo.jpg",
            format: "superJumbo",
            height: 1494,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "John David Washington at the helm with Elizabeth Debicki on board in &ldquo;Tenet.&rdquo;",
            copyright:
              "Melinda Sue Gordon/Warner Bros Entertainment, via Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17tenet-release1/17tenet-release1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "John David Washington at the helm with Elizabeth Debicki on board in &ldquo;Tenet.&rdquo;",
            copyright:
              "Melinda Sue Gordon/Warner Bros Entertainment, via Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17tenet-release1/17tenet-release1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "John David Washington at the helm with Elizabeth Debicki on board in &ldquo;Tenet.&rdquo;",
            copyright:
              "Melinda Sue Gordon/Warner Bros Entertainment, via Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17tenet-release1/merlin_173956575_9618f239-6472-42fe-bffd-f0cccc739ab0-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "John David Washington at the helm with Elizabeth Debicki on board in &ldquo;Tenet.&rdquo;",
            copyright:
              "Melinda Sue Gordon/Warner Bros Entertainment, via Associated Press",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17tenet-release1/merlin_173956575_9618f239-6472-42fe-bffd-f0cccc739ab0-articleInline.jpg",
            format: "Normal",
            height: 139,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "John David Washington at the helm with Elizabeth Debicki on board in &ldquo;Tenet.&rdquo;",
            copyright:
              "Melinda Sue Gordon/Warner Bros Entertainment, via Associated Press",
          },
        ],
        short_url: "https://nyti.ms/2CpFqGD",
      },
      {
        section: "arts",
        subsection: "television",
        title: "The Fall of ‘Terrace House’",
        abstract:
          "Japan’s heartwarming reality TV hit ended in tragedy when the participant Hana Kimura killed herself after a wave of online abuse. But “Terrace House” was always more complicated than it appeared.",
        url:
          "https://www.nytimes.com/2020/07/17/arts/television/terrace-house-suicide.html",
        uri: "nyt://article/1925600b-32c0-5212-8e38-4032ad1e1bcf",
        byline: "By Eric Margolis",
        item_type: "Article",
        updated_date: "2020-07-18T18:20:02-04:00",
        created_date: "2020-07-17T16:24:21-04:00",
        published_date: "2020-07-17T16:24:21-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Terrace House (TV Program)",
          "Reality Television",
          "Television",
          "Suicides and Suicide Attempts",
          "Cyberharassment",
        ],
        org_facet: ["Fuji Television Network Inc", "Netflix Inc"],
        per_facet: ["Kimura, Hana (1997-2020)", "Kimura, Kyoko (1977- )"],
        geo_facet: ["Japan"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/20/arts/17terracehouse/17terracehouse-superJumbo.jpg",
            format: "superJumbo",
            height: 1006,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "The death of Hana Kimura, a cast member in “Terrace House: Tokyo,” brought an end to the hit reality show and provoked a national reckoning with online hatred in Japan.",
            copyright: "Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/20/arts/17terracehouse/17terracehouse-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "The death of Hana Kimura, a cast member in “Terrace House: Tokyo,” brought an end to the hit reality show and provoked a national reckoning with online hatred in Japan.",
            copyright: "Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/20/arts/17terracehouse/17terracehouse-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "The death of Hana Kimura, a cast member in “Terrace House: Tokyo,” brought an end to the hit reality show and provoked a national reckoning with online hatred in Japan.",
            copyright: "Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/20/arts/17terracehouse/17terracehouse-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "The death of Hana Kimura, a cast member in “Terrace House: Tokyo,” brought an end to the hit reality show and provoked a national reckoning with online hatred in Japan.",
            copyright: "Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/20/arts/17terracehouse/17terracehouse-articleInline.jpg",
            format: "Normal",
            height: 93,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "The death of Hana Kimura, a cast member in “Terrace House: Tokyo,” brought an end to the hit reality show and provoked a national reckoning with online hatred in Japan.",
            copyright: "Netflix",
          },
        ],
        short_url: "https://nyti.ms/2WxZSvT",
      },
      {
        section: "theater",
        subsection: "",
        title: "‘Richard II’ Review: A Radio King With a Tottering Crown",
        abstract:
          "Electric performances, led by André Holland, transcend didacticism in an audio rendition that replaced a Shakespeare in the Park production.",
        url:
          "https://www.nytimes.com/2020/07/17/theater/richard-ii-review-andre-holland.html",
        uri: "nyt://article/4f1d3ba5-46e2-559f-b442-f1b920411483",
        byline: "By Maya Phillips",
        item_type: "Article",
        updated_date: "2020-07-18T12:29:04-04:00",
        created_date: "2020-07-17T16:04:15-04:00",
        published_date: "2020-07-17T16:04:15-04:00",
        material_type_facet: "",
        kicker: "Critic’s Pick",
        des_facet: ["Theater", "Richard II (Play)"],
        org_facet: ["Public Theater", "Shakespeare in the Park"],
        per_facet: [
          "Ali, Saheem",
          "Holland, Andre (1979- )",
          "Hyman, Miriam A",
          "Shakespeare, William",
        ],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17richard-ll/merlin_174634449_f32392c3-d750-4a3c-a2b2-284dffe8cdf7-superJumbo.jpg",
            format: "superJumbo",
            height: 1384,
            width: 2031,
            type: "image",
            subtype: "photo",
            caption:
              "Andr&eacute; Holland during rehearsals for the Public Theater&rsquo;s radio presentation of &ldquo;Richard II.&rdquo;",
            copyright: "via The Public Theater",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17richard-ll/merlin_174634449_f32392c3-d750-4a3c-a2b2-284dffe8cdf7-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Andr&eacute; Holland during rehearsals for the Public Theater&rsquo;s radio presentation of &ldquo;Richard II.&rdquo;",
            copyright: "via The Public Theater",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17richard-ll/merlin_174634449_f32392c3-d750-4a3c-a2b2-284dffe8cdf7-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Andr&eacute; Holland during rehearsals for the Public Theater&rsquo;s radio presentation of &ldquo;Richard II.&rdquo;",
            copyright: "via The Public Theater",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17richard-ll/merlin_174634449_f32392c3-d750-4a3c-a2b2-284dffe8cdf7-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Andr&eacute; Holland during rehearsals for the Public Theater&rsquo;s radio presentation of &ldquo;Richard II.&rdquo;",
            copyright: "via The Public Theater",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17richard-ll/merlin_174634449_f32392c3-d750-4a3c-a2b2-284dffe8cdf7-articleInline.jpg",
            format: "Normal",
            height: 129,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Andr&eacute; Holland during rehearsals for the Public Theater&rsquo;s radio presentation of &ldquo;Richard II.&rdquo;",
            copyright: "via The Public Theater",
          },
        ],
        short_url: "https://nyti.ms/32rXA50",
      },
      {
        section: "books",
        subsection: "",
        title: "Alex Trebek Is Still in the Game",
        abstract:
          "In his new memoir, the longtime “Jeopardy!” host delivers clues and facts about himself, and looks back on his life as he struggles with advanced pancreatic cancer.",
        url:
          "https://www.nytimes.com/2020/07/17/books/alex-trebek-jeopardy-the-answer-is.html",
        uri: "nyt://article/443a3ecc-993c-5af0-972e-dfe8ccd14fc1",
        byline: "By Alexandra Alter",
        item_type: "Article",
        updated_date: "2020-07-18T14:04:15-04:00",
        created_date: "2020-07-17T05:00:34-04:00",
        published_date: "2020-07-17T05:00:34-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Jeopardy! (TV Program)",
          "Television",
          "The Answer Is ...: Reflections on my Life (Book)",
          "Books and Literature",
          "Pancreatic Cancer",
        ],
        org_facet: [],
        per_facet: ["Trebek, Alex"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/19Trebek/19Trebek-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1366,
            type: "image",
            subtype: "photo",
            caption:
              "&ldquo;There&rsquo;s a certain comfort that comes from knowing a fact,&rdquo; Alex Trebek said.",
            copyright: "Ramona Rosales/AUGUST",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/19Trebek/19Trebek-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "&ldquo;There&rsquo;s a certain comfort that comes from knowing a fact,&rdquo; Alex Trebek said.",
            copyright: "Ramona Rosales/AUGUST",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/19Trebek/19Trebek-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "&ldquo;There&rsquo;s a certain comfort that comes from knowing a fact,&rdquo; Alex Trebek said.",
            copyright: "Ramona Rosales/AUGUST",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/19Trebek/19Trebek-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "&ldquo;There&rsquo;s a certain comfort that comes from knowing a fact,&rdquo; Alex Trebek said.",
            copyright: "Ramona Rosales/AUGUST",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/19Trebek/19Trebek-articleInline.jpg",
            format: "Normal",
            height: 285,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "&ldquo;There&rsquo;s a certain comfort that comes from knowing a fact,&rdquo; Alex Trebek said.",
            copyright: "Ramona Rosales/AUGUST",
          },
        ],
        short_url: "https://nyti.ms/2CjWsWA",
      },
      {
        section: "arts",
        subsection: "",
        title: "Fary Isn’t Joking About Race in France Right Now",
        abstract:
          "The comic is a leading figure in the country’s stand-up scene, known for confronting issues of discrimination and identity. Recently, though, being funny has taken a back seat.",
        url: "https://www.nytimes.com/2020/07/17/arts/fary-standup-france.html",
        uri: "nyt://article/818d0556-5b09-5192-ac28-4846c5468544",
        byline: "By Laura Cappelle",
        item_type: "Article",
        updated_date: "2020-07-17T19:07:51-04:00",
        created_date: "2020-07-17T06:23:00-04:00",
        published_date: "2020-07-17T06:23:00-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Comedy and Humor",
          "Race and Ethnicity",
          "Black Lives Matter Movement",
        ],
        org_facet: [],
        per_facet: ["Lopes, Fary"],
        geo_facet: ["France", "Paris (France)"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17fary1/merlin_174516843_5f53f1b2-d8ae-43b3-87e8-16dfad100832-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1639,
            type: "image",
            subtype: "photo",
            caption:
              "“Originally, I really didn’t want to talk about it,” Fary said of the recent Black Lives Matter protests in France, expressing concern that he would be seen as a spokesperson of the movement.",
            copyright: "Elliott Verdier for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17fary1/17fary1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "“Originally, I really didn’t want to talk about it,” Fary said of the recent Black Lives Matter protests in France, expressing concern that he would be seen as a spokesperson of the movement.",
            copyright: "Elliott Verdier for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17fary1/17fary1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "“Originally, I really didn’t want to talk about it,” Fary said of the recent Black Lives Matter protests in France, expressing concern that he would be seen as a spokesperson of the movement.",
            copyright: "Elliott Verdier for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17fary1/17fary1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "“Originally, I really didn’t want to talk about it,” Fary said of the recent Black Lives Matter protests in France, expressing concern that he would be seen as a spokesperson of the movement.",
            copyright: "Elliott Verdier for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17fary1/merlin_174516843_5f53f1b2-d8ae-43b3-87e8-16dfad100832-articleInline.jpg",
            format: "Normal",
            height: 238,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "“Originally, I really didn’t want to talk about it,” Fary said of the recent Black Lives Matter protests in France, expressing concern that he would be seen as a spokesperson of the movement.",
            copyright: "Elliott Verdier for The New York Times",
          },
        ],
        short_url: "https://nyti.ms/39cNM0k",
      },
      {
        section: "arts",
        subsection: "television",
        title: "‘30 Rock’ Reunion Review: A Few Laughs, a Lot of Blergh",
        abstract:
          "The TV-biz satire spent a joking-not-joking night selling NBCUniversal TV, winking so hard that it injured itself.",
        url:
          "https://www.nytimes.com/2020/07/17/arts/television/30-rock-reunion-review.html",
        uri: "nyt://article/195fcc56-3ab1-5292-bd8d-a7d6e6eb605a",
        byline: "By James Poniewozik",
        item_type: "Article",
        updated_date: "2020-07-18T01:41:32-04:00",
        created_date: "2020-07-17T12:42:32-04:00",
        published_date: "2020-07-17T12:42:32-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Television",
          "30 Rock (TV Program)",
          "Upfronts (Television)",
        ],
        org_facet: ["NBCUniversal"],
        per_facet: [
          "Fey, Tina",
          "Baldwin, Alec",
          "Krakowski, Jane",
          "McBrayer, Jack",
          "Morgan, Tracy",
        ],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17rock-1/17rock-1-superJumbo.jpg",
            format: "superJumbo",
            height: 1152,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Tina Fey reprised her Liz Lemon role in a &ldquo;30 Rock&rdquo; reunion special that doubled as an ad for NBCUniversal.",
            copyright: "NBC",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17rock-1/17rock-1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Tina Fey reprised her Liz Lemon role in a &ldquo;30 Rock&rdquo; reunion special that doubled as an ad for NBCUniversal.",
            copyright: "NBC",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17rock-1/17rock-1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Tina Fey reprised her Liz Lemon role in a &ldquo;30 Rock&rdquo; reunion special that doubled as an ad for NBCUniversal.",
            copyright: "NBC",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17rock-1/17rock-1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Tina Fey reprised her Liz Lemon role in a &ldquo;30 Rock&rdquo; reunion special that doubled as an ad for NBCUniversal.",
            copyright: "NBC",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/17rock-1/17rock-1-articleInline.jpg",
            format: "Normal",
            height: 107,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Tina Fey reprised her Liz Lemon role in a &ldquo;30 Rock&rdquo; reunion special that doubled as an ad for NBCUniversal.",
            copyright: "NBC",
          },
        ],
        short_url: "https://nyti.ms/2WsMzg2",
      },
      {
        section: "arts",
        subsection: "music",
        title: "Drake Clears His Throat With DJ Khaled, and 10 More New Songs",
        abstract:
          "Hear tracks by Mariah Carey, Tiwa Savage, Shamir and others.",
        url:
          "https://www.nytimes.com/2020/07/17/arts/music/playlist-drake-dj-khaled-mariah-carey.html",
        uri: "nyt://article/961383c6-771c-5984-a3c5-6969e590d4e8",
        byline: "By Jon Pareles, Jon Caramanica and Giovanni Russonello",
        item_type: "Article",
        updated_date: "2020-07-18T07:40:40-04:00",
        created_date: "2020-07-17T10:45:29-04:00",
        published_date: "2020-07-17T10:45:29-04:00",
        material_type_facet: "",
        kicker: "The Playlist",
        des_facet: ["Pop and Rock Music", "Rap and Hip-Hop", "Jazz"],
        org_facet: ["Standing on the Corner (Music Group)"],
        per_facet: [
          "DJ Khaled",
          "Drake (Rapper)",
          "Carey, Mariah",
          "Savage, Tiwa",
          "Baby Queen (Singer)",
          "Koang, Gordon",
          "Visitante (1978- )",
          "Shamir, Yoav",
          "Aiko, Jhene",
          "StaySolidRocky (Rapper)",
          "Heath, Jimmy",
          "Salvant, Cecile McLorin",
        ],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17playlist/merlin_155953371_e58e90cb-9554-41b5-bb90-ee9faa7e1678-superJumbo.jpg",
            format: "superJumbo",
            height: 1361,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Drake released a pair of tracks with DJ Khaled that showcase his two sides.",
            copyright: "Chris Delmas/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17playlist/17playlist-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Drake released a pair of tracks with DJ Khaled that showcase his two sides.",
            copyright: "Chris Delmas/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17playlist/17playlist-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Drake released a pair of tracks with DJ Khaled that showcase his two sides.",
            copyright: "Chris Delmas/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17playlist/17playlist-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Drake released a pair of tracks with DJ Khaled that showcase his two sides.",
            copyright: "Chris Delmas/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17playlist/merlin_155953371_e58e90cb-9554-41b5-bb90-ee9faa7e1678-articleInline.jpg",
            format: "Normal",
            height: 126,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Drake released a pair of tracks with DJ Khaled that showcase his two sides.",
            copyright: "Chris Delmas/Agence France-Presse — Getty Images",
          },
        ],
        short_url: "https://nyti.ms/39hAaB3",
      },
      {
        section: "arts",
        subsection: "television",
        title: "Comfort Viewing: 3 Reasons I Love ‘Supermarket Sweep’",
        abstract:
          "In an era of toilet paper shortages and lines outside of supermarkets, this vintage free-for-all, now on Netflix, feels oddly gratifying.",
        url:
          "https://www.nytimes.com/2020/07/17/arts/television/supermarket-sweep-netflix-amazon.html",
        uri: "nyt://article/f248474a-009a-5c3d-88bf-430ab2cae698",
        byline: "By Ali Trachta",
        item_type: "Article",
        updated_date: "2020-07-17T19:07:50-04:00",
        created_date: "2020-07-17T15:35:40-04:00",
        published_date: "2020-07-17T15:35:40-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Television",
          "Quarantine (Life and Culture)",
          "Supermarket Sweep (TV Program)",
        ],
        org_facet: ["Amazon.com Inc", "Netflix Inc"],
        per_facet: ["Ruprecht, David"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17comfort-supermarket/17comfort-supermarket-superJumbo.png",
            format: "superJumbo",
            height: 1563,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Only in “Supermarket Sweep” does it make sense to load one’s shopping cart with five turkeys. But it does make sense.",
            copyright: "Lifetime, via Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17comfort-supermarket/17comfort-supermarket-thumbStandard.png",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Only in “Supermarket Sweep” does it make sense to load one’s shopping cart with five turkeys. But it does make sense.",
            copyright: "Lifetime, via Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17comfort-supermarket/17comfort-supermarket-thumbLarge.png",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Only in “Supermarket Sweep” does it make sense to load one’s shopping cart with five turkeys. But it does make sense.",
            copyright: "Lifetime, via Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17comfort-supermarket/17comfort-supermarket-mediumThreeByTwo210.png",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Only in “Supermarket Sweep” does it make sense to load one’s shopping cart with five turkeys. But it does make sense.",
            copyright: "Lifetime, via Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17comfort-supermarket/17comfort-supermarket-articleInline.png",
            format: "Normal",
            height: 145,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Only in “Supermarket Sweep” does it make sense to load one’s shopping cart with five turkeys. But it does make sense.",
            copyright: "Lifetime, via Netflix",
          },
        ],
        short_url: "https://nyti.ms/2OCg0YW",
      },
      {
        section: "arts",
        subsection: "",
        title: "An Artist Captures 4 Months of Sidewalk Chalk Drawings",
        abstract: "The next messages are yours for the making.",
        url:
          "https://www.nytimes.com/2020/07/17/arts/esther-pearl-watson-diary-project.html",
        uri: "nyt://article/2d058df0-7dc7-5508-b55e-f252e844fbdc",
        byline: "By Esther Pearl Watson",
        item_type: "Article",
        updated_date: "2020-07-17T05:00:15-04:00",
        created_date: "2020-07-17T05:00:15-04:00",
        published_date: "2020-07-17T05:00:15-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Quarantine (Life and Culture)",
          "Black Lives Matter Movement",
          "Graphic Novels",
          "Comic Books and Strips",
          "Creativity",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17diary-esther/17diary-esther-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1207,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17diary-esther/17diary-esther-thumbStandard-v2.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17diary-esther/17diary-esther-thumbLarge-v2.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17diary-esther/17diary-esther-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/arts/17diary-esther/17diary-esther-articleInline.jpg",
            format: "Normal",
            height: 322,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
        ],
        short_url: "https://nyti.ms/2OAm18u",
      },
      {
        section: "arts",
        subsection: "",
        title: "Luther Price, Experimental Artist and Filmmaker, Dies at 58",
        abstract:
          "He explored family, sexuality and death, using found footage, emulsion scraps and dust bunnies as his medium. And he kept his real name a secret.",
        url: "https://www.nytimes.com/2020/07/19/arts/luther-price-dead.html",
        uri: "nyt://article/075570f6-04d6-5b10-8402-5bf247427a26",
        byline: "By Roberta Smith",
        item_type: "Article",
        updated_date: "2020-07-19T11:25:33-04:00",
        created_date: "2020-07-19T10:12:31-04:00",
        published_date: "2020-07-19T10:12:31-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Deaths (Obituaries)", "Art", "Movies"],
        org_facet: ["Massachusetts College of Art and Design"],
        per_facet: ["Price, Luther (1962-2020)"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/obituaries/00Price1/00Price1-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1534,
            type: "image",
            subtype: "photo",
            caption:
              "The artist Luther Price in 2013. His best-known film, “Sodom,” combined footage from gay pornography and biblical epics. ",
            copyright: "Gene Pittman/Walker Art Center",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/obituaries/00Price1/00Price1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "The artist Luther Price in 2013. His best-known film, “Sodom,” combined footage from gay pornography and biblical epics. ",
            copyright: "Gene Pittman/Walker Art Center",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/obituaries/00Price1/00Price1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "The artist Luther Price in 2013. His best-known film, “Sodom,” combined footage from gay pornography and biblical epics. ",
            copyright: "Gene Pittman/Walker Art Center",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/obituaries/00Price1/00Price1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "The artist Luther Price in 2013. His best-known film, “Sodom,” combined footage from gay pornography and biblical epics. ",
            copyright: "Gene Pittman/Walker Art Center",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/07/obituaries/00Price1/00Price1-articleInline.jpg",
            format: "Normal",
            height: 254,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "The artist Luther Price in 2013. His best-known film, “Sodom,” combined footage from gay pornography and biblical epics. ",
            copyright: "Gene Pittman/Walker Art Center",
          },
        ],
        short_url: "https://nyti.ms/3eE86Zn",
      },
      {
        section: "arts",
        subsection: "",
        title: "After #OscarsSoWhite, Disability Waits for Its Moment",
        abstract:
          "Actors with disabilities are rarely tapped to play disabled characters. Ali Stroker, Marlee Matlin and others share their views on representation in the entertainment industry.",
        url:
          "https://www.nytimes.com/2020/07/19/arts/after-oscarssowhite-disability-waits-for-its-moment.html",
        uri: "nyt://article/18129f7b-100c-581a-9745-d741ded131d6",
        byline: "",
        item_type: "Article",
        updated_date: "2020-07-19T06:00:10-04:00",
        created_date: "2020-07-19T06:00:10-04:00",
        published_date: "2020-07-19T06:00:10-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Disabilities",
          "Actors and Actresses",
          "Television",
          "Movies",
          "Music",
        ],
        org_facet: [],
        per_facet: [
          "Matlin, Marlee",
          "Moore, Leroy F Jr",
          "Stroker, Ali (1987- )",
          "Fowler, Micah (Actor)",
          "Potter, Lauren (1990- )",
        ],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/multimedia/16ada-representation-01/merlin_152353368_a35fd721-37c9-4217-8e1e-5600543cade7-superJumbo.jpg",
            format: "superJumbo",
            height: 1414,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "<p>[Image description: Ali Stroker in a wheelchair pumping her fist with other actors dancing around her.] Ms. Stroker, center, as Ado Annie, in the Broadway revival of “Oklahoma!”</p>",
            copyright: "Sara Krulwich/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/multimedia/16ada-representation-01/16ada-representation-01-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "<p>[Image description: Ali Stroker in a wheelchair pumping her fist with other actors dancing around her.] Ms. Stroker, center, as Ado Annie, in the Broadway revival of “Oklahoma!”</p>",
            copyright: "Sara Krulwich/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/multimedia/16ada-representation-01/16ada-representation-01-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "<p>[Image description: Ali Stroker in a wheelchair pumping her fist with other actors dancing around her.] Ms. Stroker, center, as Ado Annie, in the Broadway revival of “Oklahoma!”</p>",
            copyright: "Sara Krulwich/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/multimedia/16ada-representation-01/16ada-representation-01-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "<p>[Image description: Ali Stroker in a wheelchair pumping her fist with other actors dancing around her.] Ms. Stroker, center, as Ado Annie, in the Broadway revival of “Oklahoma!”</p>",
            copyright: "Sara Krulwich/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/multimedia/16ada-representation-01/merlin_152353368_a35fd721-37c9-4217-8e1e-5600543cade7-articleInline.jpg",
            format: "Normal",
            height: 131,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "<p>[Image description: Ali Stroker in a wheelchair pumping her fist with other actors dancing around her.] Ms. Stroker, center, as Ado Annie, in the Broadway revival of “Oklahoma!”</p>",
            copyright: "Sara Krulwich/The New York Times",
          },
        ],
        short_url: "https://nyti.ms/2WBRc7B",
      },
      {
        section: "books",
        subsection: "review",
        title: "Why Intellectuals Support Dictators",
        abstract:
          "Anne Applebaum’s “Twilight of Democracy” examines the role of thinkers and writers who back modern authoritarians.",
        url:
          "https://www.nytimes.com/2020/07/19/books/review/twilight-of-democracy-anne-applebaum.html",
        uri: "nyt://article/4de0587e-870d-58a7-833c-444c64bd2aaf",
        byline: "By Bill Keller",
        item_type: "Article",
        updated_date: "2020-07-19T05:02:38-04:00",
        created_date: "2020-07-19T05:00:04-04:00",
        published_date: "2020-07-19T05:00:04-04:00",
        material_type_facet: "",
        kicker: "nonfiction",
        des_facet: [
          "Books and Literature",
          "Politics and Government",
          "Democracy (Theory and Philosophy)",
          "Twilight of Democracy: The Seductive Lure of the Authoritarian State (Book)",
        ],
        org_facet: ["Law and Justice (Poland)"],
        per_facet: ["Applebaum, Anne", "Soros, George"],
        geo_facet: ["Poland"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/08/02/books/review/02Keller/Keller-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "The Polish presidential campaign, May 2015.",
            copyright: "Wojtek Radwansky/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/02/books/review/02Keller/Keller-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "The Polish presidential campaign, May 2015.",
            copyright: "Wojtek Radwansky/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/02/books/review/02Keller/Keller-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "The Polish presidential campaign, May 2015.",
            copyright: "Wojtek Radwansky/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/02/books/review/02Keller/Keller-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "The Polish presidential campaign, May 2015.",
            copyright: "Wojtek Radwansky/Agence France-Presse — Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/02/books/review/02Keller/Keller-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "The Polish presidential campaign, May 2015.",
            copyright: "Wojtek Radwansky/Agence France-Presse — Getty Images",
          },
        ],
        short_url: "https://nyti.ms/30otBZ7",
      },
      {
        section: "books",
        subsection: "",
        title: "‘Demagogue’ Remembers a Vintage American Bully",
        abstract:
          "Larry Tye talks about his new biography of Joseph McCarthy, the senator whose name is synonymous with reckless accusation and fear-mongering.",
        url:
          "https://www.nytimes.com/2020/07/19/books/demagogue-joseph-mccarthy-larry-tye-interview.html",
        uri: "nyt://article/faa92f9c-76f1-5bdd-ade5-ac141b9880b8",
        byline: "By John Williams",
        item_type: "Article",
        updated_date: "2020-07-19T05:00:00-04:00",
        created_date: "2020-07-19T05:00:00-04:00",
        published_date: "2020-07-19T05:00:00-04:00",
        material_type_facet: "",
        kicker: "5 Things About Your Book",
        des_facet: [
          "Books and Literature",
          "Writing and Writers",
          "United States Politics and Government",
          "Demagogue: The Life and Long Shadow of Senator Joe McCarthy (Book)",
        ],
        org_facet: [],
        per_facet: ["Tye, Larry", "McCarthy, Joseph R"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/19tye1/19tye1-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1357,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/19tye1/19tye1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/19tye1/19tye1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/19tye1/19tye1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/19tye1/19tye1-articleInline.jpg",
            format: "Normal",
            height: 287,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
        ],
        short_url: "https://nyti.ms/2Cr2SmS",
      },
      {
        section: "arts",
        subsection: "television",
        title:
          "What’s on TV Sunday: ‘The Last Dance’ and ‘United Shades of America’",
        abstract:
          "Stream all 10 hours of Michael Jordan’s documentary series, and catch a new season of W. Kamau Bell’s CNN show.",
        url:
          "https://www.nytimes.com/2020/07/19/arts/television/whats-on-tv-sunday-the-last-dance-and-united-shades-of-america.html",
        uri: "nyt://article/acf204be-f579-5e38-a22e-c189abe30ed0",
        byline: "By Lauren Messman",
        item_type: "Article",
        updated_date: "2020-07-19T01:00:06-04:00",
        created_date: "2020-07-19T01:00:06-04:00",
        published_date: "2020-07-19T01:00:06-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Television", "Movies"],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/arts/19tvcol-last/19tvcol-last-superJumbo.jpg",
            format: "superJumbo",
            height: 1366,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Michael Jordan, left, and Magic Johnson, in &ldquo;The Last Dance.&rdquo;",
            copyright: "Andrew D. Bernstein/Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/arts/19tvcol-last/19tvcol-last-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Michael Jordan, left, and Magic Johnson, in &ldquo;The Last Dance.&rdquo;",
            copyright: "Andrew D. Bernstein/Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/arts/19tvcol-last/19tvcol-last-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Michael Jordan, left, and Magic Johnson, in &ldquo;The Last Dance.&rdquo;",
            copyright: "Andrew D. Bernstein/Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/arts/19tvcol-last/19tvcol-last-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Michael Jordan, left, and Magic Johnson, in &ldquo;The Last Dance.&rdquo;",
            copyright: "Andrew D. Bernstein/Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/arts/19tvcol-last/19tvcol-last-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Michael Jordan, left, and Magic Johnson, in &ldquo;The Last Dance.&rdquo;",
            copyright: "Andrew D. Bernstein/Netflix",
          },
        ],
        short_url: "https://nyti.ms/3hkMzqF",
      },
      {
        section: "arts",
        subsection: "",
        title: "Brigid Berlin, Socialite Who Joined Warhol’s World, Dies at 80",
        abstract:
          "Born into privilege, she rejected her upbringing to become a fixture on the New York underground art scene of the 1960s and ’70s.",
        url: "https://www.nytimes.com/2020/07/18/arts/brigid-berlin-dead.html",
        uri: "nyt://article/7501d7de-41b1-5d32-8403-548a6b64044c",
        byline: "By John Leland",
        item_type: "Article",
        updated_date: "2020-07-18T16:28:33-04:00",
        created_date: "2020-07-18T14:34:23-04:00",
        published_date: "2020-07-18T14:34:23-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Deaths (Obituaries)", "Art", "Chelsea Girls (Movie)"],
        org_facet: [],
        per_facet: ["Berlin, Brigid", "Warhol, Andy"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/obituaries/17Berlin/17Berlin-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1412,
            type: "image",
            subtype: "photo",
            caption:
              "Brigid Berlin in 1971. “As near as you can get to the genesis of the art of the ’60s,” a friend said, “she was there.”",
            copyright: "Gerard Malanga",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/obituaries/17Berlin/17Berlin-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Brigid Berlin in 1971. “As near as you can get to the genesis of the art of the ’60s,” a friend said, “she was there.”",
            copyright: "Gerard Malanga",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/obituaries/17Berlin/17Berlin-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Brigid Berlin in 1971. “As near as you can get to the genesis of the art of the ’60s,” a friend said, “she was there.”",
            copyright: "Gerard Malanga",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/obituaries/17Berlin/17Berlin-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Brigid Berlin in 1971. “As near as you can get to the genesis of the art of the ’60s,” a friend said, “she was there.”",
            copyright: "Gerard Malanga",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/obituaries/17Berlin/17Berlin-articleInline.jpg",
            format: "Normal",
            height: 276,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Brigid Berlin in 1971. “As near as you can get to the genesis of the art of the ’60s,” a friend said, “she was there.”",
            copyright: "Gerard Malanga",
          },
        ],
        short_url: "https://nyti.ms/3h7LWQW",
      },
      {
        section: "at-home",
        subsection: "",
        title: "Travel The World With Your Ears",
        abstract:
          "Podcasts can drop you anywhere on the map, without having to leave the comfort of your own couch.",
        url:
          "https://www.nytimes.com/2020/07/18/at-home/coronavirus-travel-podcasts.html",
        uri: "nyt://article/4949dd4b-b6dd-5dc8-80a2-f843815a1498",
        byline: "By Phoebe Lett",
        item_type: "Article",
        updated_date: "2020-07-18T21:50:37-04:00",
        created_date: "2020-07-18T13:00:07-04:00",
        published_date: "2020-07-18T13:00:07-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Quarantine (Life and Culture)",
          "Travel and Vacations",
          "Podcasts",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/12/multimedia/12TRAVELPODCASTS-GRID/12TRAVELPODCASTS-GRID-superJumbo.jpg",
            format: "superJumbo",
            height: 2024,
            width: 2032,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/12/multimedia/12TRAVELPODCASTS-GRID/12TRAVELPODCASTS-GRID-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/12/multimedia/12TRAVELPODCASTS-GRID/12TRAVELPODCASTS-GRID-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/12/multimedia/12TRAVELPODCASTS-GRID/12TRAVELPODCASTS-GRID-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/12/multimedia/12TRAVELPODCASTS-GRID/12TRAVELPODCASTS-GRID-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
        ],
        short_url: "https://nyti.ms/2BaoPWz",
      },
      {
        section: "at-home",
        subsection: "",
        title: "Family-Friendly Movies Made by Diverse Filmmakers",
        abstract:
          "These 8 movies were written, directed by and star people of color, and depict complex stories that can spark conversation.",
        url:
          "https://www.nytimes.com/2020/07/18/at-home/coronavirus-diverse-family-friendly-movie-night.html",
        uri: "nyt://article/4e0ab242-9d19-530d-a31e-f00e222b1dbc",
        byline: "By Stacy Brick",
        item_type: "Article",
        updated_date: "2020-07-18T21:44:42-04:00",
        created_date: "2020-07-18T12:00:09-04:00",
        published_date: "2020-07-18T12:00:09-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Quarantine (Life and Culture)",
          "Movies",
          "Children and Childhood",
          "Hair Love (Movie)",
          "The Little Girl Who Sold the Sun (Movie)",
          "Pachamama (Movie)",
          "Crooklyn (Movie)",
          "The Boy Who Harnessed the Wind (Movie)",
          "See You Yesterday (Movie)",
          "Wadjda (Movie)",
          "Hunt for the Wilderpeople (Movie)",
        ],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18ah-filmheros1/merlin_159623841_b205e7a2-ef50-4158-9091-929076b33b60-superJumbo.jpg",
            format: "superJumbo",
            height: 1080,
            width: 1920,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Sony Pictures Animation",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18ah-filmheros1/18ah-filmheros1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Sony Pictures Animation",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18ah-filmheros1/18ah-filmheros1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Sony Pictures Animation",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18ah-filmheros1/18ah-filmheros1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Sony Pictures Animation",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/multimedia/18ah-filmheros1/merlin_159623841_b205e7a2-ef50-4158-9091-929076b33b60-articleInline.jpg",
            format: "Normal",
            height: 107,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Sony Pictures Animation",
          },
        ],
        short_url: "https://nyti.ms/32v3vGv",
      },
      {
        section: "books",
        subsection: "review",
        title: "Learning to Heal, With a Little Fur Machine",
        abstract:
          "In Joan Bauer’s “Raising Lumie,” training a future guide dog helps a newly orphaned girl navigate loss.",
        url:
          "https://www.nytimes.com/2020/07/18/books/review/joan-bauer-raising-lumie.html",
        uri: "nyt://article/93866b34-ca2d-5ec0-a89c-7c8e61a4e014",
        byline: "By Elisabeth Egan",
        item_type: "Article",
        updated_date: "2020-07-18T14:43:19-04:00",
        created_date: "2020-07-18T11:25:38-04:00",
        published_date: "2020-07-18T11:25:38-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Books and Literature", "Raising Lumie (Book)"],
        org_facet: [],
        per_facet: ["Bauer, Joan"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26-BKS_EGAN_KIDS/26-BKS_EGAN_KIDS-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1366,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26-BKS_EGAN_KIDS/26-BKS_EGAN_KIDS-thumbStandard-v2.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26-BKS_EGAN_KIDS/26-BKS_EGAN_KIDS-thumbLarge-v2.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26-BKS_EGAN_KIDS/26-BKS_EGAN_KIDS-mediumThreeByTwo210-v2.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26-BKS_EGAN_KIDS/26-BKS_EGAN_KIDS-articleInline.jpg",
            format: "Normal",
            height: 285,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "",
          },
        ],
        short_url: "https://nyti.ms/2DXoLdV",
      },
      {
        section: "at-home",
        subsection: "",
        title: "Finally Write That Short Story",
        abstract:
          "It’s time to stop talking about writing and write. The best-selling author of “Prep” and “Rodham” offers a plan.",
        url:
          "https://www.nytimes.com/2020/07/18/at-home/coronavirus-fiction-writing.html",
        uri: "nyt://article/a7286094-a4fd-54ba-a9e2-e30955158b9c",
        byline: "By Curtis Sittenfeld",
        item_type: "Article",
        updated_date: "2020-07-18T21:52:18-04:00",
        created_date: "2020-07-18T10:00:07-04:00",
        published_date: "2020-07-18T10:00:07-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Quarantine (Life and Culture)",
          "Writing and Writers",
          "Reading and Writing Skills (Education)",
        ],
        org_facet: [],
        per_facet: ["Sittenfeld, Curtis"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/multimedia/19ah-writefiction2/19ah-writefiction2-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1640,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Jenn Ackerman for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/multimedia/19ah-writefiction2/19ah-writefiction2-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Jenn Ackerman for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/multimedia/19ah-writefiction2/19ah-writefiction2-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Jenn Ackerman for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/multimedia/19ah-writefiction2/19ah-writefiction2-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Jenn Ackerman for The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/multimedia/19ah-writefiction2/19ah-writefiction2-articleInline.jpg",
            format: "Normal",
            height: 237,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Jenn Ackerman for The New York Times",
          },
        ],
        short_url: "https://nyti.ms/3eFJrUt",
      },
      {
        section: "arts",
        subsection: "",
        title: "How to Kill a Vampire: Not With This Kit, Apparently",
        abstract:
          "The kit, complete with three crucifixes and a pistol, goes up for auction next week. Experts say it might not save you from the undead, but that’s beside the point.",
        url:
          "https://www.nytimes.com/2020/07/18/arts/vampire-slaying-kit-auction-uk.html",
        uri: "nyt://article/d2a7b351-be40-5ec1-a480-b2dbe12c3f00",
        byline: "By Aimee Ortiz",
        item_type: "Article",
        updated_date: "2020-07-18T12:00:30-04:00",
        created_date: "2020-07-18T09:30:07-04:00",
        published_date: "2020-07-18T09:30:07-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Vampires", "Auctions", "Antiques", "Art"],
        org_facet: ["Hansons Auctioneers (Derbyshire, England)"],
        per_facet: [],
        geo_facet: ["Great Britain"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/08/11/multimedia/00xp-vampire/00xp-vampire-superJumbo.jpg",
            format: "superJumbo",
            height: 2047,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "It’s possible a long-ago fan of horror fiction assembled this kit for killing vampires. It includes a pistol, crucifixes and other objects associated with hunting the undead bloodsuckers.",
            copyright: "Hansons",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/11/multimedia/00xp-vampire/00xp-vampire-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "It’s possible a long-ago fan of horror fiction assembled this kit for killing vampires. It includes a pistol, crucifixes and other objects associated with hunting the undead bloodsuckers.",
            copyright: "Hansons",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/11/multimedia/00xp-vampire/00xp-vampire-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "It’s possible a long-ago fan of horror fiction assembled this kit for killing vampires. It includes a pistol, crucifixes and other objects associated with hunting the undead bloodsuckers.",
            copyright: "Hansons",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/11/multimedia/00xp-vampire/00xp-vampire-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "It’s possible a long-ago fan of horror fiction assembled this kit for killing vampires. It includes a pistol, crucifixes and other objects associated with hunting the undead bloodsuckers.",
            copyright: "Hansons",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/08/11/multimedia/00xp-vampire/00xp-vampire-articleInline.jpg",
            format: "Normal",
            height: 190,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "It’s possible a long-ago fan of horror fiction assembled this kit for killing vampires. It includes a pistol, crucifixes and other objects associated with hunting the undead bloodsuckers.",
            copyright: "Hansons",
          },
        ],
        short_url: "https://nyti.ms/3eAhzB6",
      },
      {
        section: "at-home",
        subsection: "",
        title: "Sing Figaro’s Aria and Diagram Your Garden",
        abstract:
          "This week, watch Rossini’s ‘The Barber of Seville,’ learn the history of the ballot and chuckle at stand-up comics.",
        url:
          "https://www.nytimes.com/2020/07/18/at-home/coronavirus-what-to-do-this-week.html",
        uri: "nyt://article/bd77ec08-1575-5a06-aa0a-a8fc7b178ce7",
        byline: "By Adriana Balsamo and Hilary Moss",
        item_type: "Article",
        updated_date: "2020-07-18T21:37:40-04:00",
        created_date: "2020-07-18T05:00:11-04:00",
        published_date: "2020-07-18T05:00:11-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Quarantine (Life and Culture)",
          "Flowers and Plants",
          "Democracy (Theory and Philosophy)",
          "Comedy and Humor",
          "Opera",
        ],
        org_facet: ["Smithsonian Institution"],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/multimedia/19ah-cal-web-02/19ah-cal-web-02-superJumbo.jpg",
            format: "superJumbo",
            height: 912,
            width: 794,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Nadia Hafid",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/multimedia/19ah-cal-web-02/19ah-cal-web-02-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Nadia Hafid",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/multimedia/19ah-cal-web-02/19ah-cal-web-02-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Nadia Hafid",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/multimedia/19ah-cal-web-02/19ah-cal-web-02-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Nadia Hafid",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/multimedia/19ah-cal-web-02/19ah-cal-web-02-articleInline.jpg",
            format: "Normal",
            height: 218,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Nadia Hafid",
          },
        ],
        short_url: "https://nyti.ms/2CLdzR6",
      },
      {
        section: "books",
        subsection: "review",
        title: "The Horror Novel Lurking in Your Busy Online Life",
        abstract:
          "The genre relies on solitude and isolation to generate fear. But virtual connection is an illusion that cyber-horror writers are beginning to exploit.",
        url:
          "https://www.nytimes.com/2020/07/18/books/review/cyber-horror-virtual-life-uncanny-valley.html",
        uri: "nyt://article/da2d9e99-09a5-5123-a573-a6fb1d9b5db7",
        byline: "By Margot Harrison",
        item_type: "Article",
        updated_date: "2020-07-18T18:19:59-04:00",
        created_date: "2020-07-18T05:00:04-04:00",
        published_date: "2020-07-18T05:00:04-04:00",
        material_type_facet: "",
        kicker: "essay",
        des_facet: [
          "Books and Literature",
          "Computers and the Internet",
          "Artificial Intelligence",
          "Social Media",
        ],
        org_facet: [],
        per_facet: ["Kurosawa, Kiyoshi"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26Harrison/26Harrison-superJumbo.jpg",
            format: "superJumbo",
            height: 1262,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Julia Dufossé",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26Harrison/26Harrison-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Julia Dufossé",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26Harrison/26Harrison-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Julia Dufossé",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26Harrison/26Harrison-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Julia Dufossé",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26Harrison/26Harrison-articleInline.jpg",
            format: "Normal",
            height: 117,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Julia Dufossé",
          },
        ],
        short_url: "https://nyti.ms/2ZCXKow",
      },
      {
        section: "arts",
        subsection: "television",
        title:
          "What’s on TV Saturday: ‘Father Soldier Son’ and the Dance on Camera Festival",
        abstract:
          "Stream a documentary about a family shaped by war, and catch a festival that celebrates all the ways dance can be represented onscreen.",
        url:
          "https://www.nytimes.com/2020/07/18/arts/television/whats-on-tv-saturday-father-soldier-son-and-the-dance-on-camera-festival.html",
        uri: "nyt://article/120334d1-7aa8-586d-b46d-1d324040a3f0",
        byline: "By Lauren Messman",
        item_type: "Article",
        updated_date: "2020-07-18T01:49:02-04:00",
        created_date: "2020-07-18T01:00:06-04:00",
        published_date: "2020-07-18T01:00:06-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Television", "Movies"],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/18tvcol-father/merlin_174439077_20bebd4e-43b3-4298-9930-c138ed0ccb7c-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Master Sgt. Brian Eisch in &ldquo;Father Soldier Son.&rdquo;",
            copyright: "Marcus Yam/Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/18tvcol-father/18tvcol-father-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Master Sgt. Brian Eisch in &ldquo;Father Soldier Son.&rdquo;",
            copyright: "Marcus Yam/Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/18tvcol-father/18tvcol-father-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Master Sgt. Brian Eisch in &ldquo;Father Soldier Son.&rdquo;",
            copyright: "Marcus Yam/Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/18tvcol-father/merlin_174439077_20bebd4e-43b3-4298-9930-c138ed0ccb7c-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Master Sgt. Brian Eisch in &ldquo;Father Soldier Son.&rdquo;",
            copyright: "Marcus Yam/Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/18/arts/18tvcol-father/merlin_174439077_20bebd4e-43b3-4298-9930-c138ed0ccb7c-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Master Sgt. Brian Eisch in &ldquo;Father Soldier Son.&rdquo;",
            copyright: "Marcus Yam/Netflix",
          },
        ],
        short_url: "https://nyti.ms/30pUKL8",
      },
      {
        section: "arts",
        subsection: "music",
        title:
          "Gabriella Tucci, 90, Dies; Italian Soprano and Met Opera Mainstay",
        abstract:
          "Ms. Tucci’s voice had luster, and she brought refinement to her singing. She sang 20 roles at the Met, where her heyday was the 1960s.",
        url:
          "https://www.nytimes.com/2020/07/17/arts/music/gabriella-tucci-dead.html",
        uri: "nyt://article/8310ce61-c037-5445-b9db-ead04ee6e13d",
        byline: "By Anthony Tommasini",
        item_type: "Article",
        updated_date: "2020-07-18T22:52:19-04:00",
        created_date: "2020-07-17T20:03:11-04:00",
        published_date: "2020-07-17T20:03:11-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Opera", "Deaths (Obituaries)"],
        org_facet: ["Metropolitan Opera"],
        per_facet: ["Tucci, Gabriella"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/obituaries/19Tucci-obit2/merlin_174529719_6e2316b6-35d1-49b9-b8cd-9db3e3d3f169-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1697,
            type: "image",
            subtype: "photo",
            caption:
              "Gabriella Tucci as Marguerite in a 1965-66 production of Gounod&rsquo;s &ldquo;Faust&rdquo; at the Metropolitan Opera, where she sang for 13 consecutive seasons.",
            copyright: "Louis Melancon/Metropolitan Opera",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/obituaries/19Tucci-obit2/17Tucci2-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Gabriella Tucci as Marguerite in a 1965-66 production of Gounod&rsquo;s &ldquo;Faust&rdquo; at the Metropolitan Opera, where she sang for 13 consecutive seasons.",
            copyright: "Louis Melancon/Metropolitan Opera",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/obituaries/19Tucci-obit2/17Tucci2-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Gabriella Tucci as Marguerite in a 1965-66 production of Gounod&rsquo;s &ldquo;Faust&rdquo; at the Metropolitan Opera, where she sang for 13 consecutive seasons.",
            copyright: "Louis Melancon/Metropolitan Opera",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/obituaries/19Tucci-obit2/17Tucci2-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Gabriella Tucci as Marguerite in a 1965-66 production of Gounod&rsquo;s &ldquo;Faust&rdquo; at the Metropolitan Opera, where she sang for 13 consecutive seasons.",
            copyright: "Louis Melancon/Metropolitan Opera",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/obituaries/19Tucci-obit2/merlin_174529719_6e2316b6-35d1-49b9-b8cd-9db3e3d3f169-articleInline.jpg",
            format: "Normal",
            height: 229,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Gabriella Tucci as Marguerite in a 1965-66 production of Gounod&rsquo;s &ldquo;Faust&rdquo; at the Metropolitan Opera, where she sang for 13 consecutive seasons.",
            copyright: "Louis Melancon/Metropolitan Opera",
          },
        ],
        short_url: "https://nyti.ms/2BdzfVy",
      },
      {
        section: "nyregion",
        subsection: "",
        title: "Jane Walentas, Who Planted a Carousel in Dumbo, Dies at 76",
        abstract:
          "With her husband, David, Ms. Walentas helped develop the Brooklyn waterfront neighborhood into a desirable address — and gave it an unusual gift.",
        url:
          "https://www.nytimes.com/2020/07/17/nyregion/jane-walentas-dead.html",
        uri: "nyt://article/b1022ef5-38f0-5a4d-b990-f63fa82e79c3",
        byline: "By Penelope Green",
        item_type: "Article",
        updated_date: "2020-07-18T22:57:12-04:00",
        created_date: "2020-07-17T19:35:31-04:00",
        published_date: "2020-07-17T19:35:31-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: [
          "Area Planning and Renewal",
          "Real Estate and Housing (Residential)",
          "Carousels",
        ],
        org_facet: [],
        per_facet: ["Walentas, David C", "Walentas, Jane"],
        geo_facet: ["Dumbo (Brooklyn, NY)"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/obituaries/17Walentas3/17Walentas3-superJumbo.jpg",
            format: "superJumbo",
            height: 1370,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "Jane Walentas and her husband, David, with the antique carousel that she restored and installed along the Dumbo waterfront in Brooklyn. ",
            copyright: "Nancy Siesel/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/obituaries/17Walentas3/17Walentas3-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Jane Walentas and her husband, David, with the antique carousel that she restored and installed along the Dumbo waterfront in Brooklyn. ",
            copyright: "Nancy Siesel/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/obituaries/17Walentas3/17Walentas3-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Jane Walentas and her husband, David, with the antique carousel that she restored and installed along the Dumbo waterfront in Brooklyn. ",
            copyright: "Nancy Siesel/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/obituaries/17Walentas3/17Walentas3-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Jane Walentas and her husband, David, with the antique carousel that she restored and installed along the Dumbo waterfront in Brooklyn. ",
            copyright: "Nancy Siesel/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/17/obituaries/17Walentas3/17Walentas3-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Jane Walentas and her husband, David, with the antique carousel that she restored and installed along the Dumbo waterfront in Brooklyn. ",
            copyright: "Nancy Siesel/The New York Times",
          },
        ],
        short_url: "https://nyti.ms/2OzKoDh",
      },
      {
        section: "obituaries",
        subsection: "",
        title:
          "Brandis Kemp, Character Actress and ‘Fridays’ Original, Dies at 76",
        abstract:
          "Ms. Kemp told comically gruesome fortunes on “Fridays” and made doctors’ lives miserable on “AfterMASH.” She died of a brain tumor and complications of Covid-19.",
        url:
          "https://www.nytimes.com/2020/07/17/obituaries/brandis-kemp-dead-coronavirus.html",
        uri: "nyt://article/cea65501-ebd9-5d1f-9f86-47aa7a3405d7",
        byline: "By Anita Gates",
        item_type: "Article",
        updated_date: "2020-07-17T18:33:16-04:00",
        created_date: "2020-07-17T16:24:15-04:00",
        published_date: "2020-07-17T16:24:15-04:00",
        material_type_facet: "",
        kicker: "Those We’ve Lost",
        des_facet: [
          "Deaths (Obituaries)",
          "Coronavirus (2019-nCoV)",
          "Television",
          "Actors and Actresses",
        ],
        org_facet: [],
        per_facet: ["Kemp, Brandis (1944-2020)"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/obituaries/16Kemp-lost/16Kemp-lost-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1476,
            type: "image",
            subtype: "photo",
            caption:
              "Brandis Kemp was the fashionably frizzy redhead on the sketch-comedy show “Fridays” (1980-82), ABC’s answer to “Saturday Night Live,” alongside Larry David, Michael Richards and others.",
            copyright: "Walt Disney Television, via Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/obituaries/16Kemp-lost/16Kemp-lost-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "Brandis Kemp was the fashionably frizzy redhead on the sketch-comedy show “Fridays” (1980-82), ABC’s answer to “Saturday Night Live,” alongside Larry David, Michael Richards and others.",
            copyright: "Walt Disney Television, via Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/obituaries/16Kemp-lost/16Kemp-lost-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "Brandis Kemp was the fashionably frizzy redhead on the sketch-comedy show “Fridays” (1980-82), ABC’s answer to “Saturday Night Live,” alongside Larry David, Michael Richards and others.",
            copyright: "Walt Disney Television, via Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/obituaries/16Kemp-lost/16Kemp-lost-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "Brandis Kemp was the fashionably frizzy redhead on the sketch-comedy show “Fridays” (1980-82), ABC’s answer to “Saturday Night Live,” alongside Larry David, Michael Richards and others.",
            copyright: "Walt Disney Television, via Getty Images",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/obituaries/16Kemp-lost/16Kemp-lost-articleInline.jpg",
            format: "Normal",
            height: 264,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "Brandis Kemp was the fashionably frizzy redhead on the sketch-comedy show “Fridays” (1980-82), ABC’s answer to “Saturday Night Live,” alongside Larry David, Michael Richards and others.",
            copyright: "Walt Disney Television, via Getty Images",
          },
        ],
        short_url: "https://nyti.ms/2DU42aV",
      },
      {
        section: "t-magazine",
        subsection: "",
        title: "A Portuguese Artist’s Chilled Tomato Soup",
        abstract:
          "For a simple lunch or dinner, Vanessa Barragão often makes arjamolho, which is healthy, flavorful and perfect for summer.",
        url:
          "https://www.nytimes.com/2020/07/17/t-magazine/summer-recipes-arjamolho-soup-vanessa-barragao.html",
        uri: "nyt://article/6272552c-6ed6-58ce-9523-67479ee86738",
        byline: "By Nick Marino",
        item_type: "Article",
        updated_date: "2020-07-17T19:07:52-04:00",
        created_date: "2020-07-17T15:48:57-04:00",
        published_date: "2020-07-17T15:48:57-04:00",
        material_type_facet: "",
        kicker: "One Good Meal",
        des_facet: [
          "Art",
          "Textiles",
          "Food",
          "Recipes",
          "Cooking and Cookbooks",
          "Soups",
        ],
        org_facet: [],
        per_facet: ["Barragao, Vanessa"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/15/t-magazine/15tmag-barragao-03/15tmag-barragao-03-superJumbo.jpg",
            format: "superJumbo",
            height: 1535,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "You can portion your arjamolho into small bowls if you’re using it as a side dish. Though you might be tempted to eat straight from the serving bowl.",
            copyright: "Pedro Guimarães",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/15/t-magazine/15tmag-barragao-03/15tmag-barragao-03-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "You can portion your arjamolho into small bowls if you’re using it as a side dish. Though you might be tempted to eat straight from the serving bowl.",
            copyright: "Pedro Guimarães",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/15/t-magazine/15tmag-barragao-03/15tmag-barragao-03-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "You can portion your arjamolho into small bowls if you’re using it as a side dish. Though you might be tempted to eat straight from the serving bowl.",
            copyright: "Pedro Guimarães",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/15/t-magazine/15tmag-barragao-03/15tmag-barragao-03-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "You can portion your arjamolho into small bowls if you’re using it as a side dish. Though you might be tempted to eat straight from the serving bowl.",
            copyright: "Pedro Guimarães",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/15/t-magazine/15tmag-barragao-03/15tmag-barragao-03-articleInline.jpg",
            format: "Normal",
            height: 142,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "You can portion your arjamolho into small bowls if you’re using it as a side dish. Though you might be tempted to eat straight from the serving bowl.",
            copyright: "Pedro Guimarães",
          },
        ],
        short_url: "https://nyti.ms/2BaiqLd",
      },
      {
        section: "arts",
        subsection: "design",
        title: "Cuomo Says N.Y.C. Museums Won’t Reopen Monday",
        abstract:
          "New York City is moving to Phase 4 of its reopening plan, but indoor cultural attractions such as museums will stay shut for the time being.",
        url:
          "https://www.nytimes.com/2020/07/17/arts/design/nyc-museums-phase-4.html",
        uri: "nyt://article/eb2f5787-f8b9-5139-ac7b-a0116457d741",
        byline: "By Sarah Bahr",
        item_type: "Article",
        updated_date: "2020-07-18T01:58:51-04:00",
        created_date: "2020-07-17T15:48:03-04:00",
        published_date: "2020-07-17T15:48:03-04:00",
        material_type_facet: "",
        kicker: "",
        des_facet: ["Coronavirus Reopenings", "Museums", "Art"],
        org_facet: ["Museum of the City of New York"],
        per_facet: ["Cuomo, Andrew M", "Donhauser, Whitney"],
        geo_facet: ["New York City"],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/arts/16museum-virus-item/merlin_173962566_830e6e19-b5e0-4cb0-b7ac-4238b88661fc-superJumbo.jpg",
            format: "superJumbo",
            height: 1365,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption:
              "The Museum of the City of New York, which had at one point been planning for a July 23 reopening.",
            copyright: "Chang W. Lee/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/arts/16museum-virus-item/16museum-virus-item-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption:
              "The Museum of the City of New York, which had at one point been planning for a July 23 reopening.",
            copyright: "Chang W. Lee/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/arts/16museum-virus-item/16museum-virus-item-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption:
              "The Museum of the City of New York, which had at one point been planning for a July 23 reopening.",
            copyright: "Chang W. Lee/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/arts/16museum-virus-item/merlin_173962566_830e6e19-b5e0-4cb0-b7ac-4238b88661fc-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption:
              "The Museum of the City of New York, which had at one point been planning for a July 23 reopening.",
            copyright: "Chang W. Lee/The New York Times",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/arts/16museum-virus-item/merlin_173962566_830e6e19-b5e0-4cb0-b7ac-4238b88661fc-articleInline.jpg",
            format: "Normal",
            height: 127,
            width: 190,
            type: "image",
            subtype: "photo",
            caption:
              "The Museum of the City of New York, which had at one point been planning for a July 23 reopening.",
            copyright: "Chang W. Lee/The New York Times",
          },
        ],
        short_url: "https://nyti.ms/3jeGHkp",
      },
      {
        section: "movies",
        subsection: "",
        title: "How Charlize Theron and KiKi Layne Spar in ‘The Old Guard’",
        abstract:
          "The director Gina Prince-Bythewood narrates an action sequence from her film.",
        url:
          "https://www.nytimes.com/2020/07/17/movies/the-old-guard-clip.html",
        uri: "nyt://article/6fe5a997-cbde-577f-a4d0-4fe794220450",
        byline: "By Mekado Murphy",
        item_type: "Article",
        updated_date: "2020-07-18T07:42:01-04:00",
        created_date: "2020-07-17T09:36:53-04:00",
        published_date: "2020-07-17T09:36:53-04:00",
        material_type_facet: "",
        kicker: "anatomy of a scene",
        des_facet: ["Movies", "The Old Guard (Movie)"],
        org_facet: [],
        per_facet: [
          "Prince-Bythewood, Gina",
          "Theron, Charlize",
          "Layne, KiKi",
        ],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/arts/oldguard-anatomy1/oldguard-anatomy1-superJumbo.jpg",
            format: "superJumbo",
            height: 1152,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Aimee Spinks/Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/arts/oldguard-anatomy1/oldguard-anatomy1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Aimee Spinks/Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/arts/oldguard-anatomy1/oldguard-anatomy1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Aimee Spinks/Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/arts/oldguard-anatomy1/oldguard-anatomy1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Aimee Spinks/Netflix",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/16/arts/oldguard-anatomy1/oldguard-anatomy1-articleInline.jpg",
            format: "Normal",
            height: 107,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Aimee Spinks/Netflix",
          },
        ],
        short_url: "https://nyti.ms/3eHwc5A",
      },
      {
        section: "books",
        subsection: "review",
        title: "A Novel That Unfolds in a Day, and Other Historical Fiction",
        abstract:
          "In the midst of a tense time, these books will remind you of what humanity has survived.",
        url:
          "https://www.nytimes.com/2020/07/17/books/review/the-voyage-of-the-morning-light-marina-endicott-historical-fiction.html",
        uri: "nyt://article/65e74341-1c3f-5fd4-90ad-7fd5fb2bff0a",
        byline: "By Alida Becker",
        item_type: "Article",
        updated_date: "2020-07-17T18:37:21-04:00",
        created_date: "2020-07-17T05:00:11-04:00",
        published_date: "2020-07-17T05:00:11-04:00",
        material_type_facet: "",
        kicker: "Fiction",
        des_facet: [
          "Books and Literature",
          "The Voyage of the Morning Light (Book)",
          "The Paris Hours: A Novel (Book)",
          "Inheritors (Book)",
        ],
        org_facet: [],
        per_facet: [
          "Endicott, Marina",
          "George, Alex (Author)",
          "Serizawa, Asako",
        ],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/19Becker/19Becker-superJumbo.jpg",
            format: "superJumbo",
            height: 813,
            width: 1410,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Simone Martin-Newberry",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/19Becker/19Becker-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Simone Martin-Newberry",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/19Becker/19Becker-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Simone Martin-Newberry",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/19Becker/19Becker-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Simone Martin-Newberry",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/19Becker/19Becker-articleInline.jpg",
            format: "Normal",
            height: 110,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Simone Martin-Newberry",
          },
        ],
        short_url: "https://nyti.ms/2CkoJwe",
      },
      {
        section: "books",
        subsection: "review",
        title:
          "Shakespeare Lost His Son to Plague. A Novel Asks How It Shaped His Art.",
        abstract:
          "The playwright’s son died at 11. “Hamnet,” by the novelist Maggie O’Farrell, considers the death’s reverberations on his family, and his work.",
        url:
          "https://www.nytimes.com/2020/07/17/books/review/hamnet-maggie-ofarrell.html",
        uri: "nyt://article/e60cbfcc-0e0d-54a4-917d-fef11bcefe01",
        byline: "By Geraldine Brooks",
        item_type: "Article",
        updated_date: "2020-07-17T19:07:48-04:00",
        created_date: "2020-07-17T05:00:10-04:00",
        published_date: "2020-07-17T05:00:10-04:00",
        material_type_facet: "",
        kicker: "fiction",
        des_facet: ["Books and Literature", "Hamnet (Book)"],
        org_facet: [],
        per_facet: ["O'Farrell, Maggie"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/19Brooks-COVER/19Brooks-COVER-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1644,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Leigh Guldig",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/19Brooks-COVER/19Brooks-COVER-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Leigh Guldig",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/19Brooks-COVER/19Brooks-COVER-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Leigh Guldig",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/19Brooks-COVER/19Brooks-COVER-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Leigh Guldig",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/19Brooks-COVER/19Brooks-COVER-articleInline.jpg",
            format: "Normal",
            height: 237,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "Leigh Guldig",
          },
        ],
        short_url: "https://nyti.ms/3eA6Jeb",
      },
      {
        section: "books",
        subsection: "review",
        title:
          "In Contemporary Trinidad, a Widow Rediscovers the Meaning of Home",
        abstract:
          "In Ingrid Persaud’s debut novel, “Love After Love,” a dark secret threatens to crumble a makeshift family.",
        url:
          "https://www.nytimes.com/2020/07/17/books/review/ingrid-persaud-love-after-love.html",
        uri: "nyt://article/f504739b-22b6-5458-aff6-3acd5802295c",
        byline: "By Gabriel Bump",
        item_type: "Article",
        updated_date: "2020-07-17T17:19:24-04:00",
        created_date: "2020-07-17T05:00:10-04:00",
        published_date: "2020-07-17T05:00:10-04:00",
        material_type_facet: "",
        kicker: "Fiction",
        des_facet: ["Books and Literature", "Love After Love: A Novel (Book)"],
        org_facet: [],
        per_facet: ["Persaud, Ingrid"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/Bump1/Bump1-superJumbo.jpg",
            format: "superJumbo",
            height: 2048,
            width: 1535,
            type: "image",
            subtype: "photo",
            caption: "Ingrid Persaud",
            copyright: "Russell Watson",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/Bump1/Bump1-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "Ingrid Persaud",
            copyright: "Russell Watson",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/Bump1/Bump1-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "Ingrid Persaud",
            copyright: "Russell Watson",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/Bump1/Bump1-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "Ingrid Persaud",
            copyright: "Russell Watson",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/19/books/review/Bump1/Bump1-articleInline.jpg",
            format: "Normal",
            height: 254,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "Ingrid Persaud",
            copyright: "Russell Watson",
          },
        ],
        short_url: "https://nyti.ms/32qk9Hj",
      },
      {
        section: "books",
        subsection: "review",
        title:
          "A Roaring, Full-Throttle Thriller, Crackling With Tension and Charm",
        abstract:
          "In S.A. Cosby’s “Blacktop Wasteland,” which is laced with nonstop action, a small-town mechanic returns to crime one last time.",
        url:
          "https://www.nytimes.com/2020/07/17/books/review/blacktop-wasteland-s-a-crosby.html",
        uri: "nyt://article/10332313-1621-5d18-a3b8-2e7aa3a8032f",
        byline: "By Daniel Nieh",
        item_type: "Article",
        updated_date: "2020-07-17T18:38:18-04:00",
        created_date: "2020-07-17T05:00:07-04:00",
        published_date: "2020-07-17T05:00:07-04:00",
        material_type_facet: "",
        kicker: "Fiction",
        des_facet: ["Books and Literature", "Blacktop Wasteland (Book)"],
        org_facet: [],
        per_facet: ["Cosby, S A"],
        geo_facet: [],
        multimedia: [
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26Nieh/26Nieh-superJumbo.jpg",
            format: "superJumbo",
            height: 1090,
            width: 2048,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The Heads of State",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26Nieh/26Nieh-thumbStandard.jpg",
            format: "Standard Thumbnail",
            height: 75,
            width: 75,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The Heads of State",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26Nieh/26Nieh-thumbLarge.jpg",
            format: "thumbLarge",
            height: 150,
            width: 150,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The Heads of State",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26Nieh/26Nieh-mediumThreeByTwo210.jpg",
            format: "mediumThreeByTwo210",
            height: 140,
            width: 210,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The Heads of State",
          },
          {
            url:
              "https://static01.nyt.com/images/2020/07/26/books/review/26Nieh/26Nieh-articleInline.jpg",
            format: "Normal",
            height: 101,
            width: 190,
            type: "image",
            subtype: "photo",
            caption: "",
            copyright: "The Heads of State",
          },
        ],
        short_url: "https://nyti.ms/3jfnD5m",
      },
    ],
  };

  var results = [
    {
      category: "home",
      result: homeObjectFromApi,
    },
    {
      category: "arts",
      result: artsObjectFromApi,
    },
  ];

  console.log(results);
  return results;
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