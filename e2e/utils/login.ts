// Copyright 2017 The Nomulus Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { protractor, browser, element, by } from 'protractor';
const url = require('../data/url.json');
const data = require('../data/user.json');
const path = require('path');
const EC = protractor.ExpectedConditions;
const address = require('address.json');

module.exports = {
  address: require('./address.js').getBaseUrl(),

  googleLogin: function (optionsArg) {

    const options = optionsArg || {};
    const emailAccount = options.email ? options.email : data.reg_admin.email;
    const password = options.pass ? options.pass : data.reg_admin.password;

    browser.get(address.getBaseUrl());

    const txtEmail = element(by.id('Email'));
    const btnNext = element(by.id('next'));
    const txtPassword = element(by.id('Passwd'));
    const btnSignIn = element(by.id('signIn'));

    element(by.id('google-login')).click();
    browser.sleep(2000);
    // Turn off Angular as google login isn't Angular page.
    browser.ignoreSynchronization = true;
    browser.sleep(2000);
    expect(browser.getTitle()).toEqual('Sign in - Google Accounts');
    expect(txtEmail.isPresent());
    element(by.id('Email')).sendKeys('reg-admin@hg.team');
    expect(btnNext.isPresent());
    element(by.id('next')).click();
    browser.wait(EC.visibilityOf(txtPassword), 1 * 5000, 'Element txtPassword has not become visible after 5 seconds wait');
    browser.sleep(2000);
    element(by.id('Passwd')).sendKeys('X6&KLq6gdH=3');
    expect(btnSignIn.isPresent());
    btnSignIn.click();
    browser.sleep(2000);
  },

  googleLoginFirst: function (optionsArg) {
    const options = optionsArg || {};
    const emailAccount = options.email ? options.email : data.reg_admin.email;
    const password = options.pass ? options.pass : data.reg_admin.password;

    browser.ignoreSynchronization = true;
    browser.get('https://mail.google.com');

    const txtEmail = element(by.id('Email'));
    const btnNext = element(by.id('next'));
    const txtPassword = element(by.id('Passwd'));
    const btnSignIn = element(by.id('signIn'));
    txtEmail.isDisplayed() // If email box is not displayed we are on the password input
      .then(function (present) {
        if (present) {
          browser.wait(EC.visibilityOf(txtEmail), 1 * 20000,
            'Element txtEmail has not become visible after 20 seconds wait');
          txtEmail.sendKeys(emailAccount);
          btnNext.click();
        }
        browser.wait(EC.visibilityOf(txtPassword), 1 * 20000,
          'Element txtPassword has not become visible after 20 seconds wait');
        txtPassword.sendKeys(password);
        btnSignIn.click();
      });
  },

  donutsLogout: function () {
    browser.get(this.address).then(function () {
      const lnkUserName = element(by.id('registrarUserName'));
      browser.wait(EC.visibilityOf(lnkUserName), 1 * 10000,
        'Element lnkUserName has not become visible after 10 seconds wait');
      lnkUserName.click();
    }).then(function () {
      const lnkLogout = element(by.css('.linkElement.active > i'));
      browser.wait(EC.visibilityOf(lnkLogout), 1 * 10000,
        'Element lnkLogout has not become visible after 10 seconds wait');
      lnkLogout.click();
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
    });
  },

  googlelogout: function () {
    const logoutMenu = element(by.id('logout-menu'));
    logoutMenu.click();
    const logoutOption = element(by.id('logout'));
    logoutOption.click();

    expect(browser.getTitle()).toEqual('WebportalUi');
    expect(element(by.id('google-login')).isPresent());
  },

  googleLogoutOld: function () {
    browser.ignoreSynchronization = true;

    browser.driver.get(url.google_logout).then(function () {
      browser.driver.wait(EC.titleContains('Google Accounts'), 1 * 14000,
        'Google Accounts title has not become visible after 1.4 seconds wait');
    }).then(function () { // Select remove account
      browser.driver.get(url.google_logout).then(function () {
        const removeAccountBtn = element(by.id('edit-account-list'));
        browser.driver.wait(EC.visibilityOf(removeAccountBtn), 1 * 14000,
          'Element edit-account-list has not become visible after 1.4 seconds wait');
        removeAccountBtn.click();
      });
    }).then(function () { // Select top account in list
      browser.driver.get(url.google_logout).then(function () {
        const accountBtn = element(by.id('choose-account-0'));
        browser.driver.wait(EC.visibilityOf(accountBtn), 1 * 14000,
          'Element choose-account has not become visible after 1.4 seconds wait');
        accountBtn.click();
      });
    }).then(function () { // Click done to fully logout user
      browser.driver.get(url.google_logout).then(function () {
        const doneBtn = element(by.id('edit-account-list'));
        browser.driver.wait(EC.visibilityOf(doneBtn), 1 * 14000,
          'Element edit-account-list has not become visible after 1.4 seconds wait');
        doneBtn.click();
      });
    });
  },

  clear: function () {
    browser.driver.executeScript('window.sessionStorage.clear();');
    browser.driver.executeScript('window.localStorage.clear();');
    browser.driver.sleep(1000);
  }
};

