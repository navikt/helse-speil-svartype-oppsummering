import React from 'react';

import '@navikt/helse-frontend-logg/lib/main.css';

import { Flex } from '../../../components/Flex';

import { LoggHeader } from '../Saksbilde';
import { Sakslinje } from '../sakslinje/Sakslinje';

export const TomtSaksbilde = () => (
    <Flex justifyContent="space-between" data-testid="tomt-saksbilde">
        <Sakslinje aktivVedtaksperiode={false} />
        <LoggHeader />
    </Flex>
);
