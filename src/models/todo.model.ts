export class TodoModel {
    id?: string = null;
    description: string = null;
    done: boolean = false;
    createAt: number = Date.now();

    constructor(values: Object = {}){
        Object.keys(this).forEach(key => {
            if(values.hasOwnProperty(key)) this[key] = values[key];
        });
    }
}