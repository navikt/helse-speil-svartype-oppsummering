import React from 'react';
import styled from '@emotion/styled';
import { Advarselikon } from '../ikoner/Advarselikon';
import { Normaltekst } from 'nav-frontend-typografi';

const Advarsel = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 2rem;

    p {
        max-width: 31.25rem;
        font-weight: 600;
    }

    > svg {
        margin-right: 1rem;
    }
`;

export const Annulleringsvarsel = () => (
    <Advarsel>
        <Advarselikon />
        <Normaltekst>
            Hvis du annullerer vil utbetalinger fjernes fra oppdragssystemet og du må behandle saken i Infotrygd.
        </Normaltekst>
    </Advarsel>
);
