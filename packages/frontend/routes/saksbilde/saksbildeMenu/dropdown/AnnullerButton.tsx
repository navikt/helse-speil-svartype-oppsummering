import React, { useContext, useState } from 'react';
import {
    Arbeidsgiver,
    Arbeidsgiveroppdrag,
    BeregnetPeriode,
    Oppdrag,
    Person,
    Utbetaling,
    Utbetalingstatus,
} from '@io/graphql';
import { DropdownContext } from '@components/dropdown';
import { annulleringerEnabled } from '@utils/featureToggles';

import { Annulleringsmodal } from '../annullering/Annulleringsmodal';
import { useArbeidsgiveroppdrag } from '../../utbetalingshistorikk/state';
import { useErBeslutteroppgaveOgHarTilgang } from '@hooks/useErBeslutteroppgaveOgHarTilgang';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Dropdown } from '@navikt/ds-react-internal';

interface AnnullerButtonWithContentProps {
    oppdrag: Arbeidsgiveroppdrag;
    utbetaling: Utbetaling;
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
}

const AnnullerButtonWithContent: React.VFC<AnnullerButtonWithContentProps> = ({
    oppdrag,
    utbetaling,
    aktørId,
    fødselsnummer,
    organisasjonsnummer,
}) => {
    const [showModal, setShowModal] = useState(false);

    const { lukk } = useContext(DropdownContext);

    return (
        <>
            <Dropdown.Menu.List.Item onClick={() => setShowModal(true)}>Annuller</Dropdown.Menu.List.Item>
            {showModal && (
                <Annulleringsmodal
                    fødselsnummer={fødselsnummer}
                    aktørId={aktørId}
                    organisasjonsnummer={organisasjonsnummer}
                    fagsystemId={utbetaling.arbeidsgiverFagsystemId}
                    linjer={oppdrag.linjer}
                    onClose={() => {
                        setShowModal(false);
                        lukk();
                    }}
                />
            )}
        </>
    );
};

const harArbeidsgiveroppdrag = (
    oppdrag?: Maybe<Oppdrag>,
): oppdrag is Oppdrag & { arbeidsgiveroppdrag: Arbeidsgiveroppdrag } => {
    return !!oppdrag?.arbeidsgiveroppdrag;
};

const kanAnnullere = (
    oppdrag: Maybe<Oppdrag>,
    erBeslutterMedTilgang: boolean,
    erReadonly: boolean,
    utbetaling: Utbetaling,
): boolean => {
    return (
        annulleringerEnabled &&
        !erBeslutterMedTilgang &&
        !erReadonly &&
        harArbeidsgiveroppdrag(oppdrag) &&
        utbetaling.status !== Utbetalingstatus.Annullert
    );
};

interface AnnullerButtonProps {
    person: Person;
    periode: BeregnetPeriode;
    arbeidsgiver: Arbeidsgiver;
}

export const AnnullerButton: React.FC<AnnullerButtonProps> = ({ person, periode, arbeidsgiver }) => {
    const erReadonly = useIsReadOnlyOppgave();
    const erBeslutterMedTilgang = useErBeslutteroppgaveOgHarTilgang();

    const oppdrag = useArbeidsgiveroppdrag(person.fodselsnummer, periode.utbetaling.arbeidsgiverFagsystemId);

    if (
        !harArbeidsgiveroppdrag(oppdrag) ||
        !kanAnnullere(oppdrag, erBeslutterMedTilgang, erReadonly, periode.utbetaling)
    ) {
        return null;
    }

    return (
        <AnnullerButtonWithContent
            oppdrag={oppdrag.arbeidsgiveroppdrag}
            utbetaling={periode.utbetaling}
            aktørId={person.aktorId}
            fødselsnummer={person.fodselsnummer}
            organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
        />
    );
};