export class CategoryModel {
    id?: string = null;
    description: string = null;
    color: string = null;
    icon: string = null;

    constructor(values: Object = {}){
        Object.keys(this).forEach(key => {
            if(values.hasOwnProperty(key)) this[key] = values[key];
        });
    }
}