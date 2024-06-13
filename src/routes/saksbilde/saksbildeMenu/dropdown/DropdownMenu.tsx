import styles from './DropdownMenu.module.scss';
import React, { ReactElement, useRef, useState } from 'react';

import { Collapse, Expand } from '@navikt/ds-icons';
import { Dropdown } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { useInteractOutside } from '@hooks/useInteractOutside';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { PersonFragment } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { ActivePeriod } from '@typer/shared';
import { isArbeidsgiver, isBeregnetPeriode, isPerson } from '@utils/typeguards';

import { AnnullerButton } from './AnnullerButton';
import { OppdaterPersondataButton } from './OppdaterPersondataButton';
import { PåVentButton } from './PåVentButton';
import { TildelingDropdownMenuButton } from './TildelingDropdownMenuButton';

// TODO: kan brukes i vanlig useQuery loading?

// TODO: kan brukes i vanlig useQuery loading?
const DropdownMenuContentSkeleton = (): ReactElement => {
    return (
        <Dropdown.Menu placement="bottom-start">
            <Dropdown.Menu.List>
                <Dropdown.Menu.List.Item>
                    <LoadingShimmer />
                </Dropdown.Menu.List.Item>
                <Dropdown.Menu.List.Item>
                    <LoadingShimmer />
                </Dropdown.Menu.List.Item>
                <Dropdown.Menu.List.Item>
                    <LoadingShimmer />
                </Dropdown.Menu.List.Item>
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    );
};

type DropdownMenuProps = {
    person: PersonFragment;
    activePeriod: ActivePeriod;
};

const DropdownMenuContent = ({ person, activePeriod }: DropdownMenuProps): ReactElement | null => {
    const user = useInnloggetSaksbehandler();
    const readOnly = useIsReadOnlyOppgave();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!isPerson(person)) {
        return null;
    }

    const personIsAssignedUser = (person?.tildeling && person?.tildeling?.oid === user.oid) ?? false;

    return (
        <Dropdown.Menu placement="bottom-start" className={styles.dropdown}>
            {isBeregnetPeriode(activePeriod) && activePeriod.oppgave?.id && !readOnly && (
                <>
                    <Dropdown.Menu.List>
                        <>
                            <TildelingDropdownMenuButton
                                oppgavereferanse={activePeriod.oppgave.id}
                                erTildeltInnloggetBruker={personIsAssignedUser}
                                tildeling={person?.tildeling}
                            />
                            <PåVentButton person={person} />
                        </>
                    </Dropdown.Menu.List>
                    <Dropdown.Menu.Divider />
                </>
            )}
            <Dropdown.Menu.List>
                <OppdaterPersondataButton person={person} />
                {isBeregnetPeriode(activePeriod) && isArbeidsgiver(arbeidsgiver) && (
                    <AnnullerButton person={person} periode={activePeriod} arbeidsgiver={arbeidsgiver} />
                )}
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    );
};

export const DropdownMenu = ({ person, activePeriod }: DropdownMenuProps): ReactElement => {
    const [open, setOpen] = useState(false);
    const content = useRef<HTMLSpanElement>(null);

    const toggleDropdown = () => {
        setOpen((prevState) => !prevState);
    };

    const closeDropdown = () => {
        setOpen(false);
    };

    useInteractOutside({
        ref: content,
        onInteractOutside: closeDropdown,
        active: open,
    });

    return (
        <span ref={content}>
            <Dropdown onSelect={closeDropdown}>
                <Dropdown.Toggle className={styles.menu} onClick={toggleDropdown}>
                    Meny {open ? <Collapse title="collapse" /> : <Expand title="expand" />}
                </Dropdown.Toggle>
                <DropdownMenuContent person={person} activePeriod={activePeriod} />
            </Dropdown>
        </span>
    );
};
