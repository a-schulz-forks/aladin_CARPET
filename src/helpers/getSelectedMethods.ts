import {IMethodImplementations, IMethodsDefinition} from "@/interfaces/TaskGraphInterface";

export const getSelectedMethods = (methods: IMethodsDefinition, methodImplementations: IMethodImplementations): IMethodImplementations  => {
    return Object.entries(methods).reduce((result, [name, data]) => {
        const description = data.description;
        return {...result, [description]: methodImplementations[name]};
    }, {});
}