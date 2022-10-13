// OTel JS - API
const { trace } = require('@opentelemetry/api');

// OTel JS - Core
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");

// OTel JS - Core - Exporters
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');

// OTel JS - Core - Instrumentations
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { MySQLInstrumentation } = require('@opentelemetry/instrumentation-mysql');
const { AwsInstrumentation } = require('@opentelemetry/instrumentation-aws-sdk');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { Resource } = require( '@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

// OTel JS - Contrib - AWS X-Ray
const { AWSXRayIdGenerator } = require('@opentelemetry/id-generator-aws-xray');
const { AWSXRayPropagator } = require('@opentelemetry/propagator-aws-xray');


module.exports = (serviceName) => {
  // create a provider using the AWS ID Generator
  const tracerConfig = {
    idGenerator: new AWSXRayIdGenerator(),
    // any instrumentations can be declared here
    instrumentations: [
      new HttpInstrumentation(),
      new MySQLInstrumentation(),
      new ExpressInstrumentation(),
      new AwsInstrumentation({
        suppressInternalInstrumentation: true
      }),
    ],
    // any resources can be declared here
    resource: Resource.default().merge(new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName
    }))
  };

  const tracerProvider = new NodeTracerProvider(tracerConfig);

  // add OTLP exporter
  const otlpExporter = new OTLPTraceExporter();
  tracerProvider.addSpanProcessor(new BatchSpanProcessor(otlpExporter));

  // Register the tracer provider with an X-Ray propagator
  tracerProvider.register({
    propagator: new AWSXRayPropagator()
  });

  // Return an tracer instance
  return trace.getTracer("apprunner-hotel-app");
}
