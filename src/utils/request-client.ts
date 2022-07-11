import { isNodeProcess } from "./detect";

const fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response> =
  (() => {
    if (isNodeProcess()) {
      return require("node-fetch");
    }

    return window.fetch;
  })();

export class RequestClient {
  private readonly baseUrl;
  private readonly headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(
    url: string,
    query: { [key: string]: string | number }
  ): Promise<T> {
    url =
      this.baseUrl +
      url +
      Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join("&");

    return fetch(url, { method: "GET", headers: this.headers }).then((res) =>
      res.json()
    );
  }

  async post<T, K>(url: string, body: K): Promise<T> {
    url = this.baseUrl + url;

    return fetch(url, {
      method: "POST",
      headers: this.headers,
      body: body ? JSON.stringify(body) : null,
    }).then((res) => res.json());
  }
}
