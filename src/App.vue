<template>
  <RadialMenu />
  <router-view />
  <reporter-success-toast />
  <modal-skills-display modal-id="SkillDisplayModal" />
  <skill-display-button modal-id="SkillDisplayModal" />
</template>

<script lang="ts">
import RadialMenu from "@/components/RadialMenu.vue";
import ReporterSuccessToast from "@/components/gamification/ReporterSuccessToast.vue";
import ModalSkillsDisplay from "@/components/gamification/ModalSkillsDisplay.vue";
import SkillDisplayButton from "@/components/gamification/SkillDisplayButton.vue";

export default {
  components: { SkillDisplayButton, ModalSkillsDisplay, ReporterSuccessToast, RadialMenu },
  setup() {
    return {};
  },
};
</script>

<style>
* {
  overflow: hidden;
  margin: 0;
  padding: 0;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/* Firefox */
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

body {
  background: #e8edf1;
  box-shadow: inset 0 -7px 5px -7px rgba(0, 0, 0, 1);
  box-shadow: inset -7px -7px 5px -7px rgba(0, 0, 0, 1);
}

.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[aria-hidden="true"] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden="false"] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}
</style>
