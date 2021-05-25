import styled from '@emotion/styled';
import React from 'react';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { somPenger } from '../../../utils/locale';

interface Props {
    avvik?: number;
    totalOmregnetÅrsinntekt?: number;
    totalRapportertÅrsinntekt?: number;
}

const Sammenligning = styled.div`
    grid-column-end: 3;
    display: grid;
    grid-template-columns: 13rem max-content;
    margin-bottom: 2rem;
    grid-column-gap: 2rem;
    grid-row-gap: 0.5rem;
`;

const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid var(--navds-color-text-primary);
    grid-column-start: 1;
    grid-column-end: 3;
    margin: 0.25rem 0;
`;

const Avvikssammenligning = ({ avvik, totalOmregnetÅrsinntekt, totalRapportertÅrsinntekt }: Props) => {
    return (
        <Sammenligning>
            <Normaltekst>Total omregnet årsinntekt</Normaltekst>
            <Normaltekst>{somPenger(totalOmregnetÅrsinntekt)}</Normaltekst>
            <Normaltekst>Total rapportert årsinntekt</Normaltekst>
            <Normaltekst>{somPenger(totalRapportertÅrsinntekt)}</Normaltekst>
            <Divider />
            <Element>Utregnet avvik</Element>
            <Element>{avvik ? `${Math.floor(avvik)} %` : '-'}</Element>
        </Sammenligning>
    );
};

export default Avvikssammenligning;
