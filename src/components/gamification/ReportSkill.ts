import {definition, IDistinctionItem, ISkillsMapping} from "./data/definition";
import {IMethodsDefinition, ISteps} from "@/interfaces/TaskGraphInterface";
import {SkillsConfiguration, SkillsReporter} from "@skilltree/skills-client-js/dist/skills-client-js.esm.min";
import {taskStore} from "@/store/taskGraph";

const getSkillId = (path: string, skillsMapping: ISkillsMapping): string | null => {
    const usefulKeys = Object.keys(skillsMapping).filter((key) => path.startsWith(key));
    if (!usefulKeys) return null;

    const orderedKeys = usefulKeys.sort((a, b) => b.length - a.length);

    for (const key of orderedKeys) {
        const skillId = skillsMapping[key]["skillId"];
        if (skillId) return skillId;

        const distinction = skillsMapping[key]["distinction"];
        if (distinction) {
            const component = getComponent(path);
            if (!component) return null;

            for (const item of distinction) {
                if (matchesDistinction(component, item)) {
                    return item["skillId"];
                }
            }
        }
    }
    return null;
};

const matchesDistinction = (component: any, distinction: IDistinctionItem): boolean => {
    const distinctionEntries = Object.entries(distinction);

    for (const [key, value] of distinctionEntries) {
        if (key === "skillId") continue;

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


const getComponent = (path: string): string | null => {
    const regex = /nodes__(\d+)__components__(\d+)/g;
    const match = regex.exec(path);
    if (!match) return null
    return taskStore.getters.getPropertyFromPath("nodes__" + match[1] + "__components__" + match[2])
}


const getMethods = (component: {}): IMethodsDefinition | null => {
    if (!component) return null
    const usedMethods = component["contextMenu"]?.["usedMethods"]
    if (!usedMethods) return null
    const methods: string[] = [...new Set(Object.values(usedMethods))]
    if (!methods.length) return null
    const methodDefintion: IMethodsDefinition = {}
    for (const method of methods) {
        methodDefintion[method] = component["methods"][method]
    }
    return methodDefintion
}

const getHighestImpactOfMethods = (methods: IMethodsDefinition): number => {
    const impact: number = Object.entries(methods).reduce((result, [name, data]) => {
        return result > data.impact ? data.impact : result;
    }, 1);
    return impact

}

// Todo:
// dont submit skills to often.
export const submitSkill = (step: ISteps, currentTask: string) => {
    if (!currentTask) return
    const skillId = getSkillId(step.path, definition[currentTask]["skillsMapping"]);
    if (!skillId) return
    const methods = getMethods(getComponent(step.path))
    if (methods) {
        const impact = getHighestImpactOfMethods(methods)
        console.log(step.path, "impact: ", impact)
        // ToDo: report just a part of the skill points
        if (SkillsConfiguration.isInitialized()) {
            SkillsReporter.reportSkill(skillId);
        }
        return
    }
    if (SkillsConfiguration.isInitialized()) {
        SkillsReporter.reportSkill(skillId);
    }
    console.log("SKILL SUBMITTED", skillId)
    return
};