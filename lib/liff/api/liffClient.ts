/**
 * LIFF server API
 * LIFF Server API.
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/* tslint:disable:no-unused-locals */
import { AddLiffAppRequest } from "../model/addLiffAppRequest";
import { AddLiffAppResponse } from "../model/addLiffAppResponse";
import { GetAllLiffAppsResponse } from "../model/getAllLiffAppsResponse";
import { UpdateLiffAppRequest } from "../model/updateLiffAppRequest";

import * as Types from "../../types";
import { ensureJSON } from "../../utils";
import { Readable } from "stream";

import HTTPClient from "../../http";

const pkg = require("../../../package.json");

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

interface httpClientConfig {
  baseURL?: string;
  channelAccessToken: string;
  // TODO support defaultHeaders?
}

export class LiffClient {
  private config: httpClientConfig;

  constructor(config: httpClientConfig) {
    this.config = {
      baseURL: "https://api.line.me",
      ...config,
    };
  }

  /**
   * Adding the LIFF app to a channel
   * @param addLiffAppRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/liff-server/#add-liff-app"> Documentation</a>
   */
  public async addLIFFApp(
    addLiffAppRequest: AddLiffAppRequest,
  ): Promise<AddLiffAppResponse> {
    const requestUrl = new URL("/liff/v1/apps", this.config.baseURL);

    const resp = await fetch(requestUrl, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.config.channelAccessToken,
        "User-Agent": `${pkg.name}/${pkg.version}`,

        "Content-type": "application/json",
      },

      body: JSON.stringify(addLiffAppRequest),
    });

    const resBody = await resp.json();

    // for backward compatibility, inject x-line-request-id to response body.
    const { LINE_REQUEST_ID_HTTP_HEADER_NAME } = Types;
    const requestIdHeader = resp.headers.get(LINE_REQUEST_ID_HTTP_HEADER_NAME);
    if (requestIdHeader) {
      resBody[LINE_REQUEST_ID_HTTP_HEADER_NAME] = requestIdHeader;
    }

    return resBody;
  }
  /**
   * Deletes a LIFF app from a channel.
   * @summary Delete LIFF app from a channel
   * @param liffId ID of the LIFF app to be updated
   *
   * @see <a href="https://developers.line.biz/en/reference/liff-server/#delete-liff-app">Delete LIFF app from a channel Documentation</a>
   */
  public async deleteLIFFApp(
    liffId: string,
  ): Promise<Types.MessageAPIResponseBase> {
    const requestUrl = new URL(
      "/liff/v1/apps/{liffId}".replace("{" + "liffId" + "}", String(liffId)),
      this.config.baseURL,
    );

    const resp = await fetch(requestUrl, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + this.config.channelAccessToken,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    });

    const resBody = await resp.json();

    // for backward compatibility, inject x-line-request-id to response body.
    const { LINE_REQUEST_ID_HTTP_HEADER_NAME } = Types;
    const requestIdHeader = resp.headers.get(LINE_REQUEST_ID_HTTP_HEADER_NAME);
    if (requestIdHeader) {
      resBody[LINE_REQUEST_ID_HTTP_HEADER_NAME] = requestIdHeader;
    }

    return resBody;
  }
  /**
   * Gets information on all the LIFF apps added to the channel.
   * @summary Get all LIFF apps
   *
   * @see <a href="https://developers.line.biz/en/reference/liff-server/#get-all-liff-apps">Get all LIFF apps Documentation</a>
   */
  public async getAllLIFFApps(): Promise<GetAllLiffAppsResponse> {
    const requestUrl = new URL("/liff/v1/apps", this.config.baseURL);

    const resp = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + this.config.channelAccessToken,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    });

    const resBody = await resp.json();

    // for backward compatibility, inject x-line-request-id to response body.
    const { LINE_REQUEST_ID_HTTP_HEADER_NAME } = Types;
    const requestIdHeader = resp.headers.get(LINE_REQUEST_ID_HTTP_HEADER_NAME);
    if (requestIdHeader) {
      resBody[LINE_REQUEST_ID_HTTP_HEADER_NAME] = requestIdHeader;
    }

    return resBody;
  }
  /**
   * Update LIFF app settings
   * @param liffId ID of the LIFF app to be updated
   * @param updateLiffAppRequest
   *
   * @see <a href="https://developers.line.biz/en/reference/liff-server/#update-liff-app"> Documentation</a>
   */
  public async updateLIFFApp(
    liffId: string,
    updateLiffAppRequest: UpdateLiffAppRequest,
  ): Promise<Types.MessageAPIResponseBase> {
    const requestUrl = new URL(
      "/liff/v1/apps/{liffId}".replace("{" + "liffId" + "}", String(liffId)),
      this.config.baseURL,
    );

    const resp = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + this.config.channelAccessToken,
        "User-Agent": `${pkg.name}/${pkg.version}`,

        "Content-type": "application/json",
      },

      body: JSON.stringify(updateLiffAppRequest),
    });

    const resBody = await resp.json();

    // for backward compatibility, inject x-line-request-id to response body.
    const { LINE_REQUEST_ID_HTTP_HEADER_NAME } = Types;
    const requestIdHeader = resp.headers.get(LINE_REQUEST_ID_HTTP_HEADER_NAME);
    if (requestIdHeader) {
      resBody[LINE_REQUEST_ID_HTTP_HEADER_NAME] = requestIdHeader;
    }

    return resBody;
  }
}
