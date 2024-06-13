import React from 'react';

import { Endringstrekant } from '@components/Endringstrekant';
import { CellContent } from '@saksbilde/table/CellContent';
import { somPenger } from '@utils/locale';
import { Maybe } from '@utils/ts';

import { Cell } from './Cell';

interface UtbetalingCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    erOverstyrt?: boolean;
    utbetaling?: Maybe<number>;
    erNyDag?: boolean;
}

export const UtbetalingCell = ({ erOverstyrt, utbetaling, erNyDag = false, style }: UtbetalingCellProps) => (
    <Cell italic={erOverstyrt} style={style}>
        {erOverstyrt && !erNyDag && <Endringstrekant />}
        <CellContent flexEnd>{utbetaling ? somPenger(utbetaling) : '-'}</CellContent>
    </Cell>
);
