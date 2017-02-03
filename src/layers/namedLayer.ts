export class NamedLayer{
    name:string;
    type:string;
    autoAdd:boolean;
    layer:any;
    constructor(name:string,type:string,autoAdd:boolean){
        this.name = name;
        this.type = type;
        this.autoAdd = autoAdd;
    }
}