import AWS from "aws-sdk";

const s3 = new AWS.S3( { apiVersion: "2006-03-01" } );

export default function buildStore( config ) {

    const bucketParams = { Bucket: config.S3.bucket };

    return {

        async getObject( path ) {

            const query = { ...bucketParams, Key: path.join( "/" ) };
            try {

                const result = await s3.getObject( query ).promise();
                if ( !result.Body ) return null;
                return JSON.parse( result.Body.toString() );

            } catch( err ) {

                if ( err && err.code === "NoSuchKey") return null;
                throw err;

            }

        },

        async putObject( path, object ) {

            const query = { ...bucketParams, Key: path.join( "/" ) };
            const stringified = JSON.stringify( object );
            query.Body = Buffer.from( stringified );
            query.ContentType = "application/json";
            await s3.putObject( query ).promise();

        }

    };

}