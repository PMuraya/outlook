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
    //Get the namespace that defines all our svg elements
    NS: string = "http://www.w3.org/2000/svg";
    //
    //These are the specifications for the first circle
    c1: { x: number, y: number, r: number } = { x: 150, y: 225, r: 75 };
    //
    //The speficications for the second circle
    c2: { x: number, y: number, r: number } = { x: 450, y: 75, r: 75 };
    //
    //The line identifier:- to mark the highlighting line.
    public line = document.createElementNS(this.NS, 'line');
    //
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