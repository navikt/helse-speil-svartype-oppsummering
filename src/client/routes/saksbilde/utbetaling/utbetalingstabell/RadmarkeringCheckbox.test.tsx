import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';

import { RadmarkeringCheckbox } from './RadmarkeringCheckbox';

jest.mock('../../../../featureToggles', () => ({
    overstyrPermisjonsdagerEnabled: true,
}));

describe('RadmarkeringCheckbox', () => {
    it('rendrer checkbox for overstyrbare dager', () => {
        render(
            <>
                <RadmarkeringCheckbox index={0} dagtype="Syk" dato={dayjs()} />
                <RadmarkeringCheckbox index={0} dagtype="Ferie" dato={dayjs()} />
                <RadmarkeringCheckbox index={0} dagtype="Egenmelding" dato={dayjs()} />
                <RadmarkeringCheckbox index={0} dagtype="Permisjon" dato={dayjs()} />;
            </>
        );

        expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    });

    it('rendrer ikke checkbox for ikke-overstyrbare dager', () => {
        render(
            <>
                <RadmarkeringCheckbox index={0} dagtype="Helg" dato={dayjs()} />
                <RadmarkeringCheckbox index={0} dagtype="Avslått" dato={dayjs()} />
                <RadmarkeringCheckbox index={0} dagtype="Ubestemt" dato={dayjs()} />
                <RadmarkeringCheckbox index={0} dagtype="Arbeidsdag" dato={dayjs()} />;
                <RadmarkeringCheckbox index={0} dagtype="Arbeidsgiverperiode" dato={dayjs()} />;
                <RadmarkeringCheckbox index={0} dagtype="Foreldet" dato={dayjs()} />;
                <RadmarkeringCheckbox index={0} dagtype="Annullert" dato={dayjs()} />;
            </>
        );

        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });
});
