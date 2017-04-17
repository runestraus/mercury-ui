# WebportalUi

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-beta.31.

## Installing Angular CLI
Make sure to install Angular CLI globally:
`npm install -g @angular/cli`

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Using vagrant

A vagrant setup has been provided for running mercury-ui in a linux vm.
In order to get up and running, install Vagrant for your platform from here:
https://www.vagrantup.com/downloads.html
You will also need to install VirtualBox from here:
https://www.virtualbox.org/wiki/Downloads

Use the following command to download the VM image and launch it in virtualbox:
`vagrant up`

Once this completes, your virtual machine will be running. You can shut it down using `vagrant halt` from the host machine.
In order to connect to the virtual machine, use `vagrant ssh` from the root of the mercury-ui project, then navigate
to `/vagrant/` in the linux vm, where the project code can be found. Make sure to run `yarn install`.

### File sync
Open up a separate terminal in the project root (on your host machine) and run `vagrant rsync-auto`. This will make
sure that any changes that you make to the project on the host machine are reflected on the virtual machine.

That's it. From the `/vagrant/` directory you should be able to run all necessary commands for the project
like `ng serve` and `ng test`.

For more detailed instructions on how to use vagrant, visit https://www.vagrantup.com/


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
