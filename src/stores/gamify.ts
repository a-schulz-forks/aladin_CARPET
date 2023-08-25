import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { SkillsConfiguration } from "@skilltree/skills-client-js/dist/skills-client-js.esm.min";
import axios from "axios";

const normalizePath = (path: string) => path.replaceAll(/__[0-9]/g, "");

interface IGamificationDefinition {
  path: string,
  methodImpact?: { name: string, impact: number },
  calculationMode: string
}

// https://pinia.vuejs.org/core-concepts/#setup-stores
export const useGamifyStore = defineStore("gamify", () => {
  const modalActive = ref(false);
  const checkPaths = ref([]);
  const savedPath = ref([]);
  const ignoredPaths = ref([]);
  // const pathGamificationDefinition = ref(<IGamificationDefinition>{});
  const computedPaths = ref([]);
  const skillIds = ref([]);

  function setCheckPath(text: string) {
    const normalizedPath = normalizePath(text);
    if (!(
      checkPaths.value.map((el) => normalizePath(el)).includes(normalizedPath) ||
      savedPath.value.includes(normalizedPath) ||
      ignoredPaths.value.includes(normalizedPath)
    )
    ) {
      checkPaths.value.push(text);
    }
  }

  function addSavedPath(text: string) {
    savedPath.value.push(normalizePath(text));
    checkPaths.value.shift();
  }

  function addIgnoredPath(text: string) {
    ignoredPaths.value.push(normalizePath(text));
    checkPaths.value.shift();
  }

  async function getSkillIds() {
    const url = import.meta.env.VITE_SKILLTREE_URL + "/api/projects/" + import.meta.env.VITE_SKILLTREE_PROJECT_ID + "/skills";
    const headers = { "Authorization": `Bearer ${SkillsConfiguration.getAuthToken()}` };
    const response = await axios.get(url, { headers: headers });
    skillIds.value = response.data.data.map((skill: any) => skill.skillId);
  }

  return {
    modalActive,
    checkPaths,
    setCheckPath,
    savedPath,
    addSavedPath,
    ignoredPaths,
    addIgnoredPath,
    // pathGamificationDefinition,
    computedPaths,
    skillIds,
    getSkillIds,
  };
});