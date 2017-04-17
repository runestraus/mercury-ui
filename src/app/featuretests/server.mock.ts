import {
  HttpModule, XHRBackend, Response, ResponseOptions, ResponseOptionsArgs, Request, RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import * as logging from '../shared/logging';

/** Map of url -> request method -> response */
interface MockReplies {
  [key: string]: {
    [key: number]: (request: Request) => ResponseOptionsArgs;
  };
}

// Map of upper case http method to enum
const httpMethodsByName = Object.keys(RequestMethod)
  .reduce((result, key) => {
    result[key.toUpperCase()] = RequestMethod[key];
    return result;
  }, {});

// Map of enum to upper case http method
const httpMethodNames = Object.keys(RequestMethod)
  .reduce((result, key) => {
    result[RequestMethod[key]] = key.toUpperCase();
    return result;
  }, {});

function stripHost(url: string): string {
  if (url.startsWith('http')) {
    // strip off http:// or https://
    url = url.substring(url.indexOf('//') + 2);
    // strip off host name
    url = url.substring(url.indexOf('/'));
  }
  return url;
}

function defaultRequestHandler(reply: ResponseOptionsArgs):
    (request: Request) => ResponseOptionsArgs {
  return request => reply;
}

export class MockServer {

  /** Store pre-programmed mock replies to requests */
  mockReplies: MockReplies = {};
  /** Keep track of all http requests made to the server */
  requests: Array<Request> = [];

  constructor(private backend: MockBackend) {
    backend.connections.subscribe((connection: MockConnection) => {
      this.requests.push(connection.request);
      const url = stripHost(connection.request.url);
      const methodName = httpMethodNames[connection.request.method];
      const replies = this.mockReplies[url];
      if (replies) {
        const reply = replies[connection.request.method];
        if (reply) {
          const result = JSON.stringify(reply(connection.request));
          // console.debug(`Backend Request (expected): method='${methodName}', url='${url}'`);
          connection.mockRespond(new Response(new ResponseOptions(reply(connection.request))));
        } else {
          console.error(`Backend Request (unexpected method): method='${methodName}', 'url=${url}'`);
        }
      } else {
        console.error(`Backend Request (unexpected url): method='${methodName}', url='${url}'`);
      }
    });
  }

  /** Register a pre-programmed reply to a specific url and method */
  on(url: string, method: string,
      response: ResponseOptionsArgs |((Request) => ResponseOptionsArgs)): void {
    const requestMethod = httpMethodsByName[method.toUpperCase()];
    if (!this.mockReplies[url]) {
      this.mockReplies[url] = {};
    }
    // if the third arg is a response, create a default handler for it.
    // Otherwise, register the custom handler. This is necessary to support epp requests.
    if (response['body']) {
      this.mockReplies[url][requestMethod] = defaultRequestHandler(response);
    } else {
      this.mockReplies[url][requestMethod] = response as ((Request) => ResponseOptionsArgs);
    }
  }

  /** Gets a list of all requests that have been sent to the server */
  getRequests(url: string, method = '*'): Array<Request> {
    const result: Array<Request> = [];
    method = method.toUpperCase();
    for (const request of this.requests) {
      const requestUrl = stripHost(request.url);
      const requestMethod = httpMethodNames[request.method];
      if (requestUrl === url && (method === '*' || method === requestMethod)) {
        result.push(request);
      }
    }
    return result;
  }

  /** Resets mock server to its initial state */
  reset(): void {
    this.mockReplies = {};
    this.requests = [];
  }
}
