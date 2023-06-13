import React from 'react';

import { Table } from '@navikt/ds-react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { FilterButton } from '../FilterButton';
import { Filter } from '../state/filter';

interface FilterHeaderProps {
    filters: Filter<OppgaveForOversiktsvisning>[];
    column: number;
    text: string;
}

export const FilterHeader = ({ filters, column, text }: FilterHeaderProps) => {
    const numberOfFilters = filters.filter((it) => it.column === column && it.active).length;
    return (
        <Table.HeaderCell scope="col" colSpan={1}>
            <FilterButton filters={filters.filter((it) => it.column === column)}>
                {`${text} (${numberOfFilters})`}
            </FilterButton>
        </Table.HeaderCell>
    );
};