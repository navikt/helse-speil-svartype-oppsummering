import React, { useContext } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Oppgave, SpesialistPersoninfo, TildeltOppgave } from '../../../types';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Oppgaveetikett } from './Oppgaveetikett';
import { IkkeTildelt, Tildelt } from './tildeling';
import { useUpdateVarsler } from '../../state/varslerState';
import { somDato } from '../../mapping/vedtaksperiode';
import { Tabellrad } from '@navikt/helse-frontend-tabell';
import { speilV2 } from '../../featureToggles';
import { useEmail } from '../../state/authentication';
import { useOppgavetildeling } from '../../hooks/useOppgavetildeling';
import { OppgaverContext } from '../../context/OppgaverContext';
import { Varseltype } from '../../../../__mocks__/@navikt/helse-frontend-varsel';
import { Flatknapp } from 'nav-frontend-knapper';

const formatertNavn = (personinfo: SpesialistPersoninfo): string => {
    const { fornavn, mellomnavn, etternavn } = personinfo;
    return [fornavn, mellomnavn, etternavn].filter((n) => n).join(' ');
};

const formatertVarsel = (antallVarsler?: number) =>
    !antallVarsler ? '' : antallVarsler === 1 ? '1 varsel' : `${antallVarsler} varsler`;

const CellContainer = styled.div<{ width?: number }>`
    position: relative;
    height: 48px;
    display: flex;
    align-items: center;
    margin: 0 -1rem 0 -1rem;
    padding: 0 1rem;

    ${({ width }) =>
        width &&
        `
        width: ${width}px;
        max-width: ${width}px;
    `}
`;

const TekstMedEllipsis = styled(Normaltekst)`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    > a:focus {
        box-shadow: 0 0 0 3px #254b6d;
    }
`;

const SkjultLenke = styled(Link)`
    position: absolute;
    width: 100%;
    height: 100%;
    margin-left: -1rem;
    outline: none;
`;

const SkjultSakslenke: React.FunctionComponent<{ oppgave: Oppgave }> = ({ oppgave }) => {
    const { fjernVarsler } = useUpdateVarsler();
    return (
        <SkjultLenke
            className="lenke-skjult"
            to={speilV2 ? `/person/${oppgave.aktørId}/utbetaling` : `/sykmeldingsperiode/${oppgave.aktørId}`}
            onClick={fjernVarsler}
            tabIndex={-1}
        />
    );
};

const Sakslenke: React.FunctionComponent<{ oppgave: Oppgave; skjult?: boolean }> = ({ oppgave, children }) => {
    const { fjernVarsler } = useUpdateVarsler();
    return (
        <Link className="lenke" to={`/sykmeldingsperiode/${oppgave.aktørId}`} onClick={fjernVarsler}>
            {children}
        </Link>
    );
};

const Sakstype = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={120}>
        <Oppgaveetikett type={oppgave.type} />
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Søker = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={200}>
        <TekstMedEllipsis>
            <Sakslenke oppgave={oppgave}>{formatertNavn(oppgave.personinfo)}</Sakslenke>
        </TekstMedEllipsis>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Opprettet = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer>
        <Normaltekst>{`${somDato(oppgave.opprettet).format(NORSK_DATOFORMAT)}`}</Normaltekst>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Bosted = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer width={200}>
        <TekstMedEllipsis>{oppgave.boenhet.navn}</TekstMedEllipsis>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const Status = ({ oppgave }: { oppgave: Oppgave }) => (
    <CellContainer>
        <Element>{formatertVarsel(oppgave.antallVarsler)}</Element>
        <SkjultSakslenke oppgave={oppgave} />
    </CellContainer>
);

const MeldAv = ({ oppgave }: { oppgave: Oppgave }) => {
    const email = useEmail();
    const { fjernTildeling } = useOppgavetildeling();
    const { leggTilVarsel } = useUpdateVarsler();
    const { markerOppgaveSomTildelt } = useContext(OppgaverContext);
    const tildelingsvarsel = (message: string) => ({ message, type: Varseltype.Advarsel });
    const erTildeltInnloggetBruker = oppgave.tildeltTil === email;

    const meldAvTildeling = () => {
        fjernTildeling(oppgave.oppgavereferanse)
            .then(() => markerOppgaveSomTildelt(oppgave))
            .catch(() => {
                leggTilVarsel(tildelingsvarsel('Kunne ikke fjerne tildeling av sak.'));
            });
    };

    return (
        <CellContainer>
            {erTildeltInnloggetBruker ? (
                <Flatknapp mini tabIndex={0} onClick={meldAvTildeling}>
                    Meld av
                </Flatknapp>
            ) : (
                ''
            )}
        </CellContainer>
    );
};

export const tilOversiktsrad = (oppgave: Oppgave): Tabellrad => ({
    celler: [oppgave.type, oppgave, oppgave.opprettet, oppgave.boenhet.navn, oppgave.antallVarsler, oppgave],
    id: oppgave.oppgavereferanse,
});

export const renderer = (rad: Tabellrad): Tabellrad => {
    const oppgave = rad.celler[1] as Oppgave;

    return {
        ...rad,
        celler: [
            <Sakstype oppgave={oppgave} />,
            <Søker oppgave={oppgave} />,
            <Opprettet oppgave={oppgave} />,
            <Bosted oppgave={oppgave} />,
            <Status oppgave={oppgave} />,
            oppgave.tildeltTil ? <Tildelt oppgave={oppgave as TildeltOppgave} /> : <IkkeTildelt oppgave={oppgave} />,
            <MeldAv oppgave={oppgave} />,
        ],
    };
};
