# -*- mode: ruby -*-
# vi: set ft=ruby :

_script = <<SCRIPT
set -o errexit
set -o pipefail
set -o nounset
shopt -s failglob
set -o xtrace

export DEBIAN_FRONTEND=noninteractive
curl -sL https://deb.nodesource.com/setup_iojs_1.x | sudo bash -
apt-get install -y iojs


exec sudo -i -u vagrant /bin/bash -- << EOF
cd /vagrant
npm install

EOF
SCRIPT

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.provider "virtualbox" do |v|
    v.memory = 1536
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  config.vm.provision "shell", inline: _script
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.network "forwarded_port", guest: 2992, host: 2992
end
