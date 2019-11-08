import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { oppsummeringstekster } from '../../tekster';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import React, { useContext, useState } from 'react';
import { postVedtak } from '../../io/http';
import { PersonoversiktContext } from '../../context/PersonoversiktContext';
import { PersonContext } from '../../context/PersonContext';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import './Utbetaling.less';
import InfoModal from '../../components/InfoModal';

const BESLUTNING = { GODKJENT: 'GODKJENT', AVVIST: 'AVVIST' };

const Utbetaling = () => {
    const { personoversikt } = useContext(PersonoversiktContext);
    const { personTilBehandling } = useContext(PersonContext);
    const [isSending, setIsSending] = useState(false);
    const [beslutning, setBeslutning] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [modalOpen, setModalOpen] = useState(false);

    const fattVedtak = godkjent => {
        const behovId = personoversikt.find(
            behov => behov.aktørId === personTilBehandling.aktørId
        )?.['@id'];
        setIsSending(true);
        postVedtak(behovId, personTilBehandling.aktørId, godkjent)
            .then(() => {
                setBeslutning(godkjent ? BESLUTNING.GODKJENT : BESLUTNING.AVVIST);
                setError(undefined);
            })
            .catch(err => setError(err))
            .finally(() => {
                setIsSending(false);
                setModalOpen(false);
            });
    };

    return (
        <Panel className="Utbetaling">
            {modalOpen && (
                <InfoModal
                    onClose={() => setModalOpen(false)}
                    onApprove={() => fattVedtak(true)}
                    isSending={isSending}
                    infoMessage="Når du trykker ja blir utbetalingen sendt til oppdragsystemet. Dette kan ikke angres."
                />
            )}
            <Undertittel>{oppsummeringstekster('utbetaling')}</Undertittel>
            <AlertStripeAdvarsel>
                Utbetaling skal kun skje hvis det ikke er funnet feil. Feil meldes umiddelbart inn
                til teamet for evaluering.
            </AlertStripeAdvarsel>
            {beslutning ? (
                <AlertStripeInfo>
                    {beslutning === BESLUTNING.GODKJENT
                        ? 'Utbetalingen er sendt til oppdragsystemet.'
                        : 'Saken er sendt til behandling i Infotrygd.'}
                </AlertStripeInfo>
            ) : (
                <div className="knapperad">
                    <div className="knapp--utbetaling">
                        <button onClick={() => setModalOpen(true)}>Utbetal</button>
                    </div>
                    <Knapp onClick={() => fattVedtak(false)} spinner={isSending && !modalOpen}>
                        Behandle i Infotrygd
                    </Knapp>
                </div>
            )}
            {error && (
                <Normaltekst className="skjemaelement__feilmelding">
                    {error.message || 'En feil har oppstått.'}
                    {error.statusCode === 401 && <a href="/"> Logg inn</a>}
                </Normaltekst>
            )}
        </Panel>
    );
};

export default Utbetaling;
