import { useFormContext } from 'react-hook-form';
import { Radio, RadioGroup } from '@navikt/ds-react';
import React from 'react';
import styled from '@emotion/styled';

const BegrunnelseFieldset = styled(RadioGroup)`
    > .navds-radio {
        padding: 0;
    }

    margin-bottom: 2rem;
`;

interface BegrunnelserProps {
    begrunnelser: string[];
}

export const Begrunnelser = ({ begrunnelser }: BegrunnelserProps) => {
    const form = useFormContext();
    const { ref, ...begrunnelseValidation } = form.register('begrunnelse', { required: 'Velg en begrunnelse' });
    return (
        <BegrunnelseFieldset
            legend="Begrunnelse"
            id="begrunnelse"
            name="begrunnelse"
            error={form.formState.errors['begrunnelse']?.message}
        >
            {begrunnelser.map((begrunnelse, index) => (
                <Radio key={index} ref={ref} value={begrunnelse} {...begrunnelseValidation}>
                    {begrunnelse}
                </Radio>
            ))}
        </BegrunnelseFieldset>
    );
};