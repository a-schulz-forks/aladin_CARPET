<script lang="ts" setup>
// Use as follows:
// new bootstrap.Modal(document.getElementById("MODALID")!).hide();
// new bootstrap.Modal(document.getElementById("MODALID")!).show();

import {
  SkillsConfiguration,
  SkillsDisplayJS,
} from "@skilltree/skills-client-js/dist/skills-client-js.esm.min.js";
import { onMounted } from "vue";
import * as bootstrap from "bootstrap";

const props = defineProps({
  modalId: {
    type: String,
    default: "SkillDisplayModal",
  },
});

onMounted(() => {
  SkillsConfiguration.afterConfigure().then(() => {
    const clientDisplay = new SkillsDisplayJS();
    clientDisplay.attachTo(document.querySelector("#skills-client-container"));
  });
});
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