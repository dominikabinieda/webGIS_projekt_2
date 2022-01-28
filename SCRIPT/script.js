"use strict";

require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Legend",
], function (Map, SceneView, FeatureLayer, GraphicsLayer, Legend, Query) {

    //Mapa
    const mapa = new Map({
        basemap: "streets-night-vector"
    });

    const view = new SceneView({
        map: mapa,
        container: "divMap3D", 
        zoom: 4.5,
        center: [-102, 42]
    });

    //Warstwy
    const earthquakes1 = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    });

    const earthquakes2 = new FeatureLayer({
        url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0"
    });
    
    const graphicL = new GraphicsLayer();

    mapa.add(earthquakes2)
    mapa.add(graphicL);

    //Widgety
    const legend = new Legend({
        view: view
    });

    view.ui.add(legend,{
        position: "bottom-right"
    });
    
    //Zapytanie
    let query = earthquakes1.createQuery();
    query.where = "MAGNITUDE > 4";
    query.outFields = ["*"];
    query.returnGeometry = true;

    earthquakes1.queryFeatures(query)
    //co ma sie stac po wykonaniu zapytania
        .then(response => {
            console.log(response);
            getResults(response.features);
        })
        .catch(error => {
            console.log(error);
        });

    //Wizualizacja
    function getResults(features){
        let symbol = {
            type: "simple-marker",
            size: 20,
            color: "#A52A2A",
            style: "triangle"
        };
        
        features.map(elem => {
            elem.symbol = symbol;
        });

        graphicL.addMany(features)
    };

    // Rendering
    const simpleRendering = {
        type: "simple",
        symbol: {
            type: "point-3d",
            symbolLayers: [
                {
                    type: "object",
                    resource: {
                        primitive: "cylinder"
                    },
                    width:5000
                },
            ]
        },
        label: "Earthquake",
        visualVariables: [
            {
                type: "color",
                field: "MAGNITUDE",
                stops: [
                    {
                        value: 0.5,
                        color: "green"
                    },
                    {
                        value: 2.49,
                        color: "yellow"
                    },
                    {
                        value: 4.48,
                        color: "red"
                    },
                ]
            },
            {
                type: "size",
                field: "DEPTH",
                stops: [
                    {
                        value: -3.39,
                        size: 5000
                    },
                    {
                        value: 30.97,
                        size: 15000
                    },
                ]
            }
        ]
    };
    earthquakes2.renderer = simpleRendering;
    
});
