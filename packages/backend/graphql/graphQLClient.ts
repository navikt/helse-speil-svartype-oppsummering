import { v4 as uuidv4 } from 'uuid';

import { requestAzureOboToken } from '../auth/token';
import config from '../config';
import logger from '../logging';

const baseUrl = config.server.spesialistBaseUrl;

export interface GraphQLClient {
    postGraphQLQuery: (wonderwallToken: string, data: string) => Promise<Response>;
}

export default (): GraphQLClient => ({
    postGraphQLQuery: async (wonderwallToken: string, data: string): Promise<Response> => {
        const callId = uuidv4();
        const oboResult = await requestAzureOboToken(wonderwallToken, config.oidc.clientIDSpesialist);
        if (!oboResult.ok) {
            throw new Error(`Feil ved henting av OBO-token: ${oboResult.error.message}`);
        }

        const options = {
            method: 'post',
            headers: {
                Authorization: `Bearer ${oboResult.token}`,
                'X-Request-Id': callId,
                'Content-Type': 'application/json',
            },
            body: data,
        };

        const operationName = JSON.parse(data)['operationName'];
        const maskertToken = oboResult.token.substring(0, 6);
        logger.debug(
            `Kaller ${baseUrl} med X-Request-Id: ${callId}, operationName: ${operationName} og token: ${maskertToken}...`,
        );
        const start = Date.now();
        const response = await fetch(`${baseUrl}/graphql`, options);
        const tidBrukt = Date.now() - start;
        logger.debug(
            `GraphQL-kall til ${baseUrl} med X-Request-Id: ${callId} og operationName: ${operationName} ferdig etter ${tidBrukt} ms`,
        );
        return response;
    },
});
