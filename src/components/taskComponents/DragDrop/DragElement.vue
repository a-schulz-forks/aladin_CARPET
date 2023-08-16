<template>
  <div :ref="drag" :role="role" class="dragElement" :class="classObject" :data-testid="role">
    <s v-if="unique && isDropped"><slot></slot></s>
    <template v-else><slot></slot></template>
  </div>
</template>

<script lang="ts" setup>
import { useDrag } from "vue3-dnd";
import { toRefs } from "@vueuse/core";

const props = defineProps<{
  name: string;
  type: string;
  isDropped: boolean;
  unique?: boolean;
  role?: string;
}>();

const [collect, drag] = useDrag(() => ({
  type: props.type,
  item: { name: props.name },
  collect: (monitor) => ({
    isDragging: monitor.isDragging()
  })
}));
const { isDragging } = toRefs(collect);

const classObject = { isDragging };
</script>

<style scoped>
.dragElement {
  border: 1px dashed gray;
  background-color: white;
  min-width: 100px;
  min-height: 50px;
  margin: 5px;
  cursor: move;
}

.isDragging {
  opacity: 0.4;
}
</style>
