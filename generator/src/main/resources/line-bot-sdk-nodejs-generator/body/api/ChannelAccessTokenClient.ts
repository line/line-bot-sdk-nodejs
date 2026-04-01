    public async issueStatelessChannelTokenByJWTAssertion(
        clientAssertion: string,
    ): Promise<IssueStatelessChannelAccessTokenResponse> {
        return this.issueStatelessChannelToken(
            "client_credentials",
            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            clientAssertion,
        );
    }

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
