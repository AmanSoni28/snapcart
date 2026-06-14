interface ILocation{
  latitude:number,
  longitude:number
}

interface IProps{
  userLocation?: ILocation,
  deliveryBoyLocation?: ILocation
}

import L, { LatLngExpression } from "leaflet"
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
}); 

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);

import "leaflet/dist/leaflet.css";

function LiveMap({userLocation,deliveryBoyLocation}:IProps) {
  const [L, setL] = useState<any>(null);
  const [deliveryBoyIcon, setDeliveryBoyIcon] = useState<any>(null);
  const [userIcon, setUserIcon] = useState<any>(null);

   useEffect(() => {
    import("leaflet").then((leaflet) => {
      const Leaflet = leaflet.default;

      setL(Leaflet);

      const deliveryIcon = Leaflet.icon({
        iconUrl:
          "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
        iconSize: [45, 45],
      });

      const customerIcon = Leaflet.icon({
        iconUrl:
          "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
        iconSize: [45, 45],
      });

      setDeliveryBoyIcon(deliveryIcon);
      setUserIcon(customerIcon);
    });
  }, []);

  if (!L) {
    return <div>Loading Map...</div>;
  }

  const linePosition = deliveryBoyLocation && userLocation ?[
    [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
    [userLocation.latitude, userLocation.longitude]
  ] : []



    const center = deliveryBoyLocation ? [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude] : [userLocation?.latitude, userLocation?.longitude];
  return (
  <div className="w-full h-[500px] rounded-xl overflow-hidden shadow relative">
    
    <MapContainer
      center={center as LatLngExpression}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[userLocation?.latitude!, userLocation?.longitude!]}
        icon={userIcon}
      > <Popup>delivery Address</Popup></Marker>
      {deliveryBoyLocation && (
        <Marker
          position={[deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]}
          icon={deliveryBoyIcon}
        ><Popup>delivery Boy</Popup></Marker>
      )}

      <Polyline positions={linePosition as any} color="green"></Polyline>           
    </MapContainer>

  </div>
);
}

export default LiveMap