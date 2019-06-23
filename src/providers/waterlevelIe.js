import path from "path";

function asDate( value ) {

    return ( new Date( value.replace( " ", "T" ) ) ).toISOString();

}

export default function providerFactory( config, fetch ) {

    const { name, src } = config;

    async function extract() {

        var resp = await fetch( src );
        if ( !resp.ok ) throw new Error( `Failed to fetch data from ${src}` );
        var data = await resp.json();
        return data;

    }

    async function transform( data ) {

        if ( !( data && data.features ) ) return undefined;

        return data.features
            .map( feature => ( { ...{ geometry: {}, properties: {} }, ...feature } ) )
            .map( ( { id, geometry, properties } ) => ( {

                id: path.join( properties.url, id.toString() ),
                name: properties[ "station.name" ],
                date: asDate( properties.datetime ),
                coordinates: geometry.coordinates,
                value: properties.value

            } ) );

    }

    return { name, extract, transform };

}