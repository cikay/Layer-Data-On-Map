

let map
let dataPaths = ['guneydogu_anadolu.json', 'gaziantep.json', 'gaziantep_oguzeli.json']
let pathIndex = 0
let zoomLevel = 5.5
let layerCounter = 0
let polygonList = []
let layerLevel = 0
let previousClickedPolygon
let clickedPolygons = []


function initMap(){

  map = new google.maps.Map(document.getElementById('map'), {

    zoom: 5, 

    center: { lat: 39.925533, lng:  32.866287}
  })

  drawPolygons()

}



function makeDarkPolygon(polygon){

    let options = {
        strokeOpacity: 1,
        strokeWeight: 1.2,
        fillOpacity: 0.5,
        fillColor: '#000000',
    }
    polygon.setOptions(options)
    
    polygon.addListener('mouseover', () => polygon.setOptions({
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeWeight: 1.2,
        fillOpacity: 0.3,
        fillColor: '#00ff00',
    }))
    polygon.addListener('mouseout', () => polygon.setOptions(options))


}


function resetSubPolygons(subPolygons){

    let options = {
        strokeOpacity: 0,
        strokeWeight: 0,
        fillOpacity: 0,
    }

    for(const poly of subPolygons){
        poly.setOptions(options)
        poly.addListener('mouseover', () => poly.setOptions(options))
        poly.addListener('mouseout', () => poly.setOptions(options))
    }

}

//if clicked polygon layer level is equal to previous then set previous clicked polygon options
function setPrevClickedPolygon(clickedPolygon, prevClickedPolygon){

    if(clickedPolygon.layerLevel == prevClickedPolygon.layerLevel)  makeDarkPolygon(prevClickedPolygon)
    // if(!polygon.isLastLayer){
    //     polygon.addListener('click',  {passive: false})
    //     polygon.addListener('mouseover',  {passive: false})
    //     polygon.addListener('mouseout',  {passive: false})
    // }
    
    
}


function setPolygons(polygonList, clickedPolygon, prevClickedPolygon) {

    resetClickedPolygon(clickedPolygon)

    if(clickedPolygon == null){

       
        for(let polygon of polygonList){

           makeDarkPolygon(polygon)
            
        }
    }
    else if(prevClickedPolygon == null){

        let options = {
            strokeOpacity: 1,
            strokeWeight: 1.2,
            fillOpacity: 0.5,
            fillColor: '#000000',

        }

        for(let polygon of polygonList){

            if(polygon === clickedPolygon) continue

           polygon.setOptions(options)
           polygon.addListener('mouseout', () => polygon.setOptions(options))
           

        } 
        
    }

    else if(prevClickedPolygon != null) {
        resetSubPolygons(prevClickedPolygon.subPolygons)
        setPrevClickedPolygon(clickedPolygon, prevClickedPolygon)
            
    }

}


function resetClickedPolygon(polygon){


    if(polygon == null) return
    // if(!polygon.isLastLayer){
    //     polygon.addListener('click',  {passive: true})
    //     polygon.addListener('mouseover',  {passive: true})
    //     polygon.addListener('mouseout',  {passive: true})
    // }

    let options = {
        strokeOpacity: 1,
        strokeWeight: 0,
        fillOpacity: 0,
    }

    // if(polygon.isLastLayer){
    //     options.strokeColor = '#000000'
    //     options.strokeWeight = 1.2
    // }

 

    polygon.setOptions(options)
    polygon.addListener('mouseout', () => polygon.setOptions(options))
    polygon.addListener('mouseover', () => polygon.setOptions(options))

}

function setPolygonMouseOver(polygon){

    polygon.addListener('mouseover', () => {

        polygon.setOptions({
            strokeColor: '#000000',
            strokeOpacity: 1,
            strokeWeight: 1.2,
            fillOpacity: 0.3,
            fillColor: '#00ff00',
        })

    })
}

function drawPolygons(prevClickedPolygon=null, model=null, relatedModelId=null){

    let path
    console.log(`model: ${model}`)
    if(model === null){
       
        path = 'region/'
    }
    else if(model !== null && relatedModelId !== null ){
        path = `${model}/${relatedModelId}/`
    }
    if(path === undefined) {
       
        console.log('path is undefined')
        return
    }
    console.log(`prevClickedPolygon: ${prevClickedPolygon}, model: ${model}, `)
    console.log(`path ${path}`)
    fetch(`http://127.0.0.1:8000/service/${path}`)
    .then(res => res.json())
    .then(data => {

        let name
        console.log(data)
        for(const obj of data){

            name = obj.name
            console.log(obj)

            let polygon = new google.maps.Polygon({
                paths: obj.coordinates,
                strokeOpacity: 0,
                strokeWeight: 0,
                fillOpacity: 0,
                name: name,
                id: obj.id,
                layerLevel: layerCounter,
                zoomLevel: () =>{

                    if(prevClickedPolygon==null) return 7
                    let zoomLevel = prevClickedPolygon.zoomLevel()
                    return prevClickedPolygon.layerLevel < polygon.layerLevel ? ++zoomLevel : zoomLevel

                },
                subPolygons: [],
                prevClickedPolygon: prevClickedPolygon,
                isLastLayer: false

            })

            polygon.setOptions({
                strokeColor: '#000000',
                strokeOpacity: 1,
                strokeWeight: 1.2,
            })
            
        
            polygon.addListener('mouseover', () =>{
        
                polygon.setOptions({
                    strokeColor: '#000000',
                    strokeOpacity: 1,
                    strokeWeight: 1.2,
                    fillOpacity: 0.3,
                    fillColor: '#00ff00',
                })
            })
        
            polygon.addListener('mouseout', () =>{
        
                polygon.setOptions({
                    strokeColor: '#000000',
                    strokeOpacity: 1,
                    strokeWeight: 1.2,
                    fillOpacity: 0.0,
                })
            })

            polygon.addListener('click', () =>{

                let prevClickedPolygon = clickedPolygons.pop()
                let model 
                switch(obj.model){
                    
                    case 'Region':
                        model = 'city'
                        break
                    case 'City':
                        model = 'county'
                        break
                    case 'County':
                        model = 'neighborhood'
                        break
                }

                drawPolygons(prevClickedPolygon, model, polygon.id)

                let bounds = new google.maps.LatLngBounds()

                for(let coordinate of obj.coordinates) bounds.extend(coordinate)
                
                map.setOptions({
                    zoom: polygon.zoomLevel(),
                    center: bounds.getCenter()
                })
        
            
                if(!polygon.isLastLayer) makeDarkPolygon(polygon)

                setPolygons(polygonList, polygon, prevClickedPolygon)

                clickedPolygons.push(polygon)

            })
            
            polygon.setMap(map)
            polygonList.push(polygon)
            if(prevClickedPolygon != null){
                if(prevClickedPolygon.layerLevel < polygon.layerLevel) prevClickedPolygon.subPolygons.push(polygon)

            } 
        }

    })
    .catch(err => console.log(err))


}







