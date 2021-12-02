import styled from '@emotion/styled';
import React from 'react';

import { Bag, People } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';
import { somPenger } from '../../../utils/locale';

const Container = styled.div`
    display: grid;
    margin-top: 2rem;
    margin-bottom: 1rem;
    align-items: center;
    grid-template-columns: 2.5rem auto auto;
    grid-gap: 0.25rem;
    grid-template-areas:
        'title title total'
        'arbeidsgiverIcon arbeidsgiverName arbeidsgiverSum'
        'personIcon personName personSum';
`;

const Title = styled(BodyShort)`
    font-weight: 600;
    grid-area: title;
`;

const Total = styled(BodyShort)`
    font-weight: 600;
    grid-area: total;
    justify-self: flex-end;
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
`;

const ArbeidsgiverIcon = styled(IconContainer)`
    grid-area: arbeidsgiverIcon;
    justify-self: flex-end;
`;

const PersonIcon = styled(IconContainer)`
    grid-area: personIcon;
    justify-self: flex-end;
`;

const ArbeidsgiverName = styled.div`
    grid-area: arbeidsgiverName;
    max-width: 150px;
`;

const PersonName = styled.div`
    grid-area: personName;
    max-width: 150px;
`;

const ArbeidsgiverSum = styled(BodyShort)`
    grid-area: arbeidsgiverSum;
    justify-self: flex-end;
`;

const PersonSum = styled(BodyShort)`
    grid-area: personSum;
    justify-self: flex-end;
`;

interface BeløpTilUtbetalingProps {
    erUtbetalt: boolean;
    personNettobeløp: number;
    arbeidsgiverNettobeløp: number;
    arbeidsgivernavn: string;
    personnavn: string;
}

export const Utbetalingssum = ({
    erUtbetalt,
    personNettobeløp,
    arbeidsgiverNettobeløp,
    arbeidsgivernavn,
    personnavn,
}: BeløpTilUtbetalingProps) => (
    <Container>
        <Title as="p">{erUtbetalt ? 'Utbetalt beløp' : 'Beløp til utbetaling'}</Title>
        <Total as="p">{somPenger(arbeidsgiverNettobeløp + personNettobeløp)}</Total>
        <ArbeidsgiverIcon>
            <Bag data-tip="Arbeidsgiver" title="Arbeidsgiver" />
        </ArbeidsgiverIcon>
        <ArbeidsgiverName>
            <TekstMedEllipsis>{arbeidsgivernavn}</TekstMedEllipsis>
        </ArbeidsgiverName>
        <ArbeidsgiverSum as="p">{somPenger(arbeidsgiverNettobeløp)}</ArbeidsgiverSum>
        <PersonIcon>
            <People data-tip="Arbeidstaker" title="Arbeidstaker" />
        </PersonIcon>
        <PersonName>
            <TekstMedEllipsis>{personnavn}</TekstMedEllipsis>
        </PersonName>
        <PersonSum as="p">{somPenger(personNettobeløp)}</PersonSum>
    </Container>
);