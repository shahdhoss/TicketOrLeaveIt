const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { vendors } = require('./models');

const packageDef = protoLoader.loadSync("vendor.proto");
const grpcObject = grpc.loadPackageDefinition(packageDef);
const vendorPackage = grpcObject.vendor;

const grpcServer = new grpc.Server();

grpcServer.addService(vendorPackage.VendorService.service, {
  GetVendorByName: async (call, callback) => {
    try {
      const vendorName = call.request.name;
      const vendor = await vendors.findOne({ where: { name: vendorName } });
      
      if (!vendor) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "Vendor not found"
        });
      }
      
      callback(null, {
        id: vendor.id,
        name: vendor.name
      });
    } catch (error) {
      console.error("Error:", error.message);
      callback({
        code: grpc.status.INTERNAL,
        message: `Error: ${error.message}`
      });
    }
  }
});

const startServer = (port = '0.0.0.0:50051') => {
  grpcServer.bindAsync(
    port, 
    grpc.ServerCredentials.createInsecure(), 
    (err, port) => {
      if (err) {
        console.error('Failed to bind server:', err);
        return;
      }
      console.log(`gRPC VendorService running on port ${port}`);
      grpcServer.start();
    }
  );
};

module.exports = {
  grpcServer,
  startServer,
  vendorPackage
};