<template>
  <div class="test">
    <DnDContainer :componentID="5" :storeObject="taskStore" />
  </div>
</template>

<script lang="ts">
import DnDContainer from "@/components/taskComponents/DragDrop/DnDContainer.vue";
import stores from "@/helpers/TaskGraphUtility";
export default {
  name: "Test",
  components: {
    DnDContainer
  },
  setup() {
    const taskStore = stores.taskStore;
    return { taskStore };
  }
};
</script>

<style scoped>
.test {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
}
</style>
