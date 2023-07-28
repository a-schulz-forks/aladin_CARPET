import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import VTooltip from "v-tooltip";
import {createPinia} from 'pinia'
import './scss/styles.scss'

const pinia = createPinia()
createApp(App).use(store).use(router).use(VTooltip).use(pinia).mount("#app");

declare global {
    interface Window {
        panzoom: any;
        delayed_methods: any;
        MathLex: any;
        MathJax: any;
    }
}
