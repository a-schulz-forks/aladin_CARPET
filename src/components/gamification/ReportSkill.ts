import { definition, IDistinctionItem, ISkillsMapping } from "./data/definition";
import { IMethodsDefinition, IStep } from "@/interfaces/TaskGraphInterface";
import { SkillsConfiguration, SkillsReporter } from "@skilltree/skills-client-js/dist/skills-client-js.esm.min";
import { taskStore } from "@/store/taskGraph";
import { useGamifyStore } from "@/stores/gamify";

const getSkillIds = (step: IStep, skillsMapping: ISkillsMapping): string[] => {
  // check for a direct mapping
  const mapping = skillsMapping[step.path];
  if (mapping && "skillIds" in mapping) {
    // @ts-ignore
    const skillIds = mapping["skillIds"];
    if (skillIds && skillIds.length != 0 && mapping["value"] == step.value) return skillIds;
    return [];
  }
  // handle distinction
  const keys = Object.keys(skillsMapping);
  const matchedKeys = keys.filter((key) => {
    const regex = new RegExp(key);
    return regex.test(step.path);
  });
  for (const key of matchedKeys) {
    const distinction = skillsMapping[key]["distinction"];
    if (distinction && skillsMapping[key]["value"] == step.value) {
      const component = getComponent(step.path);
      if (!component) return [];

      for (const item of distinction) {
        if (matchesDistinction(component, item)) {
          return item["skillIds"];
        }
      }
    }
  }
  return [];
};

const matchesDistinction = (component: any, distinction: IDistinctionItem): boolean => {
  const distinctionEntries = Object.entries(distinction);

  for (const [key, value] of distinctionEntries) {
    if (key === "skillIds") continue;

    if (typeof value === "object") {
      // If the value is an object, it's a nested distinction condition
      if (!matchesDistinction(component[key], value)) {
        return false;
      }
    } else {
      // If the value is a simple condition, check if it matches
      if (component[key] !== value) {
        return false;
      }
    }
  }
  return true;
};


const getComponent = (path: string): {} => {
  const regex = /nodes__(\d+)__components__(\d+)/g;
  const match = regex.exec(path);
  if (!match) return {};
  return taskStore.getters.getPropertyFromPath("nodes__" + match[1] + "__components__" + match[2]);
};


const getMethods = (component: {}): IMethodsDefinition | null => {
  if (!component) return null;
  const usedMethods = component["contextMenu"]?.["usedMethods"];
  if (!usedMethods) return null;
  const methods: string[] = [...new Set(Object.values(usedMethods))];
  if (!methods.length) return null;
  const methodDefintion: IMethodsDefinition = {};
  for (const method of methods) {
    methodDefintion[method] = component["methods"][method];
  }
  return methodDefintion;
};

const getHighestImpactOfMethods = (methods: IMethodsDefinition): number => {
  const impact: number = Object.entries(methods).reduce((result, [name, data]) => {
    return result > data.impact ? data.impact : result;
  }, 1);
  return impact;

};

const skillIdExists = async (skillId: string): Promise<boolean> => {
  const gamifyStore = useGamifyStore();
  if (gamifyStore.skillIds.length === 0) await gamifyStore.getSkillIds();
  return gamifyStore.skillIds.includes(skillId);
};

export const submitSkill = async (step: IStep, currentTask: string) => {
  if (!currentTask) return;
  if (!SkillsConfiguration.isInitialized()) return;
  const gamifyStore = useGamifyStore();
  const skillIds = getSkillIds(step, definition[currentTask]["skillsMapping"]);
  if (skillIds.length == 0) return;
  if (gamifyStore.computedPaths.includes(step.path)) return;
  const methods = getMethods(getComponent(step.path));
  // Report to method skill with less points if the impact is higher than 0.5
  skillIds.forEach(async (skillId) => {
    if (methods) {
      const impact = getHighestImpactOfMethods(methods);
      if (impact >= 0.5 && await skillIdExists(skillId.replace("Skill", "WithMethodsSkill"))) {
        SkillsReporter.reportSkill(skillId.replace("Skill", "WithMethodsSkill"));
      }
    } else {
      SkillsReporter.reportSkill(skillId);
    }
    gamifyStore.computedPaths.push(step.path);
    console.log("SKILL SUBMITTED", skillId);
  });
  return;
};