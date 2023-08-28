<template>
  <ContextMenu :componentId="id" :methods="selectedMethods" :storeObject="storeObject">
    <div class="editableGraph">
      <DOTGraph :componentID="componentID" :storeObject="storeObject" />
    </div>
  </ContextMenu>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, computed } from "vue";
import DOTGraph from "@/components/taskComponents/DOTGraph.vue";
import ContextMenu from "@/components/taskComponents/mixins/ContextMenu.vue";
import { pollGraphRender } from "@/helpers/HelperFunctions";
<<<<<<< HEAD
import type { ComponentProps } from "@/interfaces/ComponentInterface";
=======
import {getSelectedMethods} from "@/helpers/getSelectedMethods";
>>>>>>> 26e34591a0f242b9d5b7b3d09c42bd58bc5c72f8

const props = defineProps<ComponentProps>();

const { getProperty, setProperty } = props.storeObject;
const currentNode = getProperty("currentNode");
const path = `nodes__${currentNode}__components__${props.componentID}`;
const dependencies = getProperty(`${path}__dependencies`);

const userValues = computed(() => getProperty(`${path}__component__userValues`));
if (!userValues.value)
  setProperty({ path: `${path}__component__userValues`, value: [...getProperty(dependencies.EditableGraph.validation)] });

const editSVGText = (event: Event) => {
  const target = <HTMLElement>event.target;
  const propertyNode = <HTMLElement>target?.parentElement?.parentElement;
  const node = <HTMLElement>propertyNode.parentElement?.parentElement;
  const nodeProperty = <string>propertyNode.getAttribute("id")?.split("_")?.pop()?.trim();
  const nodeId = node?.getAttribute("id")?.split("_")?.pop()?.trim();

  const input = document.createElement("input");
  input.style.textAlign = "right";
  input.style.width = "20px";
  input.value = <string>target.textContent;
  input.onkeyup = (event) => {
    const input = event.target as unknown as HTMLInputElement;
    if (["Enter", "Escape"].includes(event.key)) {
      input.blur();
      return;
    }
    // TODO eventually shift logic into deep watcher, to make replays possible
    target.textContent = input.value;
    setProperty({ path: `${path}__component__userValues__${nodeId}__${nodeProperty}`, value: input.value });
  };
  input.onblur = () => {
    foreignObject.remove();
    validate();
  };

  const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");
  foreignObject.setAttribute("y", `${parseInt(<string>target?.getAttribute("y")) - 15}`);
  foreignObject.setAttribute("x", <string>target?.getAttribute("x"));
  foreignObject.append(input);

  const svg = target.parentNode;
  svg?.append(foreignObject);

  input.select();
};

const editableFields: Array<string> = getProperty(`${path}__component__editableFields`);
const selectors = editableFields.map((field) => `g.node g[id="a_${field}"] text`);
const assignEventHandlers = () => {
  Array.from(document.querySelectorAll(selectors)).forEach((node) => {
    node.setAttribute("pointer-events", "visible");
    node.addEventListener("click", editSVGText);
  });
};

onMounted(() => {
  pollGraphRender(".editableGraph .node", assignEventHandlers);
  pollGraphRender(".editableGraph .node", validate);
});
onUnmounted(() => {
  Array.from(document.querySelectorAll(selectors)).forEach((node) => node.removeEventListener("click", editSVGText));
});

const validate = () => {
  const nodes = getProperty(dependencies.EditableGraph.validation);
  const isValid = nodes.every((node) => {
    const { id } = node;
    // TODO make editableFields Array of keys again and create replica of nodes for userValue to record changes in VUEX state and add node id to handler
    // create deep watcher to extract the changed key<->value in new/old Value of watcher
    // move assignment logic of textfield from the editSVGText-handler to watcher
    return editableFields.every((field) => {
      const correctValue = node[field];
      const userValue = document.querySelector(`g.node[id="${id}"] g[id="a_${field}"] text`)?.textContent?.trim();
      return userValue == correctValue;
    });
  });

  setProperty({
    path: `${path}__isValid`,
    value: isValid
  });
};

const methods = {
  showSolution: () => {
    // manually remove old svg, since foreignObjects might cause issues with the rerender
    Array.from(document.querySelectorAll(selectors)).forEach((node) => node.removeEventListener("click", editSVGText));
    const svg = document.querySelector(".dotGraph svg");
    const dotGraph = getProperty(dependencies.DOTGraph.dotDescription);
    const solution = getProperty(dependencies.EditableGraph.solution);
    if (svg && dotGraph != solution) document.querySelector(".dotGraph")?.removeChild(svg);

    setProperty({ path: dependencies.DOTGraph.dotDescription, value: solution });

    pollGraphRender(".editableGraph .node", assignEventHandlers);
    setProperty({
      path: `${path}__isValid`,
      value: true
    });

    const validate = () => {
      const nodes = getProperty(dependencies.EditableGraph.validation);
      const isValid = nodes.every((node) => {
        const { id } = node;
        // TODO make editableFields Array of keys again and create replica of nodes for userValue to record changes in VUEX state and add node id to handler
        // create deep watcher to extract the changed key<->value in new/old Value of watcher
        // move assignment logic of textfield from the editSVGText-handler to watcher
        return editableFields.every((field) => {
          const correctValue = node[field];
          const userValue = document.querySelector(`g.node[id="${id}"] g[id="a_${field}"] text`).textContent.trim();
          return userValue == correctValue;
        });
      });

      setProperty({
        path: `${path}__isValid`,
        value: isValid,
      });
    };

    const methods = {
      showSolution: () => {
        // manually remove old svg, since foreignObjects might cause issues with the rerender
        Array.from(document.querySelectorAll(selectors)).forEach((node) => node.removeEventListener("click", editSVGText));
        const svg = document.querySelector(".dotGraph svg");
        const dotGraph = getProperty(dependencies.DOTGraph.dotDescription);
        const solution = getProperty(dependencies.EditableGraph.solution);
        if (svg && dotGraph != solution) document.querySelector(".dotGraph").removeChild(svg);

        setProperty({ path: dependencies.DOTGraph.dotDescription, value: solution });

        pollGraphRender(".editableGraph .node", assignEventHandlers);
        setProperty({
          path: `${path}__isValid`,
          value: true,
        });
      },
    };
    const selectedMethods = getSelectedMethods(getProperty(`${path}__methods`), methods);

    return {
      selectedMethods: selectedMethods,
      id: props.componentID,
    };
  },
};
</script>

<style scoped>
.editableGraph {
  width: 100%;
  height: 100%;
}
</style>
