import styled from '@emotion/styled';
import React from 'react';

import { Link } from '@navikt/ds-react';

import { Modal } from '../../../../../components/Modal';
import { useInnloggetSaksbehandler } from '../../../../../state/authentication';
import { useNotaterForVedtaksperiode } from '../../../../../state/notater';

import { NotatListeRad } from './NotatListeRad';

const Table = styled.table`
    th,
    td {
        padding: 1rem;
    }
    th {
        text-align: left;
        font-weight: 600;
        border-bottom: 1px solid var(--navds-color-gray-60);
    }
    tbody > tr > td {
        border-bottom: 1px solid var(--navds-color-gray-20);
    }
    tbody > tr:nth-child(2n-1) > td {
        background-color: var(--navds-color-gray-10);
    }
`;

const StyledLenke = styled(Link)`
    align-self: flex-end;
`;

const Content = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const StyledModal = styled(Modal)`
    width: 680px;

    h1 {
        font-size: 24px;
        font-weight: 600;
    }
`;

const Tittel = styled.h1`
    font-size: 16px;
    font-weight: 600;
    color: var(--navds-color-text-primary);
    margin-top: 18px;
    margin-left: 24px;
    margin-bottom: 26px;
`;

interface Props {
    lukk: () => void;
    vedtaksperiodeId: string;
    åpneNyttNotatModal: () => void;
    tildeling?: Tildeling;
}

export const NotatListeModal = ({ lukk, vedtaksperiodeId, tildeling, åpneNyttNotatModal }: Props) => {
    const notater = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const påVent = tildeling?.påVent ?? false;
    const saksbehandler = useInnloggetSaksbehandler();

    const closeModal = (event: React.MouseEvent | React.KeyboardEvent) => {
        event.stopPropagation();
        lukk();
    };

    return (
        <StyledModal
            title={<Tittel>Lagt på vent - notater</Tittel>}
            contentLabel="Lagt på vent - notater"
            isOpen
            onRequestClose={closeModal}
        >
            <Content>
                {notater.length > 0 && (
                    <>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Dato</th>
                                    <th>Saksbehandler</th>
                                    <th>Kommentar</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {notater.map((notat) => (
                                    <NotatListeRad
                                        key={notat.id}
                                        notat={notat}
                                        vedtaksperiodeId={vedtaksperiodeId}
                                        saksbehandler={saksbehandler}
                                    />
                                ))}
                            </tbody>
                        </Table>
                        <br />
                        {påVent && (
                            <StyledLenke
                                href="#"
                                onClick={() => {
                                    lukk();
                                    åpneNyttNotatModal();
                                }}
                            >
                                Legg til ny kommentar
                            </StyledLenke>
                        )}
                    </>
                )}
            </Content>
        </StyledModal>
    );
};
