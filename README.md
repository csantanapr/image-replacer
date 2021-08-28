# Image Replacer

This is a [kubernets admission control mutating webhook](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/), that replaces the container images when the Pods are created

This was used to brake a kubernetes cluster during an episode of the youtube live stream [klustered #18](https://youtu.be/z0Lf303tKtQ?t=2251)

Set the environment variable `REPLACER` with the set of images to replace in the controller image, this is the default value:
```bash
REPLACER='{"ghcr.io/rawkode/klustered:v2":"quay.io/csantanapr/klustered:v2"}'
```

Development

Deploy and develop
```bash
skaffold dev
```

label the namespace `replacer=v2`
```bash
kubectl label ns default replacer=v2
```

test with:
```bash
kubectl run klustered \
-n default \
--image ghcr.io/rawkode/klustered:v2 \
--dry-run=server \
-o yaml \
| grep image:
```

The output is the Pod with the image replaced
```
- image: quay.io/csantanapr/klustered:v2
```