import React, { useRef, useEffect, useState, Fragment, useCallback} from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import esriConfig from "@arcgis/core/config";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import GrapDialog from 'app/views/CRUD/GrapDialog'
import { styled, Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { GET_INIT_GRAPH } from 'app/redux/actions/GraphActions.js'

const StyledBox = styled(Box)(() => ({
    padding: 0,
    margin: 0,
    height: '100%',
    width: '100%'
}))

const HYDROPHONES = [
    { location: 'Slope Base', latitude: 44.5153, longitude: -125.39 },
    { location: 'Axial Base', latitude: 45.8168, longitude: -129.754 },
    { location: 'Southern Hydrate', latitude: 44.5691, longitude: -125.1479 },
    { location: 'Central Caldera', latitude: 45.9546, longitude: -130.0089 },
    { location: 'Eastern Caldera', latitude: 45.9396, longitude: -129.9738 },
    { location: 'Oregon Slope', latitude: 44.529, longitude: -125.3893 },
    { location: 'Oregon Offshore', latitude: 44.3695, longitude: -124.954 },
    { location: 'Oregon Shelf', latitude: 44.6371, longitude: -124.306 },
]

function Oceanmap() {
    const mapDiv = useRef(null);
    const { graphList = [] } = useSelector((state) => state.graph)
    const [shouldOpenEditorDialog, setShouldOpenEditorDialog] = useState(false)
    const [currentLocation, setCurrentLocation] = useState('')
    const dispatch = useDispatch()

    const handleDialogClose = () => {
        setShouldOpenEditorDialog(false)
        dispatch({
            type: GET_INIT_GRAPH,
            payload: {},
        })
    }

    const handleOpenDialog = useCallback((open, currentLocation) => {
        setShouldOpenEditorDialog(open)
        setCurrentLocation(currentLocation)
    }, [])

    useEffect(() => {
        if (mapDiv.current)
        {
            esriConfig.apiKey = "AAPK460c081ffc584c5090c2b383ede3366b1JA6FLMBYno7qMVVlHo12K6EOAtFnfYV_6UQH2_bUGzYM0qQIBxyfrSfrVF8mJM8";

        const webmap = new WebMap({
            portalItem: {
                id: "aa1d3f80270146208328cf66d022e09c",
            },
            basemap: "arcgis-oceans"
        });

        const graphicsLayer = new GraphicsLayer();
        webmap.add(graphicsLayer);

        // add Hydrophone locations
        HYDROPHONES.forEach(element => {
            const measureThisAction = {
                title: "Get Info",
                id: "show_popup",
                location: element.location
            };

            const point = {
                type: "point",
                longitude: element["longitude"],
                latitude: element["latitude"]
            };
            const simpleMarkerSymbol = {
                type: "simple-marker",
                color: [226, 119, 40],  // Orange
                outline: {
                    color: [255, 255, 255], // White
                    width: 1
                }
            };

            const popupTemplate = {
                title: "{Name}",
                content: "<div>I am a Hydrophone</div>",
                actions: [measureThisAction]
            }
            const attributes = {
                Name: element.location,
                Description: "I am a hydrophone"
            }

            const pointGraphic = new Graphic({
                geometry: point,
                symbol: simpleMarkerSymbol,
                attributes: attributes,
                popupTemplate: popupTemplate
            });
            graphicsLayer.add(pointGraphic);
        });

        const view = new MapView({
            container: mapDiv.current,
            map: webmap,
            center: [-127, 45], //Longitude, latitude
            zoom: 8
        });

        // Event handler that fires each time an action is clicked.
        view.popup.on("trigger-action", (event) => {
            // Execute the measureThis() function if the measure-this action is clicked
            if (event.action.id === "show_popup")
            {
                setCurrentLocation(event.action.location)
                handleOpenDialog(true, event.action.location)
            }
        });
    }
    }, []);

    return (<Fragment>
        <StyledBox className="mapDiv" ref={mapDiv}>
        </StyledBox>

        {shouldOpenEditorDialog && (
            <GrapDialog
                currentLocation={currentLocation}
                graphData={graphList}
                handleClose={handleDialogClose}
                open={shouldOpenEditorDialog}
            />
        )}
    </Fragment>);
}

export default Oceanmap;
