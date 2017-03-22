// Copyright 2017 Donuts Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
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

import { browser, by, element } from 'protractor';
import { Address } from '../utils/address';

export class LoginPage {
  loginEmail = element(by.id('Email'));
  nextButton = element(by.id('next'));
  loginPassword =  element(by.id('Passwd'));
  signInButton =  element(by.id('signIn'));
  googleLoginButton = element(by.id('google-login'));

  clickLoginButton() { this.googleLoginButton.click(); };
  // typeloginEmail(keys) { this.loginEmail.sendKeys(keys); };
  clickNextButton() { this.nextButton.click(); };

  // typeloginPasswd(keys)  { this.loginPassword.sendKeys(keys); };
  clickSignInButton()  { this.signInButton.click(); };

  login() {
    const address = new Address();
    browser.get(address.getBaseUrl());
    expect(browser.getTitle()).toEqual('WebportalUi');
    expect(this.googleLoginButton.isPresent());
    this.clickLoginButton();
    browser.sleep(2000);
    // Turn off Angular as google login isn't Angular page.
    browser.ignoreSynchronization = true;
    browser.sleep(2000);

    expect(browser.getTitle()).toEqual('Sign in - Google Accounts');
    expect(this.loginEmail.isPresent());
    this.loginEmail.sendKeys('reg-admin@hg.team');
    // this.typeloginEmail('reg-admin@hg.team');

    expect(element(by.id('next')).isPresent());
    this.clickNextButton();
    browser.sleep(2000);
    // this.typeloginPasswd('X6&KLq6gdH=3');
    this.loginPassword.sendKeys('X6&KLq6gdH=3');
    this.clickSignInButton();
  }
}
