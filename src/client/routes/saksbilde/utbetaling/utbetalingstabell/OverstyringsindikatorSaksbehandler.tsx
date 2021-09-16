import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React, { useRef, useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';
import { Tooltip } from '@navikt/helse-frontend-tooltip';
import '@navikt/helse-frontend-tooltip/lib/main.css';

import { useInteractOutside } from '../../../../hooks/useInteractOutside';
import { NORSK_DATOFORMAT } from '../../../../utils/date';

interface OverstyringsindikatorProps {
    begrunnelse: string;
    saksbehandler: string;
    dato: Dayjs;
}

const Overstyringknapp = styled.button`
    position: relative;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    width: 28px;
    display: flex;
    justify-content: center;
    outline: none;
`;

const StyledTooltip = styled(Tooltip)`
    > p {
        text-align: left;
    }
`;

const Begrunnelsetekst = styled(BodyShort)`
    color: var(--navds-color-text-inverse);
`;

const StyledUndertekst = styled(BodyShort)`
    font-size: 14px;
    font-style: italic;
`;

const Bold = styled(BodyShort)`
    font-weight: 600;
`;

export const OverstyringsindikatorSaksbehandler = ({
    begrunnelse,
    saksbehandler,
    dato,
}: OverstyringsindikatorProps) => {
    const [visTooltip, setVisTooltip] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleVisTooltip = () => setVisTooltip((prevState) => !prevState);

    useInteractOutside({
        ref: buttonRef,
        active: visTooltip,
        onInteractOutside: toggleVisTooltip,
    });

    return (
        <Overstyringknapp type="button" ref={buttonRef} onClick={() => setVisTooltip((value) => !value)}>
            <CaseworkerFilled height={20} width={20} />
            {visTooltip && (
                <StyledTooltip>
                    <Bold component="p">Begrunnelse</Bold>
                    <Begrunnelsetekst component="p">{begrunnelse}</Begrunnelsetekst>
                    <StyledUndertekst component="p">
                        {saksbehandler}, {dato.format(NORSK_DATOFORMAT)}
                    </StyledUndertekst>
                </StyledTooltip>
            )}
        </Overstyringknapp>
    );
};
