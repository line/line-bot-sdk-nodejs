    /**
     * Issues a new stateless channel access token by JWT assertion.
     * The newly issued token is only valid for 15 minutes but can not be revoked until it naturally expires.
     * Calls `POST https://api.line.me/oauth2/v3/token`.
     * To inspect the HTTP status code or response headers, use {@link issueStatelessChannelTokenByJWTAssertionWithHttpInfo}.
     * @param clientAssertion A JSON Web Token the client needs to create and sign with the private key of the Assertion Signing Key.
     * @returns A promise resolving to the response body.
     * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-stateless-channel-access-token">LINE Developers documentation</a>
     */
    public async issueStatelessChannelTokenByJWTAssertion(
        clientAssertion: string,
    ): Promise<IssueStatelessChannelAccessTokenResponse> {
        return this.issueStatelessChannelToken(
            "client_credentials",
            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            clientAssertion,
        );
    }

    /**
     * Issues a new stateless channel access token by client secret.
     * The newly issued token is only valid for 15 minutes but can not be revoked until it naturally expires.
     * Calls `POST https://api.line.me/oauth2/v3/token`.
     * To inspect the HTTP status code or response headers, use {@link issueStatelessChannelTokenByClientSecretWithHttpInfo}.
     * @param clientId Channel ID.
     * @param clientSecret Channel secret.
     * @returns A promise resolving to the response body.
     * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-stateless-channel-access-token">LINE Developers documentation</a>
     */
    public async issueStatelessChannelTokenByClientSecret(
        clientId: string,
        clientSecret: string,
    ): Promise<IssueStatelessChannelAccessTokenResponse> {
        return this.issueStatelessChannelToken(
            "client_credentials",
            undefined,
            undefined,
            clientId,
            clientSecret,
        );
    }

    /**
     * Issues a new stateless channel access token by JWT assertion.
     * The newly issued token is only valid for 15 minutes but can not be revoked until it naturally expires.
     * Calls `POST https://api.line.me/oauth2/v3/token`.
     * This method returns the response body together with the underlying `httpResponse`.
     * @param clientAssertion A JSON Web Token the client needs to create and sign with the private key of the Assertion Signing Key.
     * @returns A promise resolving to the response body together with the underlying `httpResponse`.
     * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-stateless-channel-access-token">LINE Developers documentation</a>
     */
    public async issueStatelessChannelTokenByJWTAssertionWithHttpInfo(
        clientAssertion: string,
    ): Promise<Types.ApiResponseType<IssueStatelessChannelAccessTokenResponse>> {
        return this.issueStatelessChannelTokenWithHttpInfo(
            "client_credentials",
            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            clientAssertion,
        );
    }

    /**
     * Issues a new stateless channel access token by client secret.
     * The newly issued token is only valid for 15 minutes but can not be revoked until it naturally expires.
     * Calls `POST https://api.line.me/oauth2/v3/token`.
     * This method returns the response body together with the underlying `httpResponse`.
     * @param clientId Channel ID.
     * @param clientSecret Channel secret.
     * @returns A promise resolving to the response body together with the underlying `httpResponse`.
     * @see <a href="https://developers.line.biz/en/reference/messaging-api/#issue-stateless-channel-access-token">LINE Developers documentation</a>
     */
    public async issueStatelessChannelTokenByClientSecretWithHttpInfo(
        clientId: string,
        clientSecret: string,
    ): Promise<Types.ApiResponseType<IssueStatelessChannelAccessTokenResponse>> {
        return this.issueStatelessChannelTokenWithHttpInfo(
            "client_credentials",
            undefined,
            undefined,
            clientId,
            clientSecret,
        );
    }
