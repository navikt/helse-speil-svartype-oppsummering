import dayjs, { Dayjs } from 'dayjs';
import { SpleisSykdomsdagkildeType, SpleisSykdomsdagtype, SpleisUtbetalingsdagtype } from 'external-types';

export const umappetUtbetalingshistorikk = (
    beregningId: string = 'id1',
    erRevurdering: Boolean = true,
    dag: Dayjs = dayjs('2018-01-01')
) => ({
    beregningId: beregningId,
    hendelsetidslinje: [
        {
            dagen: dag.format('YYYY-MM-DD'),
            type: SpleisSykdomsdagtype.SYKEDAG,
            kilde: {
                type: SpleisSykdomsdagkildeType.SAKSBEHANDLER,
                kildeId: 'eed4d4f5-b629-4986-82db-391336f861e9',
            },
            grad: 100.0,
        },
    ],
    beregnettidslinje: [
        {
            dagen: dag.format('YYYY-MM-DD'),
            type: SpleisSykdomsdagtype.SYKEDAG,
            kilde: {
                type: SpleisSykdomsdagkildeType.SAKSBEHANDLER,
                kildeId: 'eed4d4f5-b629-4986-82db-391336f861e9',
            },
            grad: 100.0,
        },
    ],
    utbetalinger: [
        {
            status: 'IKKE_UTBETALT',
            utbetalingstidslinje: [
                {
                    type: SpleisUtbetalingsdagtype.NAVDAG,
                    inntekt: 1431,
                    dato: dag.format('YYYY-MM-DD'),
                },
            ],
            maksdato: dag.add(2, 'month').format('YYYY-MM-DD'),
            type: erRevurdering ? 'REVURDERING' : 'UTBETALING',
        },
    ],
});
