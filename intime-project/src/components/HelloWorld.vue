<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Here you can find all the elements that you are
      gonna need for creating the Intime webpage.
    </p>
    <br />
    <p class="titoli">Side Menu</p>
    <div class="container" v-if="menu"></div>
    <a href="#" v-on:click="openClose()">
      <div class="h2 mb-0">
        <b-icon icon="chevron-double-right"></b-icon>
      </div>
    </a>
    <br />
    <br />
    <!-- ------------------ -->
    <p class="titoli">Progress Bar</p>
    <div class="progress">
      <div
        class="progress-bar"
        role="progressbar"
        style="width: 25%"
        aria-valuenow="25"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
    <br />
    <!-- ------------------- -->
    <Hamburger></Hamburger>
    <!-- ----------------------- -->
    <p class="titoli">Accordion</p>
    <!-- accordion that works -->
    <div role="tablist">
      <!-- inizio for -->
      <span>{{currentCategory}}</span>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button
            block
            v-b-toggle.accordion-1
            variant="info"
            v-on:click="setCategory('Arts')"
          >Arts</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>Category Arts</b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
      <!-- fine for -->

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button
            block
            v-b-toggle.accordion-sport
            variant="info"
            v-on:click="setCategory('sport')"
          >Sport</b-button>
        </b-card-header>
        <b-collapse id="accordion-sport" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>category sport</b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button
            block
            v-b-toggle.accordion-3
            variant="info"
            v-on:click="setCategory('Business')"
          >Business</b-button>
        </b-card-header>
        <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>Category Business</b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>

    <!-- ----------------------- -->
    <p class="titoli">Wizard</p>
    <div class="wizard" v-if="firstTime === true">
      <p v-if="step === 0">First time visiting!</p>
      <p v-if="step === 1">Step 1</p>
      <p v-if="step === 2">Step 2</p>
      <button v-on:click="counter">Let's start</button>
    </div>
    <br />

    <!-- pill with x -->
    <div class="tags">
      <p class="titoli">Tags</p>
      <b-button variant="success" v-on:click="selectKeyword('aaaa')">
        Button
        Cat 1
        <b-button
          type="button"
          class="close"
          aria-label="Close"
          v-on:click.stop="removeKeyword('bbbb')"
        >
          <span aria-hidden="true">×</span>
        </b-button>
      </b-button>
    </div>
    <br />
    <br />

    <!-- -------------- -->
    <!-- --------------- -->

    <p class="titoli">Search Bar</p>
    <input type="search" class="search" placeholder="Search..." />
  </div>
</template>

<script>
import Hamburger from "./Hamburger.vue";

export default {
  name: "HelloWorld",
  components: {
    Hamburger
  },
  props: {
    msg: String
  },
  data() {
    return {
      currentCategory: "",
      firstTime: true,
      step: 0,
      menu: false
    };
  },
  methods: {
    setCategory: function(categoryName) {
      this.currentCategory = categoryName;
    },
    counter: function() {
      this.step += 1;
    },
    removeKeyword: function(keywordName) {
      alert(keywordName);
    },
    selectKeyword: function(keywordName) {
      alert(keywordName);
    },
    openClose: function() {
      if (this.menu === false) {
        this.menu = true;
      } else {
        this.menu = false;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.titoli {
  font-weight: bold;
  font-size: 20px;
  text-align: center;
}
.progress {
  width: 75%;
  margin: auto;
}
.container {
  background: grey;
  height: 100vh;
  width: 400px;
  float: left;
}
.search {
  width: 170px;
  margin: 30px auto;
  border: none;
  border-bottom: blue 1px solid;
}
.wizard {
  text-align: center;
}
.tags {
  text-align: center;
}
</style>
