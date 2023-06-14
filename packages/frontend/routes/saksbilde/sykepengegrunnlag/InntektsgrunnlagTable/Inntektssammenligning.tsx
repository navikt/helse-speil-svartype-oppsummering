import classNames from 'classnames';
import React from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort, Tooltip } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Errorikon } from '@components/ikoner/Errorikon';
import { Inntektskilde, OmregnetArsinntekt, Overstyring, Sammenligningsgrunnlag } from '@io/graphql';
import { useArbeidsgiver, useEndringerForPeriode } from '@state/arbeidsgiver';
import { erUtvikling } from '@utils/featureToggles';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';

import { EndringsloggButton } from '../inntekt/EndringsloggButton';
import { TableCell } from './TableCell';

import styles from './Inntektssammenligning.module.css';

interface InntektssammenligningProps {
    organisasjonsnummer: string;
    omregnetÅrsinntekt?: Maybe<OmregnetArsinntekt>;
    sammenligningsgrunnlag?: Maybe<Sammenligningsgrunnlag>;
    arbeidsforholdErDeaktivert?: Maybe<boolean>;
    erGjeldende: boolean;
    onSetAktivInntektskilde: () => void;
}

export const Inntektssammenligning = ({
    organisasjonsnummer,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    arbeidsforholdErDeaktivert,
    erGjeldende,
    onSetAktivInntektskilde,
}: InntektssammenligningProps) => {
    const arbeidsgivernavn = useArbeidsgiver(organisasjonsnummer)?.navn;
    const { inntektsendringer, arbeidsforholdendringer } = useEndringerForPeriode(organisasjonsnummer);

    return (
        <tr
            className={classNames(styles.arbeidsgiverRow, { [styles.erGjeldende]: erGjeldende })}
            onClick={onSetAktivInntektskilde}
        >
            <td>
                <span className={styles.arbeidsgiverCell}>
                    <Tooltip content="Arbeidsgiver">
                        <span>
                            {arbeidsforholdErDeaktivert ? (
                                <Errorikon className={styles.errorIcon} alt="Rød sirkel med kryss" />
                            ) : (
                                <Arbeidsgiverikon className={styles.bagIcon} alt="Arbeidsgiver" />
                            )}
                        </span>
                    </Tooltip>
                    <AnonymizableText
                        className={classNames(styles.arbeidsgivernavn, {
                            [styles.arbeidsgivernavnDeaktivert]: !!arbeidsforholdErDeaktivert,
                        })}
                    >
                        {arbeidsgivernavn}
                    </AnonymizableText>
                </span>
            </td>
            <TableCell
                content={
                    <OmregnetÅrsinntektContent
                        arbeidsforholdErDeaktivert={arbeidsforholdErDeaktivert}
                        beløp={omregnetÅrsinntekt?.belop}
                    />
                }
                ikon={
                    <OmregnetÅrsinntektIkon
                        endringer={[...inntektsendringer, ...arbeidsforholdendringer]}
                        arbeidsforholdErDeaktivert={arbeidsforholdErDeaktivert}
                        kilde={omregnetÅrsinntekt?.kilde}
                    />
                }
            />
            <TableCell
                content={<BodyShort>{somPenger(sammenligningsgrunnlag?.belop)}</BodyShort>}
                ikon={<Kilde type={Inntektskilde.Aordningen}>AO</Kilde>}
            />
            {erUtvikling() && (
                <TableCell
                    content={
                        <SkjønnsfastsettingContent
                            arbeidsforholdErDeaktivert={arbeidsforholdErDeaktivert}
                            kilde={omregnetÅrsinntekt?.kilde}
                            beløp={omregnetÅrsinntekt?.belop}
                        />
                    }
                    ikon={<SkjønnsfastsettingIkon kilde={omregnetÅrsinntekt?.kilde} />}
                />
            )}
            <td className={styles.sisteTableCell} />
        </tr>
    );
};

interface OmregnetÅrsinntektContentProps {
    arbeidsforholdErDeaktivert?: Maybe<boolean>;
    beløp?: number;
}

const OmregnetÅrsinntektContent = ({ arbeidsforholdErDeaktivert, beløp }: OmregnetÅrsinntektContentProps) => (
    <BodyShort>{!arbeidsforholdErDeaktivert && beløp ? somPenger(beløp) : '-'}</BodyShort>
);

interface OmregnetÅrsinntektIkonProps {
    arbeidsforholdErDeaktivert?: Maybe<boolean>;
    endringer: Array<Overstyring>;
    kilde?: Inntektskilde;
}

const OmregnetÅrsinntektIkon = ({ arbeidsforholdErDeaktivert, endringer, kilde }: OmregnetÅrsinntektIkonProps) =>
    kilde === Inntektskilde.Saksbehandler || arbeidsforholdErDeaktivert ? (
        <EndringsloggButton endringer={endringer as Array<Overstyring>} />
    ) : (
        kilde && <Kilde type={kilde}>{kildeForkortelse(kilde)}</Kilde>
    );

interface SkjønnsfastsettingContentProps {
    arbeidsforholdErDeaktivert?: Maybe<boolean>;
    kilde?: Inntektskilde;
    beløp?: number;
}

const SkjønnsfastsettingContent = ({ arbeidsforholdErDeaktivert, kilde, beløp }: SkjønnsfastsettingContentProps) => (
    <BodyShort>
        {!arbeidsforholdErDeaktivert && kilde === Inntektskilde.SkjonnsmessigFastsatt ? somPenger(beløp) : '-'}
    </BodyShort>
);

interface SkjønnsfastsettingIkonProps {
    kilde?: Inntektskilde;
}

const SkjønnsfastsettingIkon = ({ kilde }: SkjønnsfastsettingIkonProps) =>
    kilde === Inntektskilde.SkjonnsmessigFastsatt && (
        <Kilde type={kilde}>
            <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
        </Kilde>
    );
