import React from 'react';

import { Table } from '@navikt/ds-react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { IkkeTildelt } from './IkkeTildelt';
import { Tildelt } from './Tildelt';

interface TildelingProps {
    oppgave: OppgaveForOversiktsvisning;
    kanTildeles: boolean;
}

export const TildelingCell = ({ oppgave, kanTildeles }: TildelingProps) => (
    <Table.DataCell onClick={(event) => event.stopPropagation()}>
        {kanTildeles &&
            (oppgave.tildeling ? (
                <Tildelt width={128} name={oppgave.tildeling.navn} />
            ) : (
                <IkkeTildelt width={128} oppgavereferanse={oppgave.id} />
            ))}
    </Table.DataCell>
);