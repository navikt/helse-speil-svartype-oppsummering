import dayjs from 'dayjs';
import React from 'react';
import classNames from 'classnames';

import { BodyShort, Tag, Tooltip } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { LovdataLenke } from '@components/LovdataLenke';
import { Advarselikon } from '@components/ikoner/Advarselikon';
import { Maksdatoikon } from '@components/ikoner/Maksdatoikon';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { Oppgaveetikett } from '@components/Oppgaveetikett';
import { Skjæringstidspunktikon } from '@components/ikoner/Skjæringstidspunktikon';
import { Sykmeldingsperiodeikon } from '@components/ikoner/Sykmeldingsperiodeikon';
import { SkjæringstidspunktikonInvert } from '@components/ikoner/SkjæringstidspunktikonInvert';
import { BeregnetPeriode, Oppgavetype, Periodetilstand, Periodetype, UberegnetPeriode } from '@io/graphql';
import { NORSK_DATOFORMAT_KORT } from '@utils/date';
import { capitalize } from '@utils/locale';

import { CardTitle } from './CardTitle';

import styles from './PeriodeCard.module.css';

const getTextForPeriodetype = (type: Periodetype): string => {
    switch (type) {
        case Periodetype.Forlengelse:
        case Periodetype.Infotrygdforlengelse:
            return 'FORLENGELSE';
        case Periodetype.Forstegangsbehandling:
            return 'FØRSTEGANGSBEHANDLING';
        case Periodetype.OvergangFraIt:
            return 'FORLENGELSE IT';
    }
};

interface PeriodetypeRowProps {
    type: Periodetype | Oppgavetype;
    tilstand: Periodetilstand;
    label: string;
}

const PeriodetypeRow: React.FC<PeriodetypeRowProps> = ({ type, tilstand, label }) => {
    return (
        <>
            <Tooltip content={capitalize(label)}>
                <div className={styles.IconContainer}>
                    <Oppgaveetikett type={type} tilstand={tilstand} />
                </div>
            </Tooltip>
            <CardTitle className={styles.Title}>{label}</CardTitle>
        </>
    );
};

interface SykmeldingsperiodeRowProps {
    periode: DatePeriod;
}

const SykmeldingsperiodeRow: React.FC<SykmeldingsperiodeRowProps> = ({ periode }) => {
    const fom = dayjs(periode.fom).format(NORSK_DATOFORMAT_KORT);
    const tom = dayjs(periode.tom).format(NORSK_DATOFORMAT_KORT);

    return (
        <>
            <Tooltip content="Sykmeldingsperiode">
                <div className={styles.IconContainer}>
                    <Sykmeldingsperiodeikon alt="Sykmeldingsperiode" />
                </div>
            </Tooltip>
            <BodyShort>{`${fom} - ${tom}`}</BodyShort>
        </>
    );
};

interface SkjæringstidspunktRowProps {
    periodetype: Periodetype;
    skjæringstidspunkt: DateString;
}

const SkjæringstidspunktRow: React.VFC<SkjæringstidspunktRowProps> = ({ periodetype, skjæringstidspunkt }) => {
    if (periodetype === Periodetype.OvergangFraIt) {
        return (
            <>
                <Tooltip content="Skjæringstidspunkt">
                    <div className={styles.IconContainer}>
                        <SkjæringstidspunktikonInvert alt="Skjæringstidspunkt" />
                    </div>
                </Tooltip>
                <BodyShort>Skjæringstidspunkt i Infotrygd/Gosys</BodyShort>
            </>
        );
    } else {
        return (
            <>
                <Tooltip content="Skjæringstidspunkt">
                    <div className={styles.IconContainer}>
                        <Skjæringstidspunktikon alt="Skjæringstidspunkt" />
                    </div>
                </Tooltip>
                <BodyShort>{dayjs(skjæringstidspunkt).format(NORSK_DATOFORMAT_KORT)}</BodyShort>
            </>
        );
    }
};

const harRedusertAntallSykepengedager = (periode: BeregnetPeriode): boolean => {
    const { forbrukteSykedager, gjenstaendeSykedager } = periode.periodevilkar.sykepengedager;
    return (
        typeof forbrukteSykedager === 'number' &&
        typeof gjenstaendeSykedager === 'number' &&
        forbrukteSykedager + gjenstaendeSykedager < 248
    );
};

interface MaksdatoRowProps {
    activePeriod: BeregnetPeriode;
}

const MaksdatoRow: React.FC<MaksdatoRowProps> = ({ activePeriod }) => {
    const maksdato = dayjs(activePeriod.maksdato).format(NORSK_DATOFORMAT_KORT);
    const alderVedSisteSykedag = activePeriod.periodevilkar.alder.alderSisteSykedag ?? null;

    return (
        <>
            <Tooltip content="Maksdato">
                <div className={styles.IconContainer}>
                    <Maksdatoikon alt="Maksdato" />
                </div>
            </Tooltip>
            <Flex gap="10px">
                <BodyShort className={styles.NoWrap}>{`${maksdato} (${
                    activePeriod.gjenstaendeSykedager ?? 'Ukjent antall'
                } dager igjen)`}</BodyShort>
                {alderVedSisteSykedag &&
                    (alderVedSisteSykedag >= 70 ? (
                        <Flex alignItems="center" gap="8px">
                            <Tooltip content="Over 70 år">
                                <div className={styles.IconContainer}>
                                    <Advarselikon alt="Over 70 år" height={16} width={16} />
                                </div>
                            </Tooltip>
                            <BodyShort size="small">
                                <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                            </BodyShort>
                        </Flex>
                    ) : (
                        harRedusertAntallSykepengedager(activePeriod) && (
                            <Flex alignItems="center">
                                <Tooltip content="Over 67 år - redusert antall sykepengedager">
                                    <Tag className={styles.Tag} variant="info" size="small">
                                        Over 67 år
                                    </Tag>
                                </Tooltip>
                            </Flex>
                        )
                    ))}
            </Flex>
        </>
    );
};

interface PeriodeCardUberegnetProps {
    periode: UberegnetPeriode;
}

const PeriodeCardUberegnet: React.FC<PeriodeCardUberegnetProps> = ({ periode }) => {
    return (
        <section>
            <div className={styles.Grid}>
                <PeriodetypeRow
                    type={periode.periodetype}
                    tilstand={periode.periodetilstand}
                    label={getTextForPeriodetype(periode.periodetype)}
                />
                <SykmeldingsperiodeRow periode={periode} />
                <SkjæringstidspunktRow
                    periodetype={periode.periodetype}
                    skjæringstidspunkt={periode.skjaeringstidspunkt}
                />
            </div>
        </section>
    );
};

interface PeriodeCardBeregnetProps {
    periode: BeregnetPeriode;
}

const PeriodeCardBeregnet: React.FC<PeriodeCardBeregnetProps> = ({ periode }) => {
    const type = periode.utbetaling.type === 'REVURDERING' ? Oppgavetype.Revurdering : periode.periodetype;
    const label = `${getTextForPeriodetype(periode.periodetype)} ${
        periode.erReturOppgave ? '(RETUR)' : periode.erBeslutterOppgave ? '(BESLUTTER)' : ''
    }`;

    return (
        <section className={styles.Grid}>
            <PeriodetypeRow type={type} tilstand={periode.periodetilstand} label={label} />
            <SykmeldingsperiodeRow periode={periode} />
            <SkjæringstidspunktRow periodetype={periode.periodetype} skjæringstidspunkt={periode.skjaeringstidspunkt} />
            <MaksdatoRow activePeriod={periode} />
        </section>
    );
};

const PeriodeCardSkeleton: React.FC = () => {
    return (
        <section className={classNames(styles.Skeleton, styles.Grid)}>
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
        </section>
    );
};

export const PeriodeCard = {
    Beregnet: PeriodeCardBeregnet,
    Uberegnet: PeriodeCardUberegnet,
    Skeleton: PeriodeCardSkeleton,
};
