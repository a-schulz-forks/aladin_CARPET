<script setup lang="ts">
import {definition, ISkillsMapping} from "./data/definition";
import {IReplay, IState, ISteps} from "@/interfaces/TaskGraphInterface";
import {SkillsConfiguration, SkillsReporter} from "@skilltree/skills-client-js/dist/skills-client-js.esm.min";
import {taskStore} from "@/store/taskGraph";
import {computed, watch} from "vue";

const store = taskStore;
const {getProperty, setProperty} = store;
const state = computed(() => store.state)

watch(
    () => state.value,
    (newState: IState) => {
      console.log("worked")
      const currentTask = newState.currentTask;
      if (!currentTask) return;
      submitSkill(newState.taskReplay?.steps.pop(), currentTask);
    }
)
const reportSkill = (skillId: string) => {
  if (SkillsConfiguration.isInitialized()) {
    SkillsReporter.reportSkill(skillId);
  }
};

const getSkillId = (path: string, skillsMapping: ISkillsMapping): string | null => {
  const usefulKeys = Object.keys(skillsMapping).filter((key) => path.startsWith(key));
  if (!usefulKeys) return null
  // Order keys by length to get the most specific key -> try it first
  const orderedKeys = usefulKeys.sort((a, b) => b.length - a.length)
  for (const key of orderedKeys) {
    const skillId = skillsMapping[key]["skillId"]
    if (skillId) return skillId
    //   ToDo distinction
    //   getPath ....
  }
  return null
};

const submitSkill = (step: ISteps, currentTask: string) => {
  const skillId = getSkillId(step.path, definition[currentTask]);
  if (!skillId) return
  ReportSkill(skillId);
  return
};
</script>

<template>
  <div></div>
</template>