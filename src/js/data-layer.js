

let map
let dataPaths = ['Turkiye_iller.geojson', 'Turkiye_ilceler.geojson']
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

  drawPolygons(dataPaths[pathIndex])

  
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
    let options = {
        strokeOpacity: 1,
        strokeWeight: 0,
        fillOpacity: 0,
    }

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




function drawPolygons(dataPath, prevClickedPolygon){

  dataPath = './src/data/' + dataPath


  fetch(dataPath)
    .then(response => response.json())
    .then(data =>{

        let name
        
        for(const index in data.features){

            let coordinates = []
            const prop = data.features[index]
            
            name = prop.properties.CITY

        
            if(layerCounter != 0 && prevClickedPolygon.name !== name) continue
          

            switch(prop.properties.TYPE){
                case 'District':
                    break
            }
            
        
            prop.geometry.coordinates.forEach(elem => {
        
                elem.forEach(latLng => {

                    latLng.forEach(a =>{
                        
                        coordinates.push({ lat: a[1], lng: a[0]})
        
                    })
                })
        
            })
            
            let bounds = new google.maps.LatLngBounds()

            for(let coordinate of coordinates) bounds.extend(coordinate)

        
            let polygon = new google.maps.Polygon({
                paths: coordinates,
                strokeOpacity: 0,
                strokeWeight: 0,
                fillOpacity: 0,
                name: name,
                layerLevel: layerCounter,
                zoomLevel: () =>{

                    if(prevClickedPolygon==null) return 7
                    let zoomLevel = prevClickedPolygon.zoomLevel
                    return prevClickedPolygon.layerLevel < polygon.layerLevel ? ++zoomLevel : zoomLevel

                },
                subPolygons: [],
                prevClickedPolygon: prevClickedPolygon

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
                
                makeDarkPolygon(polygon)

                if(prevClickedPolygon != null) {
                    if (polygon.layerLevel < prevClickedPolygon.layerLevel) pathIndex++ 
                }
                else pathIndex++ 
                
                if(pathIndex < dataPaths.length){
                    layerCounter++
                    drawPolygons(dataPaths[pathIndex], polygon)
                    
                    map.setOptions({
                        zoom: polygon.zoomLevel(),
                        center: bounds.getCenter()
                    })
                }

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







