const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDef = protoLoader.loadSync(path.resolve(__dirname,"vendor.proto"));
const grpcObject = grpc.loadPackageDefinition(packageDef);
const vendorPackage = grpcObject.vendor;

const vendorClient = new vendorPackage.VendorService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

module.exports = vendorClient;