<template>
  <div class="dragContext">
    <DndProvider :backend="HTML5Backend">
      <div class="dragElements">
        <DragElement
          v-for="(item, index) in boxes"
          :key="index"
          :name="item.name"
          :type="item.type"
          :is-dropped="isDropped(item.name)"
        >
          <DOTGraph :componentID="5" :storeObject="storeObject" />
        </DragElement>
      </div>

      <div class="dropElements" :style="{ overflow: 'hidden', clear: 'both' }">
        <DropElement
          v-for="(item, index) in dustbins"
          :key="index"
          :accept="item.accepts"
          :last-dropped-item="item.lastDroppedItem"
          @drop="handleDrop(index, $event)"
        ></DropElement>
      </div>
    </DndProvider>
  </div>
</template>

<script lang="ts" setup>
import { DndProvider } from "vue3-dnd";
import { NativeTypes, HTML5Backend } from "react-dnd-html5-backend";
import DOTGraph from "@/components/taskComponents/DOTGraph.vue";
import DropElement from "./DropElement.vue";
import DragElement from "./DragElement.vue";
import { ItemTypes } from "./ItemTypes";
import { ref } from "vue";
import type { ComponentProps } from "@/interfaces/ComponentInterface";

const props = defineProps<ComponentProps>();

const { store, getProperty, setProperty } = props.storeObject;

interface DropElementState {
  accepts: string[];
  lastDroppedItem: any;
}

interface DragElementstate {
  name: string;
  type: string;
}

const dustbins = ref<DropElementState[]>([
  { accepts: [ItemTypes.GLASS], lastDroppedItem: null },
  { accepts: [ItemTypes.FOOD], lastDroppedItem: null },
  {
    accepts: [ItemTypes.PAPER, ItemTypes.GLASS, NativeTypes.URL],
    lastDroppedItem: null
  },
  { accepts: [ItemTypes.PAPER, NativeTypes.FILE], lastDroppedItem: null }
]);

const boxes = ref<DragElementstate[]>([
  { name: "Bottle", type: ItemTypes.GLASS },
  { name: "Banana", type: ItemTypes.FOOD },
  { name: "Magazine", type: ItemTypes.PAPER }
]);

const droppedBoxNames = ref<string[]>([]);

function isDropped(boxName: string) {
  return droppedBoxNames.value.includes(boxName);
}

const handleDrop = (index: number, item: { name: string }) => {
  const { name } = item;
  droppedBoxNames.value.push(name);
  dustbins.value[index].lastDroppedItem = item;
};
</script>

<style scoped>
.dragContext {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid black;
  background-color: white;
}
.dragElements {
  overflow: hidden;
  clear: both;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  background-color: white;
}

.dropElements {
  overflow: hidden;
  clear: both;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  background-color: white;
}
</style>
