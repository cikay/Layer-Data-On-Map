
let map

function initMap(){

    var polygonCoords = [{
        lat: -16.4836,
        lng: 145.4653
      },
      {
        lat: -16.4500,
        lng: 145.4133
      },
      {
        lat: -16.2319,
        lng: 145.4763
      },
      {
        lat: -16.0878,
        lng: 145.4548
      },
      {
        lat: -16.0454,
        lng: 145.9000
      },
      {
        lat: -16.4861,
        lng: 146.1269
      },
      {
        lat: -16.7229,
        lng: 145.6500
      },
      {
        lat: -16.5913,
        lng: 145.5192
      },
    ];

    map = new google.maps.Map(document.getElementById('map'), {

        zoom: 9,
        center: { lat: -16.4836, lng: 145.4653 }
    })

    let polygon = new google.maps.Polygon({
        paths: polygonCoords,
        strokeOpacity: 0,
        strokeWeight: 0,
        fillOpacity: 0,
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

    polygon.setMap(map)


    
}