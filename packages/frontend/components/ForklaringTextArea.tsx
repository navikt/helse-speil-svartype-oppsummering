import styled from '@emotion/styled';
import { Textarea } from '@navikt/ds-react';
import { useFormContext } from 'react-hook-form';
import React, { useState } from 'react';

const StyledTextarea = styled(Textarea)`
    white-space: pre-line;
`;
interface ForklaringTextAreaProps {
    description: string;
}
export const ForklaringTextarea = ({ description }: ForklaringTextAreaProps) => {
    const form = useFormContext();

    const [forklaring, setForklaring] = useState('');

    const { ref, onChange, ...textareaValidation } = form.register('forklaring', {
        required: 'Forklaring må fylles ut',
        minLength: 1,
    });

    return (
        <StyledTextarea
            label="Forklaring"
            id="forklaring"
            value={forklaring}
            ref={ref}
            onChange={(event) => {
                onChange(event);
                setForklaring(event.target.value);
            }}
            description={description}
            maxLength={500}
            aria-labelledby="forklaring-label forklaring-feil"
            error={form.formState.errors.forklaring?.message}
            {...textareaValidation}
        />
    );
};