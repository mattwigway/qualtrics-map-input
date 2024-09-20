
// This shims the Qualtrics API for testing outside of a Qualtrics environment

let qapi

if (window.Qualtrics !== undefined) {
    // running inside Qualtrics
    qapi = window.Qualtrics
} else {
    // not running inside qualtrics, shim out required functions
    console.warn("Not running inside Qualtrics, entering debug mode")
    qapi = {
        SurveyEngine: {
            addOnload: function (f) {
                window.addEventListener("load", f)
            },
            addOnReady: function (f) {
                window.addEventListener("load", f)
            },
            addOnunload: function (f) {
                window.addEventListener("unload", f)
            },
            setEmbeddedData: function (k, v) {
                console.log(`Debug mode: setting embedded data ${k} to ${v}`)
            }
        }
    }
}

export default qapi