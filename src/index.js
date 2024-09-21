import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import Qualtrics from "./qualtrics.js"
import { Protocol } from "pmtiles"
// not working with latest protomaps until this is released:
// https://github.com/protomaps/basemaps/pull/301
//import layers from "protomaps-themes-base"
import lightStyle from "./light-style.js"

Qualtrics.SurveyEngine.addOnload(() => {
    // set up protomaps
    const protocol = new Protocol()
    maplibregl.addProtocol("pmtiles", protocol.tile)
})

Qualtrics.SurveyEngine.addOnUnload(() => {
    // tear down protomaps
    maplibregl.removeProtocol("pmtiles")
})

// record a lnglat from an event into the embedded data
function recordLngLat (lngLat, embeddedDataName) {
    Qualtrics.SurveyEngine.setEmbeddedData(`${embeddedDataName}_lat`, lngLat.lat)
    Qualtrics.SurveyEngine.setEmbeddedData(`${embeddedDataName}_lon`, lngLat.lng)
}

// Create a new pin-drop map in the element with the specified ID
// Lat-lon will be placed in embedded data starting with the given name
// e.g. if embeddedDataName is home_location, embedded data home_location_lat and
// home_location_lon will be set
export function qualtricsProtomapsPinDrop (divId, embeddedDataName, centerLat, centerLon, zoom, pmtilesUrl) {
    const prefixedUrl = pmtilesUrl.startsWith("pmtiles://") ? pmtilesUrl : "pmtiles://" + pmtilesUrl

    const style = Object.assign({}, lightStyle)
    style.sources.protomaps.url = prefixedUrl

    const map = new maplibregl.Map({
        container: divId,
        style: style,
        center: [centerLon, centerLat],
        zoom: zoom
    })

    let marker = null

    map.on("load", () => {
        map.on("click", (e) => {
            // any click moves the marker
            recordLngLat(e.lngLat, embeddedDataName)

            if (marker === null) {
                // first click on map, create marker
                marker = new maplibregl.Marker({
                    draggable: true
                })
                    .setLngLat(e.lngLat)
                    .addTo(map)

                marker.on("dragend", (e) => {
                    recordLngLat(marker.getLngLat(), embeddedDataName)
                })
            } else {
                marker.setLngLat(e.lngLat)
            }
        })
    })
}
