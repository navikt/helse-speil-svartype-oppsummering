'use strict';

const request = require('request-promise-native');
const authSupport = require('../auth/authsupport');

let config;

const setup = navConfig => {
    config = navConfig;
    return {
        simulate: simulate
    };
};

const simulate = async (vedtak, accessToken) => {
    vedtak.saksbehandler = authSupport.valueFromClaim('name', accessToken);

    const options = {
        uri: `${config.spennUrl}/api/v1/simulering`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: vedtak,
        json: true
    };

    return request.post(options);
};

module.exports = {
    setup: setup
};
