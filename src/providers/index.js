import fetch from "node-fetch";
import waterlevelIe from "./waterlevelIe.js";

const providers = {

    "waterlevel.ie": waterlevelIe

};

export function resolveProvider( config ) {

    config = JSON.parse( JSON.stringify( config ) );
    // do we have a provider for this configuration?
    const providerFactory = providers[ config.name ];
    if ( !providerFactory ) return undefined;
    // environment variables?
    if ( config.src && config.env ) {

        Object.entries( config.env ).forEach( ( [ placeholder, environmentVariable ] ) => {

            // look up the environment variable and place it in the config.src
            config.src = config.src.replace( `{${placeholder}}`, process.env[ environmentVariable ] );

        } );

    }
    return providerFactory( config, fetch );

}