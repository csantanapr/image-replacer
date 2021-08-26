# klustered

Using a mutatingwebhook located here that replaces the image
https://mutating.dlze6x7tnnz.eu-gb.codeengine.appdomain.cloud

Label the namespace to affect
```
kubectl label ns default klustered=v2
```
remove label
k label ns default klustered-


mkdir -p /etc/cubernetes/manifests
cp /etc/kubernetes/manifests/* /etc/cubernetes/manifests/
rm /etc/cubernetes/manifests/kube-scheduler.yaml
ls -l /etc/cubernetes/manifests/

sed -i 's#staticPodPath: /etc/kubernetes/manifests#staticPodPath: /etc/cubernetes/manifests#' /var/lib/kubelet/config.yaml
cat /var/lib/kubelet/config.yaml | grep static

systemctl restart kubelet

kubectl taint node csantanapr-worker-1 node-role.kubernetes.io/master='':NoSchedule
kubectl taint node csantanapr-worker-2 node-role.kubernetes.io/master='':NoSchedule

clear history

cat /dev/null > ~/.bash_history && history -c