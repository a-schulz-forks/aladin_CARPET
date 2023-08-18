<script lang="ts" setup>
import {
  SkillsConfiguration,
  SkillsDisplayJS,
  SkillsLevelJS,
  SkillsReporter,
} from "@skilltree/skills-client-js/dist/skills-client-js.esm.min.js";
import {onMounted, ref} from "vue";
import * as bootstrap from 'bootstrap'

// Feedback for the user
const toastHeader = ref("Beim nächsten Mal!");
const toastBody = ref("");
const toastSuccess = ref(false);

onMounted(() => {
  // Define feedback for the user
  SkillsReporter.configure({notifyIfSkillNotApplied: true});
  SkillsReporter.addSuccessHandler((result) => {
    toastHeader.value = "Diesmal leider nicht!";
    toastSuccess.value = false;
    if (result["skillApplied"] == true) {
      toastSuccess.value = true;
      toastHeader.value = "Gut gemacht!";
      toastBody.value = "Du hast " + result["pointsEarned"] + " Punkt(e) bei " + result["name"] + " verdient!";
    } else {
      toastBody.value = result["explanation"];
    }
    toastBootstrap.show();
  });
  const toastLiveExample = document.getElementById('liveToast')
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
});
</script>

<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="liveToast" aria-atomic="true" aria-live="assertive" class="toast" role="alert">
      <div class="toast-header" :class="toastSuccess ?'bg-success': 'bg-danger'">
        <strong class="me-auto">{{ toastHeader }}</strong>
        <button aria-label="Close" class="btn-close" data-bs-dismiss="toast" type="button"></button>
      </div>
      <div class="toast-body">
        {{ toastBody }}
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>