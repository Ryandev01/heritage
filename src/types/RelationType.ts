export type Relation = {
    bindingContentType: string;
    keyContentType:string;
    parentContentType:string;
    keyColumn: string;
    key: string;
    parentColumn: string;
    parent: string;
    extra?: any
}