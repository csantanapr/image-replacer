# klustered

Using a mutatingwebhook located here that replaces the image
https://mutating.dlze6x7tnnz.eu-gb.codeengine.appdomain.cloud

Label the namespace to affect
```
kubectl label ns default klustered=v2
```
remove label
k label ns default klustered-


export KUBECONFIG=/etc/kubernetes/admin.conf
alias k=kubectl

 k run nginx --image foo.io/bitnami/nginx