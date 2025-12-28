# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vbguest.auto_update = false

  # Common provisioning for Docker
  docker_install = <<-SHELL
    apt-get update -y
    apt-get install -y ca-certificates curl gnupg

    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
      gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    systemctl enable docker
    systemctl start docker

    usermod -aG docker vagrant
  SHELL

  config.vm.define "master" do |master|

    master.vm.box = "ubuntu/jammy64"
    master.vm.hostname = "master"    
    
    master.vm.network :private_network, ip: "192.168.56.101"
    
    master.vm.provider "virtualbox" do |v|
      v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
      v.customize ["modifyvm", :id, "--memory", 4096]
      v.customize ["modifyvm", :id, "--name", "master"]
      v.customize ["modifyvm", :id, "--cpus", 2]
    end

    master.vm.provision "shell", inline: docker_install

  end
 
  config.vm.define "node01" do |node|
    node.vm.box = "ubuntu/jammy64"
    node.vm.hostname = "node01"
 
    node.vm.network :private_network, ip: "192.168.56.102"

    node.vm.provider "virtualbox" do |v|
      v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
      v.customize ["modifyvm", :id, "--memory", 4096]
      v.customize ["modifyvm", :id, "--name", "node01"]
      v.customize ["modifyvm", :id, "--cpus", 2]
    end

    node.vm.provision "shell", inline: docker_install

  end

end
