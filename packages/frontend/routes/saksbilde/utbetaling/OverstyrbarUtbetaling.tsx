import classNames from 'classnames';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { BodyShort } from '@navikt/ds-react';

import { OverstyringTimeoutModal } from '@components/OverstyringTimeoutModal';
import { useMap } from '@hooks/useMap';

import { EndringForm } from './utbetalingstabell/EndringForm/EndringForm';
import { LeggTilDager } from './utbetalingstabell/LeggTilDager';
import { MarkerAlleDagerCheckbox } from './utbetalingstabell/MarkerAlleDagerCheckbox';
import { OverstyringForm } from './utbetalingstabell/OverstyringForm';
import { RadmarkeringCheckbox } from './utbetalingstabell/RadmarkeringCheckbox';
import { UtbetalingHeader } from './utbetalingstabell/UtbetalingHeader';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { usePostOverstyring } from './utbetalingstabell/usePostOverstyring';

import styles from './OverstyrbarUtbetaling.module.css';

dayjs.extend(isBetween);

const getKey = (dag: UtbetalingstabellDag) => dag.dato;

const erReellEndring = (endring: Partial<UtbetalingstabellDag>, dag: UtbetalingstabellDag): boolean =>
    (typeof endring.grad === 'number' && endring.grad !== dag.grad) ||
    (typeof endring.type === 'string' && endring.type !== dag.type);

interface OverstyrbarUtbetalingProps {
    fom: DateString;
    tom: DateString;
    dager: Map<string, UtbetalingstabellDag>;
    erForkastet: boolean;
    revurderingIsEnabled: boolean;
    overstyrRevurderingIsEnabled: boolean;
}

export const OverstyrbarUtbetaling: React.FC<OverstyrbarUtbetalingProps> = ({
    fom,
    tom,
    dager,
    erForkastet,
    revurderingIsEnabled,
    overstyrRevurderingIsEnabled,
}) => {
    const form = useForm({ mode: 'onBlur', shouldFocusError: false });

    const [overstyrer, setOverstyrer] = useState(false);
    const { postOverstyring, error, state } = usePostOverstyring();

    const [markerteDager, setMarkerteDager] = useMap<string, UtbetalingstabellDag>();
    const [overstyrteDager, setOverstyrteDager] = useMap<string, UtbetalingstabellDag>();
    const [nyeDager, setNyeDager] = useMap<string, UtbetalingstabellDag>();

    const alleDager = new Map<string, UtbetalingstabellDag>([...nyeDager, ...dager]);
    const alleOverstyrteDager = new Map<string, UtbetalingstabellDag>([...nyeDager, ...overstyrteDager]);

    const toggleOverstyring = () => {
        setMarkerteDager(new Map());
        setOverstyrteDager(new Map());
        setNyeDager(new Map());
        setOverstyrer(!overstyrer);
    };

    const onSubmitOverstyring = () => {
        postOverstyring(
            Array.from(alleDager.values()),
            Array.from(alleOverstyrteDager.values()),
            form.getValues('begrunnelse'),
            () => setOverstyrer(!overstyrer),
        );
    };

    const toggleChecked = (dag: UtbetalingstabellDag) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if ((event.nativeEvent as KeyboardEvent)?.shiftKey) {
            toggleCheckedShift(dag)(event);
            return;
        }

        if (event.target.checked) {
            setMarkerteDager(markerteDager.set(getKey(dag), dag));
        } else {
            markerteDager.delete(getKey(dag));
            setMarkerteDager(markerteDager);
        }
    };

    const toggleCheckedShift = (dag: UtbetalingstabellDag) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const forrigeValgteDag = Array.from(markerteDager.values())?.pop() ?? dag;
        Array.from(alleDager.values())
            .filter((it) => dayjs(it.dato).isBetween(forrigeValgteDag.dato, dag.dato, 'day', '[]'))
            .forEach((it) => {
                if (event.target.checked) {
                    setMarkerteDager(markerteDager.set(getKey(it), it));
                } else {
                    markerteDager.delete(getKey(it));
                    setMarkerteDager(markerteDager);
                }
            });
    };

    const onSubmitEndring = (endring: Partial<UtbetalingstabellDag>) => {
        const newOverstyrteDager = Array.from(markerteDager.values()).reduce(
            (map: Map<string, UtbetalingstabellDag>, dag: UtbetalingstabellDag) => {
                if (erReellEndring(endring, dag)) {
                    map.set(getKey(dag), { ...dag, ...endring });
                } else {
                    map.delete(getKey(dag));
                }
                return map;
            },
            new Map(overstyrteDager),
        );
        setOverstyrteDager(newOverstyrteDager);
        setMarkerteDager(new Map());
    };

    const onSubmitPølsestrekk = (dagerLagtTil: Map<string, UtbetalingstabellDag>) => {
        const alleNyeDager = new Map<string, UtbetalingstabellDag>([...dagerLagtTil, ...nyeDager]);
        setNyeDager(alleNyeDager);
    };

    const slettSisteNyeDag = () => {
        const tempNyeDager = Array.from(nyeDager).slice(1);
        setNyeDager(new Map(tempNyeDager));
    };

    useEffect(() => {
        if (state === 'done') {
            setOverstyrteDager(new Map());
            setNyeDager(new Map());
        }
    }, [state]);

    return (
        <div
            className={classNames(styles.OverstyrbarUtbetaling, overstyrer && styles.overstyrer)}
            data-testid="utbetaling"
        >
            <UtbetalingHeader
                periodeErForkastet={erForkastet}
                toggleOverstyring={toggleOverstyring}
                overstyrer={overstyrer}
                dager={dager}
                revurderingIsEnabled={revurderingIsEnabled}
                overstyrRevurderingIsEnabled={overstyrRevurderingIsEnabled}
            />
            {overstyrer && (
                <LeggTilDager
                    periodeFom={Array.from(alleDager.values())[0].dato}
                    onSubmitPølsestrekk={onSubmitPølsestrekk}
                />
            )}
            <div className={classNames(styles.TableContainer)}>
                <Utbetalingstabell
                    fom={fom}
                    tom={tom}
                    dager={alleDager}
                    lokaleOverstyringer={alleOverstyrteDager}
                    markerteDager={markerteDager}
                    overstyrer={overstyrer}
                    slettSisteNyeDag={slettSisteNyeDag}
                />
                {overstyrer && (
                    <>
                        <div className={styles.CheckboxContainer}>
                            <MarkerAlleDagerCheckbox
                                alleDager={alleDager}
                                markerteDager={markerteDager}
                                setMarkerteDager={setMarkerteDager}
                            />
                            {Array.from(alleDager.values()).map((dag, i) => (
                                <RadmarkeringCheckbox
                                    key={i}
                                    index={i}
                                    erForeldet={dag.erForeldet}
                                    onChange={toggleChecked(dag)}
                                    checked={markerteDager.get(dag.dato) !== undefined}
                                />
                            ))}
                        </div>
                        <EndringForm markerteDager={markerteDager} onSubmitEndring={onSubmitEndring} />
                        <FormProvider {...form}>
                            <form onSubmit={(event) => event.preventDefault()}>
                                <OverstyringForm
                                    overstyrteDager={alleOverstyrteDager}
                                    snute={Array.from(alleDager.values())[0].dato}
                                    hale={Array.from(alleDager.values())?.pop()?.dato ?? ''}
                                    toggleOverstyring={toggleOverstyring}
                                    onSubmit={onSubmitOverstyring}
                                />
                            </form>
                        </FormProvider>
                    </>
                )}
            </div>
            {state === 'timedOut' && <OverstyringTimeoutModal onRequestClose={() => null} />}
            {state === 'hasError' && error && (
                <BodyShort className={styles.ErrorMessage} role="alert">
                    {error}
                </BodyShort>
            )}
        </div>
    );
};
