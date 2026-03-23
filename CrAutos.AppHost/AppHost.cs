var builder = DistributedApplication.CreateBuilder(args);

var apiService = builder.AddProject<Projects.CrAutos_Api>("apiservice")
    .WithHttpHealthCheck("/health");

builder.AddNpmApp("web", "../CrAutos.Web")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health")
    .WithReference(apiService)
    .WaitFor(apiService);

builder.AddProject<Projects.CrAutos_Api>("crautos-api");

builder.Build().Run();
