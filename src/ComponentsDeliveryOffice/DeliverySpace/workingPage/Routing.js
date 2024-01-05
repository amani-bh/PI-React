import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "./workStyles.css";
const CreateRoutineMachineLayer = (props) => {
  var ts= false;
 if (props?.data?.lat== tt && props?.data?.latr ==tp)  
  ts = true ;
 var tt=0
  var tp=0;
  tt= props?.data?.lat;
  tp = props?.data?.latr;
 var  wayP = [
    L.latLng(props?.data?.l, props?.data?.d),
    L.latLng(props?.data?.lat, props?.data?.latr),
  ];

  const instance = L.Routing.control({
    waypoints: wayP,
    lineOptions: {
    color:'purple',
      styles: [{color:'purple', className: "animate" }], // Adding animate className
    },
    show: false,
    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: false,
    createMarker: function () {},
  });
console.log (ts)
  instance.on("routesfound", function (e)
   {
    var routes = e.routes;
    var summary = routes[0].summary;
    const idC = props.data.id;

    props.child({ id: Math.round(summary.totalTime / 60), uid: idC });
  });

  return instance;
};

const RoutingMachine = createControlComponent(CreateRoutineMachineLayer);

export default RoutingMachine;
