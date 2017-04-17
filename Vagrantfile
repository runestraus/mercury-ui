# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"

  config.vm.provision "shell", inline: <<-SHELL
    yum install wget gcc-c++ make fontconfig -y
    wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
    curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
    yum install yarn nodejs -y
    yarn global add @angular/cli
  SHELL

  config.vm.synced_folder ".", "/vagrant", type: "rsync",
    rsync__exclude: [".git/", "node_modules/"]

  config.vm.network "forwarded_port", guest: 4200, host: 4200
end
