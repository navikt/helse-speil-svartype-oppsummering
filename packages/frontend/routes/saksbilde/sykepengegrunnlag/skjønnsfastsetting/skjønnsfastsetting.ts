import { useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import {
    OpprettAbonnementDocument,
    SkjonnsfastsettelseArbeidsgiverInput,
    SkjonnsfastsettelseInput,
    SkjonnsfastsettelseMutationDocument,
    SkjonnsfastsettelseType,
} from '@io/graphql';
import { SkjønnsfastsattArbeidsgiver, SkjønnsfastsattSykepengegrunnlagDTO, SkjønnsfastsettingstypeDTO } from '@io/http';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useAddToast, useRemoveToast } from '@state/toasts';

export interface BegrunnelseForSkjønnsfastsetting {
    id: string;
    valg: string;
    type: Skjønnsfastsettingstype;
}

export const skjønnsfastsettelseBegrunnelser = (): BegrunnelseForSkjønnsfastsetting[] => [
    {
        id: '0',
        valg: 'Skjønnsfastsette til omregnet årsinntekt ',
        type: Skjønnsfastsettingstype.OMREGNET_ÅRSINNTEKT,
    },
    {
        id: '1',
        valg: 'Skjønnsfastsette til rapportert årsinntekt ',
        type: Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT,
    },
    {
        id: '2',
        valg: 'Skjønnsfastsette til annet ',
        type: Skjønnsfastsettingstype.ANNET,
    },
];

export enum Skjønnsfastsettingstype {
    OMREGNET_ÅRSINNTEKT = 'OMREGNET_ÅRSINNTEKT',
    RAPPORTERT_ÅRSINNTEKT = 'RAPPORTERT_ÅRSINNTEKT',
    ANNET = 'ANNET',
}

export interface ArbeidsgiverForm {
    organisasjonsnummer: string;
    årlig: number;
}

export const usePostSkjønnsfastsattSykepengegrunnlag = (onFerdigKalkulert: () => void) => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const [calculating, setCalculating] = useState(false);
    const [timedOut, setTimedOut] = useState(false);

    const [overstyrMutation, { error, loading }] = useMutation(SkjonnsfastsettelseMutationDocument);
    const [opprettAbonnement] = useMutation(OpprettAbonnementDocument);

    useHåndterOpptegnelser((opptegnelse) => {
        if (erOpptegnelseForNyOppgave(opptegnelse) && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setCalculating(false);
            onFerdigKalkulert();
        }
    });

    useEffect(() => {
        const timeout: NodeJS.Timeout | number | null = calculating
            ? setTimeout(() => {
                  setTimedOut(true);
              }, 15000)
            : null;
        return () => {
            !!timeout && clearTimeout(timeout);
        };
    }, [calculating]);

    useEffect(() => {
        return () => {
            calculating && removeToast(kalkulererToastKey);
        };
    }, [calculating]);

    return {
        isLoading: loading || calculating,
        error: error && 'Kunne ikke skjønnsfastsette sykepengegrunnlaget. Prøv igjen senere.',
        timedOut,
        setTimedOut,
        postSkjønnsfastsetting: (skjønnsfastsattSykepengegrunnlag?: SkjønnsfastsattSykepengegrunnlagDTO) => {
            if (skjønnsfastsattSykepengegrunnlag === undefined) return;
            const skjønnsfastsettelse: SkjonnsfastsettelseInput = {
                aktorId: skjønnsfastsattSykepengegrunnlag.aktørId,
                arbeidsgivere: skjønnsfastsattSykepengegrunnlag.arbeidsgivere.map(
                    (arbeidsgiver: SkjønnsfastsattArbeidsgiver): SkjonnsfastsettelseArbeidsgiverInput => ({
                        arlig: arbeidsgiver.årlig,
                        arsak: arbeidsgiver.årsak,
                        lovhjemmel:
                            arbeidsgiver.lovhjemmel !== undefined
                                ? {
                                      bokstav: arbeidsgiver.lovhjemmel.bokstav,
                                      ledd: arbeidsgiver.lovhjemmel.ledd,
                                      paragraf: arbeidsgiver.lovhjemmel.paragraf,
                                      lovverk: arbeidsgiver.lovhjemmel.lovverk,
                                      lovverksversjon: arbeidsgiver.lovhjemmel.lovverksversjon,
                                  }
                                : undefined,
                        begrunnelseFritekst: arbeidsgiver.begrunnelseFritekst,
                        begrunnelseKonklusjon: arbeidsgiver.begrunnelseKonklusjon,
                        begrunnelseMal: arbeidsgiver.begrunnelseMal,
                        fraArlig: arbeidsgiver.fraÅrlig,
                        initierendeVedtaksperiodeId: arbeidsgiver.initierendeVedtaksperiodeId,
                        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                        type:
                            arbeidsgiver.type === SkjønnsfastsettingstypeDTO.OMREGNET_ÅRSINNTEKT
                                ? SkjonnsfastsettelseType.OmregnetArsinntekt
                                : arbeidsgiver.type === SkjønnsfastsettingstypeDTO.RAPPORTERT_ÅRSINNTEKT
                                  ? SkjonnsfastsettelseType.RapportertArsinntekt
                                  : SkjonnsfastsettelseType.Annet,
                    }),
                ),
                fodselsnummer: skjønnsfastsattSykepengegrunnlag.fødselsnummer,
                skjaringstidspunkt: skjønnsfastsattSykepengegrunnlag.skjæringstidspunkt,
            };

            void overstyrMutation({
                variables: { skjonnsfastsettelse: skjønnsfastsettelse },
                onCompleted: () => {
                    setCalculating(true);
                    addToast(kalkulererToast({}));
                    void opprettAbonnement({
                        variables: { personidentifikator: skjønnsfastsattSykepengegrunnlag.aktørId },
                        onCompleted: () => {
                            setPollingRate(1000);
                        },
                    });
                },
            });
        },
    };
};
