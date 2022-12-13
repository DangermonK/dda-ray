
step based Digital Differential Analyzer (DDA) algorithm

#Install

````shell
npm i @dangermonk/dda-ray
````

#Use

initialize a ray from floating point grid coordinates

````typescript
import { DDARay } from "./index";

const position = {
    x: 2.5, 
    y: 4.2 
};

const vector = {
	x: 2,
    y: 3
}

const ray = new DDARay(position, vector);
````

iterate through the grid from the starting point: 

`````typescript
ray.nextCell();     // returns the next cell the ray is intersecting with

ray.nextPoint();    // returns the next grid intersection point between cells

ray.next();         // returns point and cell
`````
