export default {

    providers: [
        {
            name: "waterlevel.ie",
            src: "http://waterlevel.ie/geojson/latest/?fbclid={id}",
            env: {
                "id": "WATERLEVEL_IE_FBCLID"
            }
        }
    ],

    S3: {
        bucket: "tc2-waterlevels.sync"
    }

}