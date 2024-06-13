import React from 'react';

import { Endringstrekant } from '@components/Endringstrekant';
import { CellContent } from '@saksbilde/table/CellContent';
import { Utbetalingstabelldagtype } from '@typer/utbetalingstabell';
import { Maybe } from '@utils/ts';

import { Cell } from './Cell';
import { helgetyper } from './helgUtils';

const dagtypeIsValid = (type: Utbetalingstabelldagtype): boolean =>
    [...helgetyper, 'Arbeid', 'Ferie', 'Permisjon'].every((it) => it !== type);

interface TotalGradProps {
    type: Utbetalingstabelldagtype;
    erOverstyrt?: boolean;
    totalGradering?: Maybe<number>;
    erNyDag?: boolean;
}

export const TotalGradCell = ({ type, erOverstyrt, totalGradering, erNyDag = false }: TotalGradProps) => {
    const showTotalGradering = typeof totalGradering === 'number' && dagtypeIsValid(type);

    return (
        <Cell italic={erOverstyrt}>
            {erOverstyrt && !erNyDag && <Endringstrekant />}
            {showTotalGradering && <CellContent flexEnd>{`${Math.floor(totalGradering)} %`}</CellContent>}
        </Cell>
    );
};
