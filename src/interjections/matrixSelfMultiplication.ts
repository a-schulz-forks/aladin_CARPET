import type {IStore} from "@/helpers/TaskGraphUtility";
import type {ILayouts, IComponent} from "@/interfaces/TaskGraphInterface";
import type {IMatrixSelfMultiplication} from "@/interfaces/interjectionInterfaces/matrixSelfMultiplicationInterface";
import {getCurrentTaskNode} from "@/interjections/interjectionHandler";

export const matrixSelfMultiplication = (
    storeObject: IStore,
    dependencies: IMatrixSelfMultiplication["dependencies"],
    component_id: string = ""
) => {
    const {getProperty, setProperty, store} = storeObject;

    const taskNode = getCurrentTaskNode(storeObject);
    const nodeComponents = JSON.parse(JSON.stringify(taskNode.components));

    const currentNodeId = store.state.currentNode;

    const secondaryNeedsVector = getProperty(dependencies.secondaryNeedsVector);

    const baseMatrix = getProperty(dependencies.baseMatrix);
    const baseMatrixId = parseInt(dependencies.baseMatrix[dependencies.baseMatrix.length - 1]);
    // -1 due to the baseMatrix already existing
    const n = getProperty(dependencies.n) - 1;

    const createMultipliedMatrix = (
        baseMatrix: IComponent,
        currentNodeId: number,
        leftMatrixId: number,
        rightMatrixId: number
    ) => {
        const clonedMatrix = JSON.parse(JSON.stringify(baseMatrix));

        clonedMatrix.dependencies.Matrix.data = `nodes__${currentNodeId}__components__${leftMatrixId}__component__userData`;
        clonedMatrix.dependencies.Matrix.data1 = `nodes__${currentNodeId}__components__${rightMatrixId}__component__userData`;
        clonedMatrix.isValid = false;
        clonedMatrix.component.readOnly = false;
        clonedMatrix.methods = {
            "fillZeros": {
                "description": "Ergänze Nullen",
                "impact": 0.5
            },
            "showSolution": {
                "description": "Zeige Lösung",
                "impact": 0
            },
            "copyToClipboard": {
                "description": "Kopieren",
                "impact": 1
            }
        };
        clonedMatrix.component.initialize.solution.operations = [{name: "multiply", args: ["chain"]}];
        clonedMatrix.component.initialize.solution.paths = [
            `nodes__${currentNodeId}__components__${leftMatrixId}__component__userData`,
            `nodes__${currentNodeId}__components__${rightMatrixId}__component__userData`
        ];

        clonedMatrix.component.initialize.user.operations = [{name: "getValueInitializedMatrix", args: [null]}];

        // uneven matrices are required to be filled by the user
        // thus reset validationData
        if (!(currentNodeId % 2 === 0)) {
            clonedMatrix.component.initialize.validation.operations = [
                {name: "getValueInitializedMatrix", args: [{isValid: false, isCorrect: false}]}
            ];
            clonedMatrix.component.initialize.validation.paths = ["taskData__adjacencyMatrix"];
        }

        return clonedMatrix;
    };

    const createResultMatrix = (baseMatrix: IComponent, currentNodeId: number, additionIds: Array<number>) => {
        const clonedMatrix = JSON.parse(JSON.stringify(baseMatrix));

        clonedMatrix.dependencies.Matrix.data = `nodes__${currentNodeId}__components__${
            additionIds[additionIds.length - 1]
        }__component__solutionData`;
        clonedMatrix.name = "Gesamtbedarfsmatrix";
        clonedMatrix.isValid = false;
        clonedMatrix.component.readOnly = false;
        clonedMatrix.methods = {
            "fillZeros": {
                "description": "Ergänze Nullen",
                "impact": 0.5
            },
            "showSolution": {
                "description": "Zeige Lösung",
                "impact": 0
            },
            "copyToClipboard": {
                "description": "Kopieren",
                "impact": 1
            }
        };
        clonedMatrix.component.initialize.solution.operations = Array(n + 1)
            .fill(null)
            .map(() => ({name: "add", args: ["chain"]}));
        clonedMatrix.component.initialize.solution.paths = additionIds.map(
            (id) => `nodes__${currentNodeId}__components__${id}__component__userData`
        );
        clonedMatrix.component.initialize.user.operations = [{name: "getValueInitializedMatrix", args: [null]}];

        return clonedMatrix;
    };

    const adaptLayouts = (layouts: ILayouts, componentId: number, horizontalFactor: number, verticalFactor: number) => {
        const newlayouts = Object.entries(layouts).reduce((newLayouts, [layoutSize, layout]) => {
            const baseMatrixCoordinates = layout.filter((component: any) => component.i === baseMatrixId)[0];
            const newLayout = [
                ...layout,
                {
                    ...baseMatrixCoordinates,
                    i: componentId,
                    y: baseMatrixCoordinates.y - baseMatrixCoordinates.h * verticalFactor,
                    x: baseMatrixCoordinates.x + baseMatrixCoordinates.w * horizontalFactor
                }
            ];
            newLayouts[layoutSize] = newLayout;
            return newLayouts;
        }, {} as ILayouts);

        return newlayouts;
    };

    const shiftComponentsInLayouts = (layouts: ILayouts, horizontalFactor: number, shiftId: number) => {
        const newlayouts = Object.entries(layouts).reduce((newLayouts, [layoutSize, layout]) => {
            const baseMatrixCoordinates = layout.filter((component) => component.i === baseMatrixId)[0];
            const newLayout = layout.map((component) => {
                if (component.i === shiftId)
                    return {...component, x: baseMatrixCoordinates.x + baseMatrixCoordinates.w * horizontalFactor};
                return component;
            });
            newLayouts[layoutSize] = newLayout;
            return newLayouts;
        }, {} as ILayouts);

        return newlayouts;
    };

    // TODO: make interjection class generic and create subclasses for specific use-cases  (clone, create, adapt, based on generated taskData etc.)
    // method required to set the path of the "Gesamtbedarfsmatrix" dynamically as it's id is not known at Task-Definition-time
    // and should include consequential errors of the user input
    const setSecondaryNeedsVectorSolutionCalculationPaths = (
        secondaryNeedsVector: IComponent,
        compositeDemandMatrixId: number,
        primaryRequirementsVectorId: number
    ) => {
        const clonedVector = JSON.parse(JSON.stringify(secondaryNeedsVector));

        clonedVector.dependencies.Matrix.data = `nodes__${currentNodeId}__components__${compositeDemandMatrixId}`;
        clonedVector.component.initialize.solution.operations = [{name: "multiply", args: ["chain"]}];
        clonedVector.component.initialize.solution.paths = [
            `nodes__${currentNodeId}__components__${compositeDemandMatrixId}__component__solutionData`,
            `nodes__${currentNodeId}__components__${primaryRequirementsVectorId}__component__userData`
        ];

        return clonedVector;
    };

    let layouts: ILayouts = taskNode.layouts;

    let leftMatrixId = baseMatrixId;
    let rightMatrixId = Object.keys(nodeComponents).length;
    let currentMatrixId = rightMatrixId;

    let horizontalFactor = 1;

    const unityMatrixId = parseInt(Object.keys(nodeComponents)[1]);
    const primaryRequirementsVectorId = parseInt(Object.keys(nodeComponents)[2]);
    const secondaryRequirementsVectorId = parseInt(Object.keys(nodeComponents)[3]);
    // initialize with baseMatrix and unityMatrix
    const additionMatrixIds = [baseMatrixId, unityMatrixId];

    for (let i = 0; i < n; i++) {
        // create i'th multiplication matrix
        nodeComponents[rightMatrixId] = JSON.parse(JSON.stringify(baseMatrix));
        layouts = adaptLayouts(layouts, rightMatrixId, horizontalFactor, 1);
        currentMatrixId = rightMatrixId + 1;

        // create i'th multiplied matrix
        nodeComponents[currentMatrixId] = createMultipliedMatrix(baseMatrix, currentNodeId, leftMatrixId, rightMatrixId);
        layouts = adaptLayouts(layouts, currentMatrixId, horizontalFactor, 0);
        rightMatrixId += 2;
        leftMatrixId = currentMatrixId;
        horizontalFactor++;

        // keep track of multiplied matrix ids for the addition
        additionMatrixIds.push(currentMatrixId);
    }

    // shift unity matrix
    layouts = shiftComponentsInLayouts(layouts, horizontalFactor, unityMatrixId);
    horizontalFactor++;

    // create result matrix
    currentMatrixId += 1;
    nodeComponents[currentMatrixId] = createResultMatrix(baseMatrix, currentNodeId, additionMatrixIds);

    // nodeComponents[secondaryRequirementsVectorId] = setSecondaryNeedsVectorSolutionCalculationPaths(
    //   secondaryNeedsVector,
    //   currentNodeId,
    //   primaryRequirementsVectorId
    // );
    layouts = adaptLayouts(layouts, currentMatrixId, horizontalFactor, 0);
    horizontalFactor++;

    // shift primary and secondary requirement vectors
    layouts = shiftComponentsInLayouts(layouts, horizontalFactor, primaryRequirementsVectorId);
    layouts = shiftComponentsInLayouts(layouts, horizontalFactor, secondaryRequirementsVectorId);

    setProperty({path: `nodes__${currentNodeId}__layouts`, value: layouts});
    setProperty({path: `nodes__${currentNodeId}__components`, value: nodeComponents});
};
