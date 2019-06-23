import config from "../config.js";
import { resolveProvider } from "./providers/index.js";
import storeFactory from "./store/index.js";

const store = storeFactory( config );

function groupByDate( records ) {

    const index= {};
    records.forEach( record => {

        const day = record.date.substr( 0, 10 );
        const dayRecords = index[ day ] = index[ day ] || {};
        dayRecords[ record.id ] = record;

    } );
    return index;

}

async function mergeDay( provider, [ day, records ] ) {

    console.log( day );
    const providerDay = ( await store.getObject( [ provider.name, day ] ) ) || {};
    // merge the day's data into the data store
    const merged = { ...providerDay, ...records };
    // save
    await store.putObject( [ provider.name, day ], merged );
    console.log( day, "complete" );

}

config.providers.forEach( async config => {

    const provider = resolveProvider( config );
    if ( provider ) {

        const extractionId = `${config.name}-${Date.now()}`;
        console.log( "Extracting data", extractionId );
        const data = await provider.extract();

        console.log( "Saving extract" );
        await store.putObject( [ "extracts", extractionId ], data );

        const records = ( await provider.transform( data ) )
            .map( x => ( { ...x, extractionId } ) );
        const days = groupByDate( records );

        console.log( "Merging day data" );
        const mergeOperations = Object.entries( days ).map( entry => mergeDay( provider, entry ) );
        await Promise.all( mergeOperations );

    }

} );
