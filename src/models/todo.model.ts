import { CategoryModel } from "./category.model";

export class TodoModel {
    id?: string = null;
    description: string = null;
    done: boolean = false;
    createAt: number = Date.now();
    category: CategoryModel;

    constructor(values: Object = {}){
        Object.keys(this).forEach(key => {
            if(values.hasOwnProperty(key)) this[key] = values[key];
        });
    }
}