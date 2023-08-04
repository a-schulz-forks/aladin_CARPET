import {defineStore} from 'pinia'
import {computed, ref} from "vue";

const normalizePath = (path: string) => path.replaceAll(/__[0-9]/g, '')

interface IGamificationDefinition {
    path: string,
    methodImpact?: {name: string, impact:number},
    calculationMode: string
}
// https://pinia.vuejs.org/core-concepts/#setup-stores
export const useGamifyStore = defineStore('gamify', () => {
    const modalActive = ref(false);
    const checkPaths = ref([]);
    const savedPath = ref([]);
    const ignoredPaths = ref([]);
    const pathGamificationDefinition = ref(<IGamificationDefinition>{});
    function setCheckPath(text: string) {
        const normalizedPath = normalizePath(text)
        if (!(
            checkPaths.value.map((el) => normalizePath(el)).includes(normalizedPath) ||
            savedPath.value.includes(normalizedPath) ||
            ignoredPaths.value.includes(normalizedPath)
        )
        ) {
            checkPaths.value.push(text)
        }
    }

    function addSavedPath(text: string) {
        savedPath.value.push(normalizePath(text))
        checkPaths.value.shift()
    }

    function addIgnoredPath(text: string) {
        ignoredPaths.value.push(normalizePath(text))
        checkPaths.value.shift()
    }

    return {
        modalActive,
        checkPaths,
        setCheckPath,
        savedPath,
        addSavedPath,
        ignoredPaths,
        addIgnoredPath,
        pathGamificationDefinition,
    }
})