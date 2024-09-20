import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import Qualtrics from "./qualtrics.js"
import { Protocol } from "pmtiles"
import layers from "protomaps-themes-base"

Qualtrics.SurveyEngine.addOnload(() => {
    // set up protomaps
    const protocol = new Protocol()
    maplibregl.addProtocol("pmtiles", protocol.tile)
})

Qualtrics.SurveyEngine.addOnunload(() => {
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

    const map = new maplibregl.Map({
        container: divId,
        style: {
            version: 8,
            glyphs:'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
            sprite: "https://protomaps.github.io/basemaps-assets/sprites/v3/dark",
            sources: {
                "protomaps": {
                    type: "vector",
                    url: prefixedUrl,
                    attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
                }
            },
            layers: layers("protomaps","dark")
        },
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
