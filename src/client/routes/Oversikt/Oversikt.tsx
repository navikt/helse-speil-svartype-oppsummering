import React, { useContext, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Panel from 'nav-frontend-paneler';
import { TildelingerContext } from '../../context/TildelingerContext';
import { OppgaverContext } from '../../context/OppgaverContext';
import { useTranslation } from 'react-i18next';
import { Oppgave } from '../../../types';
import styled from '@emotion/styled';
import { Row, Tabell } from './Oversikt.styles';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import { PersonContext } from '../../context/PersonContext';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import Oversiktslinje, { SpeilOppgave } from './Oversiktslinje';
import { Location, useNavigation } from '../../hooks/useNavigation';
import { SuksessToast } from '../../components/Toast';
import { Scopes, useVarselFilter } from '../../state/varslerState';
import {
    SakstypeHeader,
    StatusHeader,
    SøkerHeader,
    TildelingHeader,
    OpprettetHeader,
    BokommuneHeader,
} from './headere/headere';
import { aktiveFiltereState, aktivKolonneState, sorteringsretningState, aktivSorteringState } from './oversiktState';
import { useLocation } from 'react-router-dom';

const Container = styled(Panel)`
    margin: 1rem;
    padding: 1rem;
    color: #3e3832;
    max-width: max-content;
`;

const LasterInnhold = styled.div`
    display: flex;
    align-items: center;
    margin-left: 1rem;
    margin-top: 1rem;
    svg {
        margin-right: 1rem;
        width: 25px;
        height: 25px;
    }
`;

const useSettInitiellRetning = () => {
    const aktivKolonne = useRecoilValue(aktivKolonneState);
    const setSorteringsretning = useSetRecoilState(sorteringsretningState);

    useEffect(() => {
        setSorteringsretning(aktivKolonne.initiellRetning);
    }, [aktivKolonne]);
};

export const Oversikt = () => {
    const { t } = useTranslation();
    const { navigateTo } = useNavigation();
    const { isFetching: isFetchingPersonBySearch, personTilBehandling, tildelPerson } = useContext(PersonContext);
    const { oppgaver, hentOppgaver, isFetchingOppgaver, error: oppgaverContextError } = useContext(OppgaverContext);
    const location = useLocation();
    const { tildelOppgave, tildelinger, tildelingError, fetchTildelinger, fjernTildeling } = useContext(
        TildelingerContext
    );
    const aktivSortering = useRecoilValue(aktivSorteringState);
    useSettInitiellRetning();
    const [currentFilters, setCurrentFilters] = useRecoilState(aktiveFiltereState);
    const harAlleTildelinger = tildelinger.length == oppgaver.length;

    useVarselFilter(Scopes.OVERSIKT);

    useEffect(() => {
        hentOppgaver().then((nyeOppgaver) => fetchTildelinger(nyeOppgaver));
    }, [location.key]);

    const onUnassignCase = (oppgavereferanse: string) => {
        fjernTildeling(oppgavereferanse);
        if (personTilBehandling) tildelPerson(undefined);
    };

    const onAssignCase = (oppgavereferanse: string, aktørId: string, email: string) => {
        tildelOppgave(oppgavereferanse, email)
            .then(() => {
                if (personTilBehandling) tildelPerson(email);
            })
            .then(() => navigateTo(Location.Sykmeldingsperiode, aktørId))
            .catch((_) => {
                fetchTildelinger(oppgaver);
            });
    };

    return (
        <>
            <SuksessToast />
            {tildelingError && <Varsel type={Varseltype.Advarsel}>{tildelingError}</Varsel>}
            {(isFetchingOppgaver || !harAlleTildelinger) && (
                <LasterInnhold>
                    <NavFrontendSpinner type="XS" />
                    Henter personer
                </LasterInnhold>
            )}
            {isFetchingPersonBySearch && (
                <LasterInnhold>
                    <NavFrontendSpinner type="XS" />
                    Henter person
                </LasterInnhold>
            )}
            {oppgaverContextError && <Varsel type={Varseltype.Feil}>{oppgaverContextError.message}</Varsel>}
            <Container border>
                <Undertittel>{t('oversikt.tittel')}</Undertittel>
                <Tabell>
                    <thead>
                        <Row>
                            <SøkerHeader />
                            <SakstypeHeader filtere={currentFilters} setFiltere={setCurrentFilters} />
                            <StatusHeader />
                            <BokommuneHeader />
                            <OpprettetHeader />
                            <TildelingHeader />
                        </Row>
                    </thead>
                    <tbody>
                        {harAlleTildelinger &&
                            oppgaver
                                .filter(
                                    (oppgave: Oppgave) =>
                                        currentFilters.length === 0 || currentFilters.find((it) => it(oppgave))
                                )
                                .map((oppgave: Oppgave) => {
                                    const tildeling = tildelinger.find((t) => t.behovId === oppgave.spleisbehovId);
                                    return tildeling?.userId
                                        ? {
                                              ...oppgave,
                                              tildeling,
                                          }
                                        : oppgave;
                                })
                                .sort(aktivSortering)
                                .map((oppgave: SpeilOppgave) => {
                                    return (
                                        <Oversiktslinje
                                            oppgave={oppgave}
                                            onAssignCase={onAssignCase}
                                            onUnassignCase={onUnassignCase}
                                            key={oppgave.spleisbehovId}
                                            antallVarsler={oppgave.antallVarsler}
                                        />
                                    );
                                })}
                    </tbody>
                </Tabell>
            </Container>
        </>
    );
};
