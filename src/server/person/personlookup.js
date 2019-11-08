'use strict';

const moment = require('moment');

const logger = require('../logging');
const { isValidSsn } = require('../aktørid/ssnvalidation');
const { valueFromClaim } = require('../auth/authsupport');
const spleis = require('./spleisClient');
const onBehalfOf = require('../auth/onbehalfof');

const personIdHeaderName = 'nav-person-id';

let aktørIdLookup;
let spadeClient;
let spleisId;

const setup = ({ aktørIdLookup: aktøridlookup, spadeClient: spadeclient, config }) => {
    aktørIdLookup = aktøridlookup;
    spadeClient = spadeclient;
    spleisId = config.clientIDSpleis;
};

const personSøk = async (req, res) => {
    const undeterminedPersonId = req.headers[personIdHeaderName];
    auditLog(req, undeterminedPersonId || 'missing person id');
    if (!undeterminedPersonId) {
        logger.error(`Missing header '${personIdHeaderName}' in request`);
        res.status(400).send(`Påkrevd header '${personIdHeaderName}' mangler`);
        return;
    }

    let aktorId = isValidSsn(undeterminedPersonId)
        ? await toAktørId(undeterminedPersonId)
        : undeterminedPersonId;
    if (!aktorId) {
        res.status(404).send('Kunne ikke finne aktør-ID for oppgitt fødselsnummer');
        return;
    }

    respondWith(res, _personSøk(aktorId, req.session.spadeToken), input => input);
};

const behovForPeriode = (req, res) => {
    auditLog(req);

    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD');

    respondForSummary(res, _behovForPeriode(yesterday, today, req.session.spadeToken));
};

const auditLog = (request, ...queryParams) => {
    const speilUser = valueFromClaim('name', request.session.spadeToken);
    logger.audit(
        `${speilUser} is doing lookup with params: ${queryParams?.reduce(
            (previous, current) => `${previous}, ${current}`,
            ''
        )}`
    );
};

const toAktørId = async fnr => {
    return await aktørIdLookup.hentAktørId(fnr).catch(err => {
        logger.error(`Could not fetch aktørId. ${err}`);
    });
};

const _personSøk = (aktorId, spadeAccessToken) => {
    const onBehalfOfToken = onBehalfOf(spleisId, spadeAccessToken);
    return spleis.hentPerson(aktorId, onBehalfOfToken);
};

const _behovForPeriode = (fom, tom, accessToken) =>
    spadeClient.behandlingerForPeriode(fom, tom, accessToken);

const respondWith = (res, lookupPromise, mapper) => {
    lookupPromise
        .then(apiResponse => {
            res.status(apiResponse.statusCode).send({
                person: mapper(apiResponse.body.person)
            });
        })
        .catch(err => {
            logger.error(`Error during behov lookup: ${err}`);
            res.sendStatus(err.statusCode);
        });
};

const respondForSummary = (res, lookupPromise) => {
    lookupPromise
        .then(apiResponse => {
            res.status(apiResponse.statusCode).send({
                behov: apiResponse.body
            });
        })
        .catch(err => {
            logger.error(`Error during behov lookup: ${err}`);
            res.sendStatus(err.statusCode);
        });
};

module.exports = {
    setup,
    personSøk,
    behovForPeriode: behovForPeriode,
    _personSøk,
    _behovForPeriode: _behovForPeriode
};
