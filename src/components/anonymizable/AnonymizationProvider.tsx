import { CSSProperties, PropsWithChildren, useEffect } from 'react';

import { useIsAnonymous, useSetAnonymity } from '@state/anonymization';

const anomizedStyle = {
    '--anonymizable-background': 'var(--anonymous-background)',
    '--anonymizable-color': 'var(--anonymous-color)',
    '--anonymizable-border-radius': 'var(--anonymous-border-radius)',
    '--anonymizable-opacity': 'var(--anonymous-opacity)',
} as CSSProperties;

const visibleStyle = {
    '--anonymizable-background': 'var(--visible-background)',
    '--anonymizable-color': 'var(--visible-color)',
    '--anonymizable-border-radius': 'var(--visible-border-radius)',
    '--anonymizable-opacity': 'var(--visible-opacity)',
} as CSSProperties;

export const AnonymiseringProvider = ({ children }: PropsWithChildren) => {
    const anonymiser = useIsAnonymous();
    const setAnonymity = useSetAnonymity();

    useEffect(() => {
        // Hydrer sessionStorage verdi for anonymisering "lazily" hindre SSR issues, fordi serveren vet ikke hva som er i sessionStorage
        const anonymisering = sessionStorage.getItem('agurkmodus');
        if (anonymisering) {
            const anonymiseringBool = anonymisering === 'true';
            setAnonymity(anonymiseringBool);
        }
    }, [setAnonymity]);

    return (
        <div id="root" style={anonymiser ? anomizedStyle : visibleStyle}>
            {children}
        </div>
    );
};