import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import './plugins/bootstrap-vue';
import { BootstrapVueIcons } from 'bootstrap-vue';
import App from './App.vue';
import VueLodash from 'vue-lodash';
import lodash from 'lodash';

import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(BootstrapVueIcons);
Vue.use(VueLodash, { lodash: lodash });
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
