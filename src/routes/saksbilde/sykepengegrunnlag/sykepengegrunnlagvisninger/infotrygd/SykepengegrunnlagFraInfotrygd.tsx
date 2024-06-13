import React from 'react';

import { Infotrygdvurdering } from '@components/Infotrygdvurdering';
import { PersonFragment, VilkarsgrunnlagInfotrygd } from '@io/graphql';
import { getRequiredInntekt } from '@person/utils';
import { Inntekt } from '@saksbilde/sykepengegrunnlag/inntekt/Inntekt';

import { SykepengegrunnlagInfotrygd } from './SykepengegrunnlagInfotrygd';

import styles from './SykepengegrunnlagFraInfotrygd.module.css';

interface SykepengegrunnlagFraInfogtrygdProps {
    person: PersonFragment;
    vilkårsgrunnlag: VilkarsgrunnlagInfotrygd;
    organisasjonsnummer: string;
}

export const SykepengegrunnlagFraInfogtrygd = ({
    person,
    vilkårsgrunnlag,
    organisasjonsnummer,
}: SykepengegrunnlagFraInfogtrygdProps) => {
    const inntekt = getRequiredInntekt(vilkårsgrunnlag, organisasjonsnummer);

    return (
        <Infotrygdvurdering title="Sykepengegrunnlag satt i Infotrygd">
            <div className={styles.oversikt}>
                <SykepengegrunnlagInfotrygd
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    organisasjonsnummer={organisasjonsnummer}
                />
                <span className={styles.strek} />
                <Inntekt person={person} inntekt={inntekt} />
            </div>
        </Infotrygdvurdering>
    );
};
