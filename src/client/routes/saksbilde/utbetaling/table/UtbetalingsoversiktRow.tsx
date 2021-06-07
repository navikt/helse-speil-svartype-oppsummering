import { Sykdomsdag, Utbetalingsdag } from 'internal-types';
import React from 'react';

import { DateCell } from './DateCell';
import { GjenståendeDagerCell } from './GjenståendeDagerCell';
import { GradCell } from './GradCell';
import { MerknaderCell } from './MerknaderCell';
import { Row } from './Row';
import { StatusCell } from './StatusCell';
import { TotalGradCell } from './TotalGradCell';
import { UtbetalingCell } from './UtbetalingCell';
import { UtbetalingsdagCell } from './UtbetalingsdagCell';

interface UtbetalingsoversiktRowProps {
    utbetalingsdag: Utbetalingsdag;
    sykdomsdag: Sykdomsdag;
    isMaksdato: boolean;
    gjenståendeDager?: number;
}

export const UtbetalingsoversiktRow = ({
    utbetalingsdag,
    sykdomsdag,
    isMaksdato,
    gjenståendeDager,
}: UtbetalingsoversiktRowProps) => (
    <Row type={utbetalingsdag.type}>
        <StatusCell />
        <DateCell date={utbetalingsdag.dato} />
        <UtbetalingsdagCell typeUtbetalingsdag={utbetalingsdag.type} typeSykdomsdag={sykdomsdag.type} />
        <GradCell type={utbetalingsdag.type} grad={utbetalingsdag.gradering} />
        <TotalGradCell type={utbetalingsdag.type} totalGradering={utbetalingsdag.totalGradering} />
        <UtbetalingCell utbetaling={utbetalingsdag.utbetaling} />
        <GjenståendeDagerCell gjenståendeDager={gjenståendeDager} />
        <MerknaderCell style={{ width: '100%' }} dag={utbetalingsdag} isMaksdato={isMaksdato} />
    </Row>
);
