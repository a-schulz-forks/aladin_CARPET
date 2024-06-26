<template>
  <div class="task">
    <transition name="fade">
      <LoadingSpinner v-if="isLoading"/>
    </transition>
    <transition name="slidedown">
      <DecisionNode v-if="isDecisionNode" :key="currentNode" :storeObject="taskStore"/>
    </transition>
    <BaseModal :left-button-callback=" () => gamifyStore.addIgnoredPath(checkPaths[0])"
               :right-button-callback="() => gamifyStore.addSavedPath(checkPaths[0])"
               :visibility="gamifyStore.modalActive && checkPaths.length > 0" left-button-label="Ignorieren"
               right-button-label="Speichern"
               title="Festlegen der Gamification Optionen für diesen Pfad">
      <gamification-labeller :path="checkPaths[0]" :storeObject="taskStore"/>
    </BaseModal>
    <Canvas v-if="!isDecisionNode && !isLoading" :key="currentNode" :storeObject="taskStore"/>
  </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import Canvas from "@/components/Canvas.vue";
import stores from "@/helpers/TaskGraphUtility";
import DecisionNode from "@/components/DecisionNode.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import {useGamifyStore} from '@/stores/gamify'
import GamificationLabeller from "@/components/gamification/GamificationLabeller.vue";

const taskStore = stores.taskStore;
const {store, getProperty, setProperty} = taskStore;

const route = useRoute();
const currentNode = computed(() => getProperty("currentNode"));
const isDecisionNode = computed(() => {
  const edges = getProperty(`edges__${currentNode.value}`);
  if (edges) return edges.length > 1;
  return false;
});

const isLoading = computed(() => getProperty(`isLoading`));

const gamifyStore = useGamifyStore();
const checkPaths = computed(() => gamifyStore.checkPaths);

const isReplayGraph = computed(() => getProperty("restoredFromReplay"));

if (typeof route.params.task === "string" && !isReplayGraph.value) {
  store.dispatch("fetchTaskGraph", {task: route.params.task});
  setProperty({path: "currentTask", value: route.params.task}); //
}

const throttle = 50;
let last = new Date().getTime();
const trackMouse = (event: MouseEvent) => {
  event.preventDefault();
  const now = new Date().getTime();
  const target: EventTarget = event.target;

  // update only n milliseconds to not freeze the app
  if (now - last < throttle) return;

  store.dispatch("trackMouse", {x: event.pageX, y: event.pageY, timestamp: now});

  last = now;
};
onMounted(() => {
  document.addEventListener("mousemove", trackMouse);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", trackMouse);
});

</script>

<style scoped>
.slidedown-enter-active,
.slidedown-leave-active {
  transition: max-height 0.3s ease-in-out;
}

.slidedown-enter-to,
.slidedown-leave-from {
  overflow: hidden;
  max-height: 100vh;
}

.slidedown-enter-from,
.slidedown-leave-to {
  overflow: hidden;
  max-height: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
