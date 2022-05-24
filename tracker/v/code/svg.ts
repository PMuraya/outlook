//
//Resolves references to the asset.products data type.
import * as outlook from '../../../outlook/v/code/outlook.js';
//
//
export type Isvg = {svg:string};
//
//use popup to create a new message
export class svg extends outlook.baby<Isvg> {
    //
    constructor(base:outlook.page) {
        super(base, "svg.html");
    }
    //
    //In future, check if a file json containing iquestionare is selected
   async check(): Promise<boolean> {
        //
        return true;
    }
    //
    //
    async get_result(): Promise<Isvg> {
        //
        return this.result!;
    }
    //
    async show_panels(): Promise<void> {
        //
        //Draw the svg circles.
        //
        //add the click event listener to the svg.
       const svg = this.get_element("svg_object");
       //
       svg.onclick = (evt)=> this.move(evt);
    }
    //1. Move circle one to the where the current event was invoked from.
    move(evt: MouseEvent): void{
         //
         function read() {
            //
            //
         }
    }
}