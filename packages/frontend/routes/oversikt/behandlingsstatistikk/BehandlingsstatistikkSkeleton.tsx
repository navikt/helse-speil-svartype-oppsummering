import React from 'react';
import { LoadingShimmer } from '@components/LoadingShimmer';

import { Separator } from './Separator';
import { LabelCell } from './LabelCell';

import styles from './BehandlingsstatistikkView.module.css';

const LoadingCells: React.FC = () => {
    return (
        <>
            <td>
                <LoadingShimmer />
            </td>
            <td>
                <LoadingShimmer />
            </td>
            <td>
                <LoadingShimmer />
            </td>
        </>
    );
};

export const BehandlingsstatistikkSkeleton: React.FC = () => {
    return (
        <table>
            <thead>
                <tr>
                    <th />
                    <th>MANUELT</th>
                    <th>AUTOMATISK</th>
                    <th>TILGJENGELIG</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <LabelCell.EnArbeidsgiver />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.FlereArbeidsgivere />
                    </td>
                    <LoadingCells />
                </tr>
            </tbody>
            <Separator />
            <tbody>
                <tr>
                    <td>
                        <LabelCell.Førstegangsbehandling />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.Forlengelser />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.ForlengelseInfotrygd />
                    </td>
                    <LoadingCells />
                </tr>
            </tbody>
            <Separator />
            <tbody>
                <tr>
                    <td>
                        <LabelCell.UtbetalingTilArbeidsgiver />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.UtbetalingTilSykmeldt />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.DelvisRefusjon />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.Faresignaler />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.FortroligAdresse />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.Stikkprøver />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.Revurdering />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.Beslutter />
                    </td>
                    <LoadingCells />
                </tr>
            </tbody>
            <Separator />
            <tfoot>
                <tr>
                    <td colSpan={4}>
                        <p className={styles.FooterTotal}>
                            TOTALT FULLFØRTE SAKER I DAG: <LoadingShimmer />
                        </p>
                    </td>
                </tr>
                <tr>
                    <td colSpan={4}>
                        <div className={styles.FooterCellContainer}>
                            <div className={styles.FooterCell}>
                                <p>
                                    <LoadingShimmer />
                                </p>
                                <p>AV SAKSBEHANDLER</p>
                            </div>
                            <div className={styles.FooterCell}>
                                <p>
                                    <LoadingShimmer />
                                </p>
                                <p>AUTOMATISK</p>
                            </div>
                            <div className={styles.FooterCell}>
                                <p>
                                    <LoadingShimmer />
                                </p>
                                <p>ANNULLERT</p>
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
};