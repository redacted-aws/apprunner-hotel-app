'use strict'

// OTel JS - API
const { trace } = require('@opentelemetry/api');

// OTel JS - Core
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { ConsoleSpanExporter, BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");

// OTel JS - Core - Exporters
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');

// OTel JS - Core - Instrumentations
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { MySQLInstrumentation } = require('@opentelemetry/instrumentation-mysql');
const { AwsInstrumentation } = require('@opentelemetry/instrumentation-aws-sdk');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')

// OTel JS - Contrib - AWS X-Ray
const { AWSXRayIdGenerator } = require('@opentelemetry/id-generator-aws-xray');
const { AWSXRayPropagator } = require('@opentelemetry/propagator-aws-xray');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new MySQLInstrumentation(),
    new AwsInstrumentation({
      suppressInternalInstrumentation: true
    }),
  ]
});

const resource =
  Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "apprunner-hotel-app",
      [SemanticResourceAttributes.SERVICE_VERSION]: ".1.0",
    })
  );

const tracerProvider = new NodeTracerProvider({
  resource: resource,
  idGenerator: new AWSXRayIdGenerator(),
});

// Expects Collector at env variable `OTEL_EXPORTER_OTLP_ENDPOINT`, otherwise, http://localhost:4317
const exporter = new OTLPTraceExporter();
const processor = new BatchSpanProcessor(exporter);

tracerProvider.addSpanProcessor(processor);
tracerProvider.register({
  propagator: new AWSXRayPropagator()
});

module.exports = trace.getTracer("AppRunner-V2N-Demo");
