import { Injectable } from '@angular/core';
import {Http} from "@angular/http";


@Injectable() //Add datasevice when dan completes it.
export class RegistryAPIService {

  private baseUrl = "/api";

//   setGoogleUser(): void {}
//
//   logout(): void {}
//
//   logoutFromGoogle(): void {}
//
//   readAuthCookies(): void {}
//
//   eppLogin(): void {}
// M
//   retryEPPLogin(): void {}

  buildUrlParams(params : Map<string, string>): string {
    var url = "";
    for (var param in params) {
      if (typeof param === "object") {
        var queryString = "";
        // TODO TJ figure out how to make this a map
        // queryString = queryString + key + "=" + value + "&";
        //removes trailing / from url before appending queryString
        url = url.substring(0, url.length - 1) + "?" + queryString;
      } else {
        url = url + param + "/";
      }
    };
    //remove trailing / or ampersand before returning url
    return url.substring(0,url.length - 1);
  }

  apiGet(params): void {
    console.log("api url is: " + this.baseUrl + this.buildUrlParams(params));
    if(params[0] === "http://localhost:8081"){
      // return Http.get(this.buildUrlParams(params));
    } else {
      // return Http.get(this.baseUrl + this.buildUrlParams(params));
    }
  }

  // apiPost(): void {}
  //
  // apiPut(): void {}
  //
  // apiDelete(): void {}

  apiGetTLDs(): void {
    var tldParams = ["tlds"];
    return this.apiGet(tldParams);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
