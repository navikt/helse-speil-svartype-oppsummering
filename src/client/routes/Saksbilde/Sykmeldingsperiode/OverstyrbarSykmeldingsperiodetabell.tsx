import React, { useContext, useState } from 'react';
import { Overstyringsskjema } from '../../../components/tabell/Overstyringsskjema';
import {
    dato,
    ikon,
    overstyrbarGradering,
    overstyrbarKilde,
    overstyrbarType,
    tomCelle,
} from '../../../components/tabell/rader';
import { Dagtype, Sykdomsdag } from '../../../context/types.internal';
import { PersonContext } from '../../../context/PersonContext';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import Element from 'nav-frontend-typografi/lib/element';
import { Overstyringsknapp } from '../../../components/tabell/Overstyringsknapp';
import styled from '@emotion/styled';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { overstyrbareTabellerEnabled } from '../../../featureToggles';
import { FormProvider, useForm } from 'react-hook-form';
import { postOverstyring } from '../../../io/http';

const OverstyrbarTabell = styled(Tabell)`
    thead,
    thead tr,
    thead tr th {
        vertical-align: bottom;
    }
    tbody tr td {
        height: 48px;
    }
`;

const HøyrestiltContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

interface OverstyrbarSykmeldingsperiodetabellProps {
    toggleOverstyring: () => void;
}

export const OverstyrbarSykmeldingsperiodetabell = ({
    toggleOverstyring,
}: OverstyrbarSykmeldingsperiodetabellProps) => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const [overstyrteDager, setOverstyrteDager] = useState<Sykdomsdag[]>([]);
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });

    const leggTilOverstyrtDag = (nyDag: Sykdomsdag) => {
        const finnesFraFør = overstyrteDager.find((dag) => dag.dato.isSame(nyDag.dato));
        if (!finnesFraFør) {
            setOverstyrteDager((dager) => [...dager, nyDag]);
        } else {
            setOverstyrteDager((dager) =>
                dager.map((gammelDag) => (gammelDag.dato.isSame(nyDag.dato) ? nyDag : gammelDag))
            );
        }
    };

    const fjernOverstyrtDag = (dagen: Sykdomsdag) => {
        setOverstyrteDager((dager) => dager.filter((overstyrtDag) => !overstyrtDag.dato.isSame(dagen.dato)));
    };

    const fom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT);
    const tabellbeskrivelse = `Overstyrer sykmeldingsperiode fra ${fom} til ${tom}`;

    const headere = [
        '',
        {
            render: <Element>Sykmeldingsperiode</Element>,
            kolonner: 3,
        },
        {
            render: <Element>Gradering</Element>,
        },
        overstyrbareTabellerEnabled ? (
            <HøyrestiltContainer>
                <Overstyringsknapp overstyrer toggleOverstyring={toggleOverstyring} />
            </HøyrestiltContainer>
        ) : (
            ''
        ),
    ];

    const rader =
        aktivVedtaksperiode?.sykdomstidslinje.map((dag) => {
            const overstyrtDag = overstyrteDager.find((overstyrtDag) => overstyrtDag.dato.isSame(dag.dato));
            const erOverstyrt = overstyrtDag !== undefined && JSON.stringify(overstyrtDag) !== JSON.stringify(dag);
            const dagen = overstyrtDag ?? dag;
            return {
                celler: [
                    tomCelle(),
                    dato(dagen),
                    ikon(dagen),
                    overstyrbarType(dagen, leggTilOverstyrtDag, fjernOverstyrtDag),
                    overstyrbarGradering(dagen, leggTilOverstyrtDag, fjernOverstyrtDag),
                    overstyrbarKilde(dagen, erOverstyrt),
                ],
                className: dagen.type === Dagtype.Helg ? 'disabled' : undefined,
            };
        }) ?? [];

    const organisasjonsnummer = () =>
        personTilBehandling!.arbeidsgivere.find((arbeidsgiver) =>
            arbeidsgiver.vedtaksperioder.find((vedtaksperiode) => vedtaksperiode.id === aktivVedtaksperiode?.id)
        )!.organisasjonsnummer;

    const tilOverstyrteDager = (dager: Sykdomsdag[]) =>
        dager.map((dag) => ({
            dato: dag.dato.format('YYYY-MM-DD'),
            type: dag.type,
            grad: dag.gradering,
        }));

    const sendOverstyring = () => {
        const { begrunnelse, unntaFraInnsyn } = form.getValues();

        const overstyring = {
            aktørId: personTilBehandling!.aktørId,
            fødselsnummer: personTilBehandling!.fødselsnummer,
            organisasjonsnummer: organisasjonsnummer(),
            dager: tilOverstyrteDager(overstyrteDager),
            begrunnelse,
            unntaFraInnsyn,
        };

        postOverstyring(overstyring);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(sendOverstyring)}>
                <OverstyrbarTabell beskrivelse={tabellbeskrivelse} headere={headere} rader={rader} />
                <Overstyringsskjema overstyrteDager={overstyrteDager} avbrytOverstyring={toggleOverstyring} />
            </form>
        </FormProvider>
    );
};
