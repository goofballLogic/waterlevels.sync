# waterlevels.sync
Harvest data about water levels and store it as a uniformly queryable data store

# Configuration

This program expects the following environment variables:

1. AWS_REGION: the region where your S3 bucket is located (e.g. eu-west-1)
2. AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY: the keys for the account used to write to the S3 store
3. WATERLEVEL_IE_FBCLID: (for waterlevel.ie) client id to accesses data on waterlevel.ie

