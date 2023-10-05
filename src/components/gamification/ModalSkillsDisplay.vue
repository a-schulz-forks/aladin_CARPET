<script lang="ts" setup>
// Use as follows:
// new bootstrap.Modal(document.getElementById("MODALID")!).hide();
// new bootstrap.Modal(document.getElementById("MODALID")!).show();

import {
  SkillsConfiguration,
  SkillsDisplayJS,
} from "@skilltree/skills-client-js/dist/skills-client-js.esm.min.js";
import { onMounted, watch } from "vue";
import * as bootstrap from "bootstrap";
import { RouteLocationNormalizedLoaded, useRoute } from "vue-router";
import { definition, IDistinctionItem, ISkillsMapping } from "./data/definition";
import { SkillsReporter } from "@skilltree/skills-client-js/dist/skills-client-js.esm.min";

const props = defineProps({
  modalId: {
    type: String,
    default: "SkillDisplayModal",
  },
});

const clientDisplay = new SkillsDisplayJS({
  options: {
    internalBackButton: "true",
  },
});

onMounted(() => {
  SkillsConfiguration.afterConfigure().then(() => {
    // https://skilltreeplatform.dev/skills-client/js.html#skills-display
    clientDisplay.attachTo(document.querySelector("#skills-client-container"));
    // reload iframe on skill report
    SkillsReporter.configure({ notifyIfSkillNotApplied: true });
    SkillsReporter.addSuccessHandler((result) => {
      clientDisplay.destroy();
      clientDisplay.attachTo(document.querySelector("#skills-client-container"));
    });
  });
});

const route = useRoute();

watch(
  route,
  (to: RouteLocationNormalizedLoaded) => {
    const path = to.path;
    if (!/^\/task\/.*/.test(path)) return;
    const routeSegments = path.split("/");
    const task = routeSegments[routeSegments.length - 1];
    // eslint-disable-next-line no-prototype-builtins
    if (!definition.hasOwnProperty(task)) return;
    const skillsDisplaySubject = definition[task]["skillsDisplaySubject"];
    if (!skillsDisplaySubject) return;
    setNavigation(skillsDisplaySubject);
  },
);

const setNavigation = (subject: string) => {
  clientDisplay.navigate("/subjects/" + subject);
};
</script>

<template>
  <div :id="modalId" aria-hidden="false" :aria-labelledby="modalId + 'Label'" class="modal fade show"
       data-bs-backdrop="static"
       data-bs-keyboard="false" tabindex="-1" v-bind="$attrs">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <div id="skills-client-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>