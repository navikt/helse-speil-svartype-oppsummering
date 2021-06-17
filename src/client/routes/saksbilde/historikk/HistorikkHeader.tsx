import styled from '@emotion/styled';
import React from 'react';

import { TabButton } from '../../../components/TabButton';

import { Hendelsetype } from './Historikk.types';
import IconDokumenter from './icons/IconDokumenter.svg';
import IconHistorikk from './icons/IconHistorikk.svg';
import { useFilterState, useShowHistorikkState } from './state';

const Header = styled.div`
    --historikk-header-height: 48px;
    display: flex;
    justify-content: flex-end;
    height: var(--historikk-header-height);
    box-sizing: border-box;
`;

const HistorikkTabButton = styled(TabButton)`
    height: var(--historikk-header-height);
    width: var(--historikk-header-height);
`;

export const HistorikkHeader = () => {
    const [filter, setFilter] = useFilterState();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();

    return (
        <Header>
            {showHistorikk ? (
                <>
                    <HistorikkTabButton
                        active={filter === Hendelsetype.Historikk}
                        onClick={() => setFilter(Hendelsetype.Historikk)}
                    >
                        <IconHistorikk />
                    </HistorikkTabButton>
                    <HistorikkTabButton
                        active={filter === Hendelsetype.Dokument}
                        onClick={() => setFilter(Hendelsetype.Dokument)}
                    >
                        <IconDokumenter />
                    </HistorikkTabButton>
                </>
            ) : (
                <>
                    <HistorikkTabButton
                        active={false}
                        onClick={() => {
                            setFilter(Hendelsetype.Historikk);
                            setShowHistorikk(true);
                        }}
                    >
                        <IconHistorikk />
                    </HistorikkTabButton>
                    <HistorikkTabButton
                        active={false}
                        onClick={() => {
                            setFilter(Hendelsetype.Dokument);
                            setShowHistorikk(true);
                        }}
                    >
                        <IconDokumenter />
                    </HistorikkTabButton>
                </>
            )}
        </Header>
    );
};
