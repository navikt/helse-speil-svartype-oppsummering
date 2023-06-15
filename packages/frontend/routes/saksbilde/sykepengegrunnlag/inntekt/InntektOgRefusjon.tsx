import { SisteTreMånedersInntekt } from './SisteTreMånedersInntekt';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Clipboard } from '@components/clipboard';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import {
    Arbeidsgiver,
    BeregnetPeriode,
    InntektFraAOrdningen,
    Inntektstype,
    Maybe,
    OmregnetArsinntekt,
    Periodetilstand,
    Vilkarsgrunnlagtype,
} from '@io/graphql';
import { Refusjonsopplysning } from '@io/http';
import {
    useArbeidsgiver,
    useEndringerForPeriode,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
    useLokaleRefusjonsopplysninger,
    useLokaltMånedsbeløp,
    usePeriodForSkjæringstidspunkt,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { useCurrentPerson } from '@state/person';
import { isForkastet } from '@state/selectors/period';
import { getVilkårsgrunnlag } from '@state/selectors/person';
import { overstyrInntektEnabled } from '@utils/featureToggles';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

import { OverstyrArbeidsforholdUtenSykdom } from '../overstyring/OverstyrArbeidsforholdUtenSykdom';
import { BegrunnelseForOverstyring } from '../overstyring/overstyring.types';
import { Refusjonsoversikt } from '../refusjon/Refusjonsoversikt';
import { EditableInntekt } from './EditableInntekt/EditableInntekt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { RedigerGhostInntekt } from './RedigerGhostInntekt';
import { RedigerInntektOgRefusjon } from './RedigerInntektOgRefusjon/RedigerInntektOgRefusjon';
import { harIngenUtbetaltePerioderFor, harPeriodeTilBeslutterFor } from './inntektOgRefusjonUtils';

import styles from './Inntekt.module.css';

const maybePeriodeTilGodkjenning = (person: FetchedPerson, skjæringstidspunkt: DateString): Maybe<BeregnetPeriode> => {
    return (
        (
            person?.arbeidsgivere
                .flatMap((it) => it.generasjoner[0]?.perioder)
                .filter(isBeregnetPeriode) as unknown as Array<BeregnetPeriode>
        ).find(
            (it) =>
                it.periodetilstand === Periodetilstand.TilGodkjenning && it.skjaeringstidspunkt === skjæringstidspunkt,
        ) ?? null
    );
};

const maybePeriodeForSkjæringstidspunkt = (
    person: FetchedPerson,
    skjæringstidspunkt: DateString,
): Maybe<BeregnetPeriode> => {
    return (
        (
            person?.arbeidsgivere
                .flatMap((it) => it.generasjoner[0]?.perioder)
                .filter(isBeregnetPeriode) as unknown as Array<BeregnetPeriode>
        ).find((it) => it.skjaeringstidspunkt === skjæringstidspunkt) ?? null
    );
};

const harIngenBeregnedePerioder = (arbeidsgiver: Arbeidsgiver, skjæringstidspunkt: DateString): boolean =>
    (
        arbeidsgiver?.generasjoner[0]?.perioder.filter(
            (it) => it.skjaeringstidspunkt === skjæringstidspunkt && isBeregnetPeriode(it),
        ) ?? []
    ).length === 0;

const harIngenEtterfølgendePerioder = (
    arbeidsgiver: Arbeidsgiver,
    skjæringstidspunkt: DateString,
    fom: DateString,
): boolean =>
    (
        arbeidsgiver?.generasjoner[0]?.perioder.filter(
            (it) => it.skjaeringstidspunkt === skjæringstidspunkt && dayjs(it.fom).isSameOrAfter(fom),
        ) ?? []
    ).length === 0;

const useInntektKanRevurderes = (skjæringstidspunkt: DateString): boolean => {
    const person = useCurrentPerson();
    const periodeVedSkjæringstidspunkt = usePeriodForSkjæringstidspunkt(skjæringstidspunkt);
    const isReadOnlyOppgave = useIsReadOnlyOppgave();
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();

    if (!person) return false;

    const harPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, skjæringstidspunkt);

    return (
        overstyrInntektEnabled &&
        !isForkastet(periodeVedSkjæringstidspunkt) &&
        !isReadOnlyOppgave &&
        !harPeriodeTilBeslutter &&
        erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
    );
};

const useArbeidsforholdKanOverstyres = (skjæringstidspunkt: DateString, organisasjonsnummer: string): boolean => {
    const person = useCurrentPerson();
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(skjæringstidspunkt, organisasjonsnummer);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();
    const arbeidsgiver = useArbeidsgiver(organisasjonsnummer);

    if (!isGhostPeriode(period) || !person || !arbeidsgiver) {
        return false;
    }

    const periodeForSkjæringstidspunkt = maybePeriodeForSkjæringstidspunkt(person, period.skjaeringstidspunkt);
    const harPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, period.skjaeringstidspunkt);
    const arbeidsgiverHarIngenBeregnedePerioder = harIngenBeregnedePerioder(arbeidsgiver, skjæringstidspunkt);
    const arbeidsgiverHarIngenEtterfølgendePerioder = harIngenEtterfølgendePerioder(
        arbeidsgiver,
        skjæringstidspunkt,
        period.fom,
    );

    return (
        arbeidsgiverHarIngenBeregnedePerioder &&
        arbeidsgiverHarIngenEtterfølgendePerioder &&
        !harPeriodeTilBeslutter &&
        periodeForSkjæringstidspunkt !== null &&
        erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
    );
};

const useGhostInntektKanOverstyres = (skjæringstidspunkt: DateString, organisasjonsnummer: string): boolean => {
    const person = useCurrentPerson();
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(skjæringstidspunkt, organisasjonsnummer);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();

    if (!isGhostPeriode(period) || !person) {
        return false;
    }

    const periodeTilGodkjenning = maybePeriodeTilGodkjenning(person, period.skjaeringstidspunkt);

    const harUtbetaltePerioder = !harIngenUtbetaltePerioderFor(person, period.skjaeringstidspunkt);

    const harPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, period.skjaeringstidspunkt);

    return (
        (harUtbetaltePerioder || periodeTilGodkjenning !== null) &&
        !harPeriodeTilBeslutter &&
        erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
    );
};

const endreInntektUtenSykefraværBegrunnelser: BegrunnelseForOverstyring[] = [
    {
        id: '0',
        forklaring: 'Arbeidsforhold har vart kortere enn 3 måneder',
        subsumsjon: { paragraf: '8-28', ledd: '3', bokstav: 'b' },
    },
    {
        id: '1',
        forklaring: 'Varig lønnsendring',
        subsumsjon: { paragraf: '8-28', ledd: '3', bokstav: 'c' },
    },
    {
        id: '2',
        forklaring: 'Innrapportert feil inntekt til A-ordningen',
        subsumsjon: { paragraf: '8-28', ledd: '5' },
    },
    {
        id: '3',
        forklaring: 'Annen kilde til endring',
        subsumsjon: { paragraf: '8-28' },
    },
];

const endreInntektMedSykefraværBegrunnelser: BegrunnelseForOverstyring[] = [
    { id: '0', forklaring: 'Korrigert inntekt i inntektsmelding' },
    { id: '1', forklaring: 'Tariffendring i inntektsmelding' },
    { id: '2', forklaring: 'Innrapportert feil inntekt til A-ordningen' },
    { id: '3', forklaring: 'Endring/opphør av refusjon' },
    { id: '4', forklaring: 'Annen kilde til endring' },
];

interface InntektUtenSykefraværProps {
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
    erDeaktivert?: Maybe<boolean>;
    omregnetÅrsinntekt?: Maybe<OmregnetArsinntekt>;
    vilkårsgrunnlagId?: Maybe<string>;
    periodeId?: Maybe<string>;
    inntektstype?: Maybe<Inntektstype>;
    arbeidsgiver: Arbeidsgiver;
    refusjon?: Maybe<Refusjonsopplysning[]>;
    harSykefravær: boolean;
    inntektFraAOrdningen?: Array<InntektFraAOrdningen>;
    erGhostperiode: boolean;
}

export const InntektOgRefusjon = ({
    organisasjonsnummer,
    skjæringstidspunkt,
    erDeaktivert,
    omregnetÅrsinntekt,
    vilkårsgrunnlagId,
    periodeId,
    inntektstype,
    arbeidsgiver,
    refusjon,
    harSykefravær,
    inntektFraAOrdningen,
    erGhostperiode,
}: InntektUtenSykefraværProps) => {
    const [editingInntekt, setEditingInntekt] = useState(false);
    const [endret, setEndret] = useState(false);
    const person = useCurrentPerson();

    useEffect(() => {
        setEditingInntekt(false);
    }, [periodeId]);

    const arbeidsforholdKanOverstyres = useArbeidsforholdKanOverstyres(skjæringstidspunkt, organisasjonsnummer);
    const ghostInntektKanOverstyres = useGhostInntektKanOverstyres(skjæringstidspunkt, organisasjonsnummer);
    const { inntektsendringer } = useEndringerForPeriode(organisasjonsnummer);
    const kanRevurderes = useInntektKanRevurderes(skjæringstidspunkt);
    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(organisasjonsnummer, skjæringstidspunkt);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(organisasjonsnummer, skjæringstidspunkt);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning();

    if (!person) return null;

    const erVilkårgrunnlagetFraSpleis =
        getVilkårsgrunnlag(person, vilkårsgrunnlagId)?.vilkarsgrunnlagtype === Vilkarsgrunnlagtype.Spleis ?? false;
    const erRevurdering = maybePeriodeTilGodkjenning(person, skjæringstidspunkt) === null;

    return (
        <div
            className={classNames(styles.Inntekt, editingInntekt && styles.editing, erDeaktivert && styles.deaktivert)}
        >
            <div className={classNames(styles.Header, editingInntekt && styles.editing)}>
                <div className={styles.ArbeidsgiverHeader}>
                    <ArbeidsgiverikonMedTooltip />
                    <Tooltip content="Arbeidsgivernavn">
                        <div className={styles.Arbeidsgivernavn}>
                            <AnonymizableTextWithEllipsis>{arbeidsgiver.navn}</AnonymizableTextWithEllipsis>
                        </div>
                    </Tooltip>
                    <div className={styles.Organisasjonsnummer}>
                        (
                        <Clipboard
                            copyMessage="Organisasjonsnummer er kopiert"
                            tooltip={{ content: 'Kopier organisasjonsnummer' }}
                        >
                            <AnonymizableContainer>{arbeidsgiver.organisasjonsnummer}</AnonymizableContainer>
                        </Clipboard>
                        )
                    </div>
                    <Kilde type="AINNTEKT">AA</Kilde>
                </div>
                {!harSykefravær && vilkårsgrunnlagId && !erDeaktivert && ghostInntektKanOverstyres && (
                    <RedigerGhostInntekt
                        erRevurdering={erRevurdering}
                        setEditing={setEditingInntekt}
                        editing={editingInntekt}
                    />
                )}
                {harSykefravær && vilkårsgrunnlagId && erVilkårgrunnlagetFraSpleis && inntektstype ? (
                    kanRevurderes ? (
                        <RedigerInntektOgRefusjon
                            setEditing={setEditingInntekt}
                            editing={editingInntekt}
                            erRevurdering={erRevurdering}
                            skjæringstidspunkt={skjæringstidspunkt}
                            organisasjonsnummer={organisasjonsnummer}
                            arbeidsgiver={arbeidsgiver}
                        />
                    ) : (
                        <PopoverHjelpetekst ikon={<SortInfoikon />}>
                            <p>
                                {!erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
                                    ? 'Perioden kan ikke overstyres fordi det finnes en oppgave på en tidligere periode'
                                    : 'Det er ikke mulig å endre inntekt i denne perioden'}
                            </p>
                        </PopoverHjelpetekst>
                    )
                ) : null}
            </div>
            <Flex alignItems="center">
                <Bold>Beregnet månedsinntekt</Bold>
            </Flex>
            {editingInntekt && !harSykefravær ? (
                <EditableInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt!}
                    close={() => setEditingInntekt(false)}
                    onEndre={setEndret}
                    begrunnelser={endreInntektUtenSykefraværBegrunnelser}
                    organisasjonsnummer={organisasjonsnummer}
                    skjæringstidspunkt={skjæringstidspunkt}
                />
            ) : editingInntekt && harSykefravær ? (
                <EditableInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt!}
                    close={() => setEditingInntekt(false)}
                    onEndre={setEndret}
                    begrunnelser={endreInntektMedSykefraværBegrunnelser}
                    organisasjonsnummer={organisasjonsnummer}
                    skjæringstidspunkt={skjæringstidspunkt}
                />
            ) : (
                <ReadOnlyInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                    deaktivert={erDeaktivert}
                    lokaltMånedsbeløp={lokaltMånedsbeløp}
                    endret={endret}
                    inntektsendringer={inntektsendringer}
                    erGhostperiode={erGhostperiode}
                />
            )}
            {!editingInntekt && arbeidsforholdKanOverstyres && !harSykefravær && (
                <OverstyrArbeidsforholdUtenSykdom
                    organisasjonsnummerAktivPeriode={organisasjonsnummer}
                    skjæringstidspunkt={skjæringstidspunkt}
                    arbeidsforholdErDeaktivert={erDeaktivert}
                />
            )}
            {refusjon && refusjon.length !== 0 && !editingInntekt && (
                <Refusjonsoversikt refusjon={refusjon} lokaleRefusjonsopplysninger={lokaleRefusjonsopplysninger} />
            )}
            {inntektFraAOrdningen && !editingInntekt && harSykefravær && (
                <SisteTreMånedersInntekt inntektFraAOrdningen={inntektFraAOrdningen} />
            )}
        </div>
    );
};
