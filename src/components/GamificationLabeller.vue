<script lang="ts" setup>
//ToDO: vueFormValidate
import {MatrixScoreCalculation} from "@/helpers/gamify/matrixScoreCalculation";
import {computed, ref, watch} from "vue";
import stores from "@/helpers/TaskGraphUtility";

const props = defineProps({
  path: String,
  storeObject: stores.taskStore,
});
const {store, getProperty, setProperty} = props.storeObject;
const calculationMode = ref("");

// automatically fill the method according to component type
watch(() => props.path, () => {
  const match = props.path?.match(/^(.*components__\d+)/);
  if (match) {
    calculationMode.value = getProperty(match[0] + "__type");
  }
});

const availableCalculationModes = {
  "": null,
  "Matrix": MatrixScoreCalculation,
}
const pathHasMethod = new RegExp(".*usedMethods.*").test(props.path);

const method = ref("");
if (pathHasMethod) {
  method.value = getProperty(props.path);
}

</script>

<template>
  <div class="container">
    <h6>{{ path }}<p v-if="pathHasMethod"> - {{ method }}</p></h6>
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label for="calculationMode">Calculation Mode</label>
          <select id="calculationMode" v-model="calculationMode" class="form-control">
            <option v-for="mode in Object.keys(availableCalculationModes)" :value="mode">{{ mode }}</option>
          </select>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>