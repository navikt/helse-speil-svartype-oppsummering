import React from 'react';
import IconRow from '../../widgets/rows/IconRow';
import FormRow from '../../widgets/rows/FormRow';
import ListeSeparator from '../../widgets/ListeSeparator';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import { Panel } from 'nav-frontend-paneler';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { toKronerOgØre } from '../../../utils/locale';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { tekster, utbetalingstekster } from '../../../tekster';

const Utbetaling = withBehandlingContext(({ behandling }) => {
    const {
        antallDager,
        betalerArbeidsgiverperiode,
        dagsats,
        refusjonTilArbeidsgiver,
        sykepengegrunnlag,
        sykmeldingsgrad
    } = behandling.utbetaling;
    return (
        <Panel className="Utbetaling" border>
            <Undertittel className="panel-tittel">
                {utbetalingstekster('tittel')}
            </Undertittel>
            <FormRow
                label={utbetalingstekster('refusjon')}
                value={refusjonTilArbeidsgiver ? 'Ja' : 'Nei'}
            />
            <FormRow
                label={utbetalingstekster('betaler')}
                value={betalerArbeidsgiverperiode ? 'Ja' : 'Nei'}
            />
            <ListeSeparator type="transparent" />
            <FormRow
                label={utbetalingstekster('sykepengegrunnlag')}
                value={toKronerOgØre(sykepengegrunnlag)}
                showRightSide={false}
            />
            <FormRow
                label={utbetalingstekster('dagsats')}
                value={toKronerOgØre(dagsats)}
                showRightSide={false}
            />
            <FormRow
                label={utbetalingstekster('dager')}
                value={antallDager}
                showRightSide={false}
            />
            <FormRow
                label={utbetalingstekster('sykmeldingsgrad')}
                value={`${sykmeldingsgrad}%`}
                showRightSide={false}
            />
            <ListeSeparator type="transparent" />
            <FormRow
                label={utbetalingstekster('utbetaling')}
                value={toKronerOgØre(antallDager * dagsats)}
                bold
            />
            <ListeSeparator />
            <Element className="mvp-tittel">{tekster('mvp')}</Element>
            <IconRow label={utbetalingstekster('forskutterer')} />

            <Navigasjonsknapper previous="/periode" next="/oppsummering" />
        </Panel>
    );
});

export default Utbetaling;
