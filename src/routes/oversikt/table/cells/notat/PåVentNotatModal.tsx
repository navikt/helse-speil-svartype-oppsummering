import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { ReactElement, useRef } from 'react';
import { Control, FieldValues, FormProvider, SubmitHandler, useController, useForm } from 'react-hook-form';

import { Button, Checkbox, Heading, Loader, Modal, Textarea } from '@navikt/ds-react';

import { ApolloError } from '@apollo/client';
import { ErrorMessage } from '@components/ErrorMessage';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Maybe, NotatType, Personnavn, Tildeling } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useNotaterForVedtaksperiode } from '@state/notater';
import { useLeggPåVent } from '@state/påvent';
import { useOperationErrorHandler } from '@state/varsler';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { getFormatertNavn } from '@utils/string';

import { Frist } from './Frist';
import { SisteNotat } from './SisteNotat';

import styles from './PåVentNotatModal.module.css';

interface PåVentNotatModalProps {
    setVisModal: (visModal: boolean) => void;
    visModal: boolean;
    navn: Personnavn;
    vedtaksperiodeId: string;
    oppgaveId: string;
    tildeling: Maybe<Tildeling>;
}

export const PåVentNotatModal = ({
    setVisModal,
    visModal,
    navn,
    vedtaksperiodeId,
    oppgaveId,
    tildeling,
}: PåVentNotatModalProps): ReactElement => {
    const notaterForOppgave = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const søkernavn = navn ? getFormatertNavn(navn, ['E', ',', 'F', 'M']) : undefined;
    const [leggPåVentMedNotat, { loading, error: leggPåVentError }] = useLeggPåVent();
    const errorHandler = useOperationErrorHandler('Legg på vent');
    const router = useRouter();
    const saksbehandler = useInnloggetSaksbehandler();
    const form = useForm();
    const ref = useRef<HTMLDialogElement>(null);

    const { onChange, ...tildelingValidation } = form.register('tildeling');

    const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event);
    };

    const erTildeltSaksbehandler = tildeling && tildeling.oid === saksbehandler.oid;

    const sisteNotat = [...notaterForOppgave]
        .filter((it) => !it.feilregistrert && it.type === NotatType.PaaVent)
        .sort((a, b) => b.opprettet.diff(a.opprettet, 'millisecond'))
        .shift();

    const submit: SubmitHandler<FieldValues> = async (fieldValues) => {
        await settPåVent(fieldValues.tekst, fieldValues.frist, fieldValues.tildeling, fieldValues.begrunnelse);
        ref.current?.close();
    };

    const settPåVent = async (notattekst: string, frist: string, tildeling: boolean, begrunnelse?: Maybe<string>) => {
        const fristVerdi = dayjs(frist, NORSK_DATOFORMAT).format(ISO_DATOFORMAT);
        const begrunnelseVerdi = begrunnelse ?? null;

        await leggPåVentMedNotat(oppgaveId, fristVerdi, tildeling, begrunnelseVerdi, notattekst, vedtaksperiodeId);
        if (leggPåVentError) {
            errorHandler(leggPåVentError);
        } else {
            router.push('/');
        }
    };

    const tillattTekstlengde = 1_000;
    const errorMessage: string | undefined =
        leggPåVentError !== undefined
            ? apolloErrorCode(leggPåVentError) === 401
                ? 'Du har blitt logget ut'
                : 'Notatet kunne ikke lagres'
            : undefined;

    return (
        <Modal
            ref={ref}
            aria-label="Legg på vent modal"
            portal
            closeOnBackdropClick
            open={visModal}
            onClose={() => setVisModal(false)}
        >
            <Modal.Header>
                <Heading level="1" size="medium" className={styles.tittel}>
                    Legg på vent
                </Heading>
                {søkernavn && <AnonymizableText size="small">{`Søker: ${søkernavn}`}</AnonymizableText>}
            </Modal.Header>
            <Modal.Body className={styles.container}>
                {sisteNotat && <SisteNotat notat={sisteNotat} />}
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(submit)} id="skjema">
                        <ControlledTextarea control={form.control} tillattTekstlengde={tillattTekstlengde} />
                        <Frist />
                        <Checkbox
                            defaultChecked
                            onChange={onCheck}
                            {...tildelingValidation}
                            className={styles.tildeling}
                        >
                            {erTildeltSaksbehandler ? 'Behold tildeling' : 'Tildel meg'}
                        </Checkbox>
                    </form>
                </FormProvider>
            </Modal.Body>
            <Modal.Footer>
                <Button size="small" form="skjema" disabled={loading}>
                    Legg på vent
                    {loading && <Loader size="xsmall" />}
                </Button>
                <Button size="small" variant="secondary" onClick={() => ref.current?.close()} type="button">
                    Avbryt
                </Button>
                {errorMessage && <ErrorMessage className={styles.error}>{errorMessage}</ErrorMessage>}
            </Modal.Footer>
        </Modal>
    );
};

interface ControlledTextareaProps {
    control: Control;
    tillattTekstlengde: number;
}

const ControlledTextarea = ({ control, tillattTekstlengde }: ControlledTextareaProps): ReactElement => {
    const { field, fieldState } = useController({
        control: control,
        name: 'tekst',
        rules: {
            required: 'Notat må fylles ut',
            maxLength: {
                value: tillattTekstlengde,
                message: `Det er kun tillatt med ${tillattTekstlengde} tegn`,
            },
        },
    });
    return (
        <Textarea
            {...field}
            className={styles.textarea}
            error={fieldState.error?.message}
            label="Legg på vent"
            description={
                'Skriv hvorfor saken er lagt på vent. Det gjør det lettere å starte igjen senere.\n' +
                'Eks: Kontaktet arbeidsgiver, fikk ikke svar. Prøv igjen senere.\n' +
                'Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn.'
            }
            maxLength={tillattTekstlengde}
            autoFocus
        />
    );
};

const apolloErrorCode = (error: ApolloError | undefined): number =>
    (
        error?.graphQLErrors[0].extensions['code'] as {
            value: number;
        }
    ).value;
