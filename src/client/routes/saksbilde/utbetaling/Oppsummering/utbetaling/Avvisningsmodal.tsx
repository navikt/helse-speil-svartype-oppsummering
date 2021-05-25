import styled from '@emotion/styled';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Knapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';

import { Modal } from '../../../../../components/Modal';

import { Begrunnelsesskjema } from './Begrunnelsesskjema';
import { Avvisningsskjema, Begrunnelse, Årsak } from './Utbetalingsdialog';

const OkKnapp = styled(Knapp)`
    margin-top: 2rem;
    width: max-content;
    margin-right: 1rem;
`;

const AvbrytKnapp = styled(Knapp)`
    margin-top: 2rem;
    width: max-content;
`;

const StyledModal = styled(Modal)`
    padding: 2.25rem 4.25rem;
`;

interface Props {
    isSending: boolean;
    onApprove: (skjema: Avvisningsskjema) => void;
    onClose: () => void;
}

export const Avvisningsmodal = ({ isSending, onApprove, onClose }: Props) => {
    const form = useForm();
    const kommentar = form.watch('kommentar');
    const begrunnelser = form.watch(`begrunnelser`);
    const annenBegrunnelse = begrunnelser?.includes(Begrunnelse.Annet) ?? false;

    const harMinstÉnBegrunnelse = () => begrunnelser?.length > 0 ?? false;

    const submit = () => {
        if (annenBegrunnelse && !kommentar) {
            form.setError('kommentar', {
                type: 'manual',
                message: 'Skriv en kommentar hvis du velger begrunnelsen annet',
            });
        } else if (!harMinstÉnBegrunnelse()) {
            form.setError('begrunnelser', {
                type: 'manual',
                message: 'Velg minst én begrunnelse',
            });
        } else {
            const { begrunnelser, kommentar } = form.getValues();
            onApprove({
                årsak: Årsak.Feil,
                begrunnelser: begrunnelser,
                kommentar: kommentar,
            });
        }
    };

    return (
        <StyledModal
            isOpen
            title={<Systemtittel>Ikke utbetal</Systemtittel>}
            contentLabel="Avvis utbetaling"
            onRequestClose={onClose}
        >
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(submit)}>
                    <Begrunnelsesskjema />
                    <div>
                        <OkKnapp spinner={isSending} type="standard">
                            Avslutt saken
                        </OkKnapp>
                        <AvbrytKnapp htmlType="button" onClick={onClose} type="flat">
                            Avbryt
                        </AvbrytKnapp>
                    </div>
                </form>
            </FormProvider>
        </StyledModal>
    );
};
