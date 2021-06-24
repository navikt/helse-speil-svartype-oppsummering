import styled from '@emotion/styled';
import { Dag, Dagtype, OverstyrtDag, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import React, { ChangeEvent, useState } from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Select } from '../../../../components/Select';

import { overstyrPermisjonsdagerEnabled } from '../../../../featureToggles';
import { CellContent } from '../../table/CellContent';
import { DagtypeIcon } from './DagtypeIcon';

const OverstyrbarSelect = styled(Select)`
    padding: 3px 2.625rem 3px 8px;
    min-width: max-content;
`;

const IconContainer = styled.div`
    width: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

interface DagtypeLabelProps {
    sykdomsdag: Sykdomsdag;
    utbetalingsdag: Utbetalingsdag;
}

const DagtypeLabel = ({ sykdomsdag, utbetalingsdag }: DagtypeLabelProps) => {
    const text = (() => {
        switch (utbetalingsdag.type) {
            case Dagtype.Avvist:
                return `${sykdomsdag.type} (Avslått)`;
            case Dagtype.Foreldet:
                return `${sykdomsdag.type} (Foreldet)`;
            case Dagtype.Arbeidsgiverperiode:
                return `${sykdomsdag.type} (AGP)`;
            default:
                return sykdomsdag.type;
        }
    })();
    return <Normaltekst>{text}</Normaltekst>;
};

const lovligeRevurderinger: ReadonlyMap<Dagtype, Array<Dagtype>> = new Map([
    [Dagtype.Syk, [Dagtype.Syk, Dagtype.Ferie]],
    [Dagtype.Ferie, [Dagtype.Syk, Dagtype.Ferie]],
]);

interface OverstyrbarDagtypeProps {
    sykdomsdag: Sykdomsdag;
    utbetalingsdag: Utbetalingsdag;
    onOverstyr: (dag: Sykdomsdag, properties: Omit<Partial<Dag>, 'dato'>) => void;
    erRevurdering: boolean;
    overstyrtDag?: OverstyrtDag;
}
export const OverstyrbarDagtypeCell = ({
    sykdomsdag,
    utbetalingsdag,
    onOverstyr,
    erRevurdering,
    overstyrtDag,
}: OverstyrbarDagtypeProps) => {
    const [opprinneligDagtype] = useState(sykdomsdag.type);

    const onSelectDagtype = ({ target }: ChangeEvent<HTMLSelectElement>) => {
        const nyDagtype = target.value as Dagtype;
        onOverstyr(sykdomsdag, { type: nyDagtype });
    };

    const dagKanRevurderes = (type: Dagtype): boolean => lovligeRevurderinger.has(type);

    const dagKanOverstyres = (type: Dagtype): boolean =>
        (type !== Dagtype.Helg && [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding].includes(type)) ||
        (overstyrPermisjonsdagerEnabled && type === Dagtype.Permisjon);

    const kanOverstyres =
        (erRevurdering ? dagKanRevurderes(sykdomsdag.type) : dagKanOverstyres(sykdomsdag.type)) &&
        utbetalingsdag.type !== Dagtype.Arbeidsgiverperiode;

    const dagtyperManKanEndreTil = (type: Dagtype) =>
        erRevurdering ? lovligeRevurderinger.get(type) : dagKanOverstyres(type) || type === opprinneligDagtype;

    return (
        <td>
            <CellContent>
                <IconContainer>
                    <DagtypeIcon type={overstyrtDag?.type ?? sykdomsdag.type} />
                </IconContainer>
                {kanOverstyres ? (
                    <OverstyrbarSelect
                        defaultValue={sykdomsdag.type}
                        onChange={onSelectDagtype}
                        data-testid="overstyrbar-dagtype"
                    >
                        {Object.values(Dagtype)
                            .filter(dagtyperManKanEndreTil)
                            .map((dagtype: Dagtype) => (
                                <option key={dagtype} data-testid="overstyrbar-dagtype-option">
                                    {dagtype}
                                </option>
                            ))}
                    </OverstyrbarSelect>
                ) : (
                    <DagtypeLabel sykdomsdag={sykdomsdag} utbetalingsdag={utbetalingsdag} />
                )}
            </CellContent>
        </td>
    );
};
