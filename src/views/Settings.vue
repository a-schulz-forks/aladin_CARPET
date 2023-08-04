<template>
  <div class="settings">
    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="labelPaths">
      <label class="form-check-label" for="flexSwitchCheckDefault">Label paths</label>
    </div>
  </div>
</template>

<script lang="ts">
import Equation from "@/components/taskComponents/math/Equation.vue";
import { mathlex } from "@/helpers/FormulaGenerator";

const labelPaths = ref(false);
watch(() => labelPaths.value, (value) => {
  gamifyStore.modalActive = value;
});

</script>

<style scoped>
.settings {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
}
</style>
