/**
 * Channel Access Token API
 * This document describes Channel Access Token API.
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/* tslint:disable:no-unused-locals */
import { ChannelAccessTokenKeyIdsResponse } from "../model/channelAccessTokenKeyIdsResponse";
import { ErrorResponse } from "../model/errorResponse";
import { IssueChannelAccessTokenResponse } from "../model/issueChannelAccessTokenResponse";
import { IssueShortLivedChannelAccessTokenResponse } from "../model/issueShortLivedChannelAccessTokenResponse";
import { IssueStatelessChannelAccessTokenResponse } from "../model/issueStatelessChannelAccessTokenResponse";
import { VerifyChannelAccessTokenResponse } from "../model/verifyChannelAccessTokenResponse";

import * as Types from "../../types";
import { ensureJSON } from "../../utils";
import { Readable } from "stream";

import HTTPClient from "../../http-axios";
import { AxiosResponse } from "axios";

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

interface httpClientConfig {
  baseURL?: string;
  // TODO support defaultHeaders?
}

export class ChannelAccessTokenClient {
  private httpClient: HTTPClient;

  constructor(config: httpClientConfig) {
    if (!config.baseURL) {
      config.baseURL = "https://api.line.me";
    }
    this.httpClient = new HTTPClient({
      defaultHeaders: {},
      responseParser: this.parseHTTPResponse.bind(this),
      baseURL: config.baseURL,
    });
  }

  private parseHTTPResponse(response: AxiosResponse) {
    const { LINE_REQUEST_ID_HTTP_HEADER_NAME } = Types;
    let resBody = {
      ...response.data,
    };
    if (response.headers[LINE_REQUEST_ID_HTTP_HEADER_NAME]) {
      resBody[LINE_REQUEST_ID_HTTP_HEADER_NAME] =
        response.headers[LINE_REQUEST_ID_HTTP_HEADER_NAME];
    }
    return resBody;
  }

  /**
   * Gets all valid channel access token key IDs.
   * @param clientAssertionType `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`
   * @param clientAssertion A JSON Web Token (JWT) (opens new window)the client needs to create and sign with the private key.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-all-valid-channel-access-token-key-ids-v2-1"> Documentation</a>
   */
  public async getsAllValidChannelAccessTokenKeyIds(
    clientAssertionType: string,
    clientAssertion: string,
  ): Promise<ChannelAccessTokenKeyIdsResponse> {
    const queryParams = {
      clientAssertionType: clientAssertionType,
      clientAssertion: clientAssertion,
    };

    const res = this.httpClient.get<ChannelAccessTokenKeyIdsResponse>(
      "/oauth2/v2.1/tokens/kid",
      queryParams,
    );
    return ensureJSON(res);
  }
  /**
   * Issue short-lived channel access token
   * @param grantType `client_credentials`
   * @param clientId Channel ID.
   * @param clientSecret Channel secret.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-shortlived-channel-access-token"> Documentation</a>
   */
  public async issueChannelToken(
    grantType?: string,
    clientId?: string,
    clientSecret?: string,
  ): Promise<IssueShortLivedChannelAccessTokenResponse> {
    const formParams = {
      grant_type: grantType,
      client_id: clientId,
      client_secret: clientSecret,
    };
    Object.keys(formParams).forEach((key: keyof typeof formParams) => {
      if (formParams[key] === undefined) {
        delete formParams[key];
      }
    });

    const res =
      this.httpClient.postForm<IssueShortLivedChannelAccessTokenResponse>(
        "/v2/oauth/accessToken",
        formParams,
      );
    return ensureJSON(res);
  }
  /**
   * Issues a channel access token that allows you to specify a desired expiration date. This method lets you use JWT assertion for authentication.
   * @param grantType client_credentials
   * @param clientAssertionType urn:ietf:params:oauth:client-assertion-type:jwt-bearer
   * @param clientAssertion A JSON Web Token the client needs to create and sign with the private key of the Assertion Signing Key.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-channel-access-token-v2-1"> Documentation</a>
   */
  public async issueChannelTokenByJWT(
    grantType?: string,
    clientAssertionType?: string,
    clientAssertion?: string,
  ): Promise<IssueChannelAccessTokenResponse> {
    const formParams = {
      grant_type: grantType,
      client_assertion_type: clientAssertionType,
      client_assertion: clientAssertion,
    };
    Object.keys(formParams).forEach((key: keyof typeof formParams) => {
      if (formParams[key] === undefined) {
        delete formParams[key];
      }
    });

    const res = this.httpClient.postForm<IssueChannelAccessTokenResponse>(
      "/oauth2/v2.1/token",
      formParams,
    );
    return ensureJSON(res);
  }
  /**
   * Issues a new stateless channel access token, which doesn\'t have max active token limit unlike the other token types. The newly issued token is only valid for 15 minutes but can not be revoked until it naturally expires.
   * @param grantType `client_credentials`
   * @param clientAssertionType URL-encoded value of `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`
   * @param clientAssertion A JSON Web Token the client needs to create and sign with the private key of the Assertion Signing Key.
   * @param clientId Channel ID.
   * @param clientSecret Channel secret.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-stateless-channel-access-token"> Documentation</a>
   */
  public async issueStatelessChannelToken(
    grantType?: string,
    clientAssertionType?: string,
    clientAssertion?: string,
    clientId?: string,
    clientSecret?: string,
  ): Promise<IssueStatelessChannelAccessTokenResponse> {
    const formParams = {
      grant_type: grantType,
      client_assertion_type: clientAssertionType,
      client_assertion: clientAssertion,
      client_id: clientId,
      client_secret: clientSecret,
    };
    Object.keys(formParams).forEach((key: keyof typeof formParams) => {
      if (formParams[key] === undefined) {
        delete formParams[key];
      }
    });

    const res =
      this.httpClient.postForm<IssueStatelessChannelAccessTokenResponse>(
        "/oauth2/v3/token",
        formParams,
      );
    return ensureJSON(res);
  }
  /**
   * Revoke short-lived or long-lived channel access token
   * @param accessToken Channel access token
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#revoke-longlived-or-shortlived-channel-access-token"> Documentation</a>
   */
  public async revokeChannelToken(
    accessToken?: string,
  ): Promise<Types.MessageAPIResponseBase> {
    const formParams = {
      access_token: accessToken,
    };
    Object.keys(formParams).forEach((key: keyof typeof formParams) => {
      if (formParams[key] === undefined) {
        delete formParams[key];
      }
    });

    const res = this.httpClient.postForm("/v2/oauth/revoke", formParams);
    return ensureJSON(res);
  }
  /**
   * Revoke channel access token v2.1
   * @param clientId Channel ID
   * @param clientSecret Channel Secret
   * @param accessToken Channel access token
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#revoke-channel-access-token-v2-1"> Documentation</a>
   */
  public async revokeChannelTokenByJWT(
    clientId?: string,
    clientSecret?: string,
    accessToken?: string,
  ): Promise<Types.MessageAPIResponseBase> {
    const formParams = {
      client_id: clientId,
      client_secret: clientSecret,
      access_token: accessToken,
    };
    Object.keys(formParams).forEach((key: keyof typeof formParams) => {
      if (formParams[key] === undefined) {
        delete formParams[key];
      }
    });

    const res = this.httpClient.postForm("/oauth2/v2.1/revoke", formParams);
    return ensureJSON(res);
  }
  /**
   * Verify the validity of short-lived and long-lived channel access tokens
   * @param accessToken A short-lived or long-lived channel access token.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#verfiy-channel-access-token"> Documentation</a>
   */
  public async verifyChannelToken(
    accessToken?: string,
  ): Promise<VerifyChannelAccessTokenResponse> {
    const formParams = {
      access_token: accessToken,
    };
    Object.keys(formParams).forEach((key: keyof typeof formParams) => {
      if (formParams[key] === undefined) {
        delete formParams[key];
      }
    });

    const res = this.httpClient.postForm<VerifyChannelAccessTokenResponse>(
      "/v2/oauth/verify",
      formParams,
    );
    return ensureJSON(res);
  }
  /**
   * You can verify whether a Channel access token with a user-specified expiration (Channel Access Token v2.1) is valid.
   * @param accessToken Channel access token with a user-specified expiration (Channel Access Token v2.1).
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#verfiy-channel-access-token-v2-1"> Documentation</a>
   */
  public async verifyChannelTokenByJWT(
    accessToken: string,
  ): Promise<VerifyChannelAccessTokenResponse> {
    const queryParams = {
      accessToken: accessToken,
    };

    const res = this.httpClient.get<VerifyChannelAccessTokenResponse>(
      "/oauth2/v2.1/verify",
      queryParams,
    );
    return ensureJSON(res);
  }
}
