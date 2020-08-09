
let map

// let dataPaths = ['Turkiye_iller.geojson', 'Turkiye_ilceler.geojson']

function initMap(){




  map = new google.maps.Map(document.getElementById('map'), {

      zoom: 5, 
        
      center: { lat: 39.925533, lng:  32.866287}
  })

  drawPolygons('Turkiye_iller.geojson')

}



function drawPolygons(dataPath){

  dataPath = './src/data/' + dataPath
  
  fetch(dataPath)
    .then(response => response.json())
    .then(countries =>{


      countries.features.forEach(country => {


          
        let coordinates = []
        // console.log(country.properties.CITY_NAME)
        country.geometry.coordinates.forEach(elem => {

            elem.forEach(latLng => {
                
                // console.log(elem)
                latLng.forEach(a =>{
                    
                    coordinates.push({ lat: a[1], lng: a[0]})

                })
            })

        })

        let polygon = new google.maps.Polygon({
            paths: coordinates,
            strokeOpacity: 0,
            strokeWeight: 0,
            fillOpacity: 0,
            content: country.properties.CITY_NAME
        })

        polygon.addListener('mouseover', () =>{

            polygon.setOptions({
                strokeColor: '#000000',
                strokeOpacity: 0.6,
                strokeWeight: 1.2,
                fillOpacity: 0.3,
                fillColor: '#000000',
            })
        })

        polygon.addListener('mouseout', () =>{

            polygon.setOptions({
                strokeOpacity: 0,
                strokeWeight: 0,
                fillOpacity: 0,
            })
        })

        polygon.addListener('click', () =>{
            
            // drawPolygons(dataPaths, polygon.content)
            // pathIndex++

        })

        polygon.setMap(map)
          
      });
  })
  .catch(err => console.error(err))


}