<script setup lang="ts">
import { SkillsLevelJS } from "@skilltree/skills-client-js/dist/skills-client-js.esm.min.js";
import { SkillsConfiguration } from "@skilltree/skills-client-js/dist/skills-client-js.esm.min";
import { onMounted, ref } from "vue";
import * as bootstrap from "bootstrap";

const props = defineProps({
  modalId: {
    type: String,
    default: "SkillDisplayModal",
  },
});

const loaded = ref(false);

onMounted(() => {
  SkillsConfiguration.afterConfigure().then(() => {
    const skillsLevel = new SkillsLevelJS();
    skillsLevel.attachTo(document.querySelector("#skills-level-container"));
    loaded.value = true;
  });
});

const showModal = () => {
  new bootstrap.Modal(document.getElementById(props.modalId)!).show();
};
</script>

<template>
  <div class="skillDisplayButton" :style="loaded? 'display: block' : 'display: none'">
    <button class="btn btn-outline-secondary"
            @click="showModal">
      <i id="skills-level-container">SkillTree</i>
    </button>
  </div>
</template>

<style scoped>
.skillDisplayButton {
  position: fixed;
  top: 0;
  right: 0;
  margin: 20px;
  z-index: 1000;
}
</style>