import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import VTooltip from "v-tooltip";
import {createPinia} from 'pinia'
import './scss/styles.scss'
import {SkillsConfiguration} from "@skilltree/skills-client-js/dist/skills-client-js.esm.min";

// Todo: user needs to be changed after login is implemented
SkillsConfiguration.configure({
    serviceUrl: import.meta.env.VITE_SKILLTREE_URL,
    projectId: import.meta.env.VITE_SKILLTREE_PROJECT_ID,
    authenticator: import.meta.env.VITE_SKILLTREE_AUTHENTICATION_URL + "/api/users/bill@email.org/" + import.meta.env.VITE_SKILLTREE_PROJECT_ID + "/token",
});

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
