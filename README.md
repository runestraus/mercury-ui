# Nomulus Web UI (mercury-ui)
A browser based UI for managing [Nomulus](https://github.com/google/nomulus).

## Status
This repository is not presently under active development. It is (was?) a
work-in-progress when work was suspended. Contents may have settled during
shipping.

The code was building and working when work was stopped, but recent build
attempts fail with an Angular build issue, probably due to an environment and/or
tool version issue.

## Quick Summary
The main UI page provides a kind of "search for names", returning a list of
the matching registered, unregistered, or reserved name(s). Clicking on a name
allows it to be managed, including its contacts and hosts.
These are probably the most functional and useful
features of the UI, as well as the most likely thing a potential adopter of
Nomulus would want to try first.

There are also functions to manage premium and reserved names, users and roles
(authorization), TLDs, premium price categories, some ICANN reporting related
features, and others. These functions are more likely to be needing more
UX design or be Donuts specific.

The UI depends on a REST API service to function (not included here, but
potentially available), running on App Engine, that mainly provides access to
objects in the Nomulus datastore.
The API service contains little logic, and largely consists of REST endpoints
and code to marshal between objects and JSON. This would probably be better
provided by first class API functions in the base Nomulus code, in the frontend
service or otherwise.

### Main API endpoints
1. `/api/me` — Logged user information/authorization
2. `/api/search` — Domain name searching
3. `/api/epp` — EPP operations (EPP over HTTP)
4. `/api/registrars` — Registrar contact information
5. `/api/tlds` — TLD management
6. `/api/users` — User management
7. `/api/roles` — User role information
7. `/api/pricingcategories` -- Premium price categories
8. `/api/icann` — ICANN reporting data

### Suggestion
Focus on supporting the name search and EPP operations (domains, contacts,
hosts), enabling the basic functions a registrar would want to perform.
This would provide a nice "out of the box" experience for potential adopters,
and a good demo. Some basic authorization endpoints would be
needed too, and perhaps some TLD or other system metadata.

Next might be to provide a way for registrars to manage authorized users or
merge the registrar contact update functions from the existing core Nomulus UI.
The goal would be enabling actual registrars to use the UI.

Finally, PROFIT!!!

## Development Hints
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-beta.31.

### Installing Angular CLI
Make sure to install Angular CLI globally:
`npm install -g @angular/cli`
Install Yarn (OSX):
`brew install yarn`

### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

### Using vagrant

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

#### File sync
Open up a separate terminal in the project root (on your host machine) and run `vagrant rsync-auto`. This will make
sure that any changes that you make to the project on the host machine are reflected on the virtual machine.

That's it. From the `/vagrant/` directory you should be able to run all necessary commands for the project
like `ng serve` and `ng test`.

For more detailed instructions on how to use vagrant, visit https://www.vagrantup.com/


### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
