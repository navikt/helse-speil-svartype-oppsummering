import React from 'react';

import { Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Personinfo } from '@io/graphql';
import { capitalizeName } from '@utils/locale';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

type Name = Pick<Personinfo, 'fornavn' | 'etternavn' | 'mellomnavn'>;

const getFormattedName = (name: Name): string => {
    const { fornavn, mellomnavn, etternavn } = name;
    return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''}`);
};

interface SøkerProps {
    name: Name;
}

export const SøkerCell = React.memo(({ name }: SøkerProps) => {
    const formatertNavn = getFormattedName(name);

    return (
        <Cell>
            <Tooltip content={formatertNavn}>
                <CellContent width={128}>
                    <AnonymizableTextWithEllipsis>{formatertNavn}</AnonymizableTextWithEllipsis>
                </CellContent>
            </Tooltip>
        </Cell>
    );
});
