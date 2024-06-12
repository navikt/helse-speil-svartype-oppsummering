import { createMock, render, screen, waitFor, within } from '@test-utils';
import React from 'react';

import { AnnullerDocument, OpprettAbonnementDocument } from '@io/graphql';
import userEvent from '@testing-library/user-event';

import { Annulleringsmodal } from './Annulleringsmodal';

const defaultProps = {
    fødselsnummer: '12345678910',
    aktørId: '12345678910',
    organisasjonsnummer: '987654321',
    vedtaksperiodeId: 'EN-VEDTAKSPERIODEID',
    utbetalingId: 'EN-UTBETALINGID',
    skjæringstidspunkt: '2022-01-01',
    linjer: [{ fom: '2022-01-01', tom: '2022-01-31', totalbelop: 30000 }],
    onClose: () => null,
};

const createMocks = (annulerDone?: jest.Mock) => [
    createMock({
        request: {
            query: AnnullerDocument,
            variables: {
                annullering: {
                    aktorId: '12345678910',
                    fodselsnummer: '12345678910',
                    organisasjonsnummer: '987654321',
                    vedtaksperiodeId: 'EN-VEDTAKSPERIODEID',
                    utbetalingId: 'EN-UTBETALINGID',
                    begrunnelser: ['ferie'],
                    kommentar: undefined,
                },
            },
        },
        result: () => {
            annulerDone?.();
            return {
                data: {
                    annuller: true,
                },
            };
        },
    }),
    createMock({
        request: {
            query: OpprettAbonnementDocument,
            variables: {
                personidentifikator: '12345678910',
            },
        },
        result: {
            data: {
                __typename: 'Mutation',
                opprettAbonnement: true,
            },
        },
    }),
];

describe('Annulleringsmodal', () => {
    test('viser feilmelding ved manglende begrunnelse', async () => {
        render(<Annulleringsmodal {...defaultProps} />, {
            mocks: createMocks(),
        });

        await userEvent.click(screen.getByText('Annuller'));

        expect(await screen.findByText('Velg minst én begrunnelse')).toBeInTheDocument();
    });

    test('viser feilmelding ved manglende kommentar', async () => {
        render(<Annulleringsmodal {...defaultProps} />, { mocks: createMocks() });

        const kanIkkeRevurderesSection = within(
            screen.getByRole('group', {
                name: /hvorfor kunne ikke vedtaket revurderes\?/i,
            }),
        );
        await userEvent.click(kanIkkeRevurderesSection.getByRole('checkbox', { name: 'Annet' }));

        await userEvent.click(screen.getByRole('button', { name: 'Annuller' }));

        expect(screen.getByText('Skriv en kommentar hvis du velger begrunnelsen "annet"')).toBeInTheDocument();
    });

    test('gjør annulleringsmutation på annuller', async () => {
        const annulleringMutationDone = jest.fn();

        render(<Annulleringsmodal {...defaultProps} />, { mocks: createMocks(annulleringMutationDone) });

        await userEvent.click(screen.getByRole('checkbox', { name: 'Ferie' }));
        await userEvent.click(screen.getByRole('button', { name: 'Annuller' }));

        await waitFor(() => expect(annulleringMutationDone).toHaveBeenCalled());
    });
});