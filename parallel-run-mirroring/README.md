# Parallel run with traffic mirroring

This demo shows how the parallel run pattern works, togheter with traffic mirroring.


## Prerequisites

- Istio 1.6.5
- Docker for Mac/Windows

1. Install Istio:

```bash
istioctl install --set profile=demo
```

2. Enable automatic sidecar injection for `default` namespace:

```bash
kubectl label namespace default istio-injection=enabled
```

## Deploy the monolith

```
kubectl apply -f monolith/k8s.yaml
kubectl apply -f monolith/gateway.yaml
kubectl apply -f monolith/vs.yaml
```

Test the monolith using `curl`:

```
curl -H "content-type: application/json" -X POST -d '{ "purchaseId": "2", "amount": 50, "state": "WA" }' localhost/tax
```

## Deploy the tax service

```
kubectl apply -f tax-service/k8s.yaml
kubectl apply -f tax-service/vs.yaml
```

## Enable traffic mirroring

We will modify the tax monolith virtual service to enable mirroring requests to the tax-service. The consumers will see the responses from the `tax-monolith`, however, the requests will also be sent to the `tax-service` instance.

In this demo we are logging the results as JSON strings to the standard output. A more realistic scenario might be writing to the database and then comparing the results from the `tax-monolith` and `tax-service` to ensure the new service works as expected.

Let's enable traffic mirroring by deploying the `mirror.yaml` file:

```bash
kubectl apply -f mirror.yaml
```

### Test the traffic mirroring

1. Generate some traffic: 

```bash
while true; do curl -H "content-type: application/json" -X POST -d '{ "purchaseId": "2", "amount": 50, "state": "CA" }' localhost/tax; sleep 1; done
```

You can open Grafana (`istioctl dash grafana`) and see the traffic being sent to both monolith and the `tax-service` as well.

To generate failure in the `tax-service` you can use the state with name `XX`. That will cause the `tax-service` to fail, yet you will still get the response back from the monolith.

## Clean up

1. Delete the services, deployments and Istio resources:

```
kubectl delete deploy tax-monolith tax-service
kubectl delete svc tax-monolith tax-service
kubectl delete vs tax-monolith tax-service
kubectl delete gateway gateway
```

1. Remove Istio:

```
istioctl manifest generate --set profile=demo | kubectl delete -f -
kubectl delete namespace istio-system
```

