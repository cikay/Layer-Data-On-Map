import Polygon from 'google-maps'



export class CPolygon extends Polygon{

    
    constructor({optinos, type}){

        super(coordinates)
        this.type = type
        const subPolygons = []

      
    }

    pushSubPolygon(polygon){

        subPolygons.push(polygon)

    }

    getSubPolygons(){
        return subPolygons
    }

    setMouseOver(){

        this.on('mouseover', () => {


        })
    }

    resetMouseOver(){

        this.on('mouseover', () => {
            
        })

    }

    setSubPolygonsMouseOver(){

    }

    resetSubPolygonnMouseOver(){

    }

    

}
  