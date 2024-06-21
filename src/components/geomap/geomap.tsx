import { ChangeEvent, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';
import proj4 from 'proj4';
export interface FileData {
  [key: string]: any;
}
import { GoogleMap, LoadScript, Polygon, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';

const Geomap: React.FC = () => {



  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAYrYkXmvCrViFpOR2xF2FDt2aFXmPfie4"
  })

  // Define your projection source and target
  const source = '+proj=utm +zone=51 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'; // EPSG:32651
  const target = '+proj=longlat +datum=WGS84 +no_defs'; // WGS84 geographic coordinates

  const [mapData, setMapData] = useState([]);
  const[center, setCenter] = useState({
    lat: 10.6218, // Latitude for Negros Occidental
    lng: 122.9540 // Longitude for Negros Occidental
  });

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };


  useEffect(()=>{
    const getMapData = saveMapData();

    setMapData(getMapData);
    console.log("mapData");
    console.log(getMapData);

  }, [])

  const options = {
    fillColor: "lightblue",
    fillOpacity: 0.4,
    strokeColor: "blue",
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1,
  };

  const saveMapData = () => {
    const geoJsonData: any = localStorage.getItem('uploadedData');
    const parsedData = JSON.parse(geoJsonData);
    console.log(parsedData);
    if(parsedData){
        return parsedData.features.map((feature: { geometry: { coordinates: [any, any][][][]; }; }) => {
            return feature.geometry.coordinates[0][0].map(([x, y]) => {
              const [lng, lat] = proj4(source, target, [x, y]);
              return { lat, lng };
            });
          });
    }
  }

  const renderGeometry = () => {
    if (mapData.length <= 0) return null;
    return mapData.map((polygonCoords: [any, any][][], index: React.Key | null | undefined) => {
      return   (<Polygon
        key={index}
        paths={polygonCoords[0].map(([lng, lat]) => {
          const coordinate = { lng, lat }
          console.log("longtitude", coordinate.lng)
          console.log("latitude", coordinate.lat)
          return coordinate
        })}
        options={{
          fillColor: '#00FF00',
          fillOpacity: 0.4,
          strokeColor: '#00FF00',
          strokeOpacity: 1,
          strokeWeight: 2,
        }}
      />)
    });
  };

  return (
    <div>
        {mapData &&  (
        <>
        {isLoaded && (
            <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={14}
            center={center}
            >
            {mapData.map((polygon, index) => (
            <Polygon key={index} paths={polygon} options={options} />
            ))}
            </GoogleMap>
        )}
        </>
        )}
    </div>
  );
};

export default Geomap;