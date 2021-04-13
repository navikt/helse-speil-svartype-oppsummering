import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { somPenger } from '../../../utils/locale';
import { Kilde } from '../../../components/Kilde';
import { OmregnetÅrsinntekt, Sammenligningsgrunnlag } from 'internal-types';
import { kilde } from '../../../utils/inntektskilde';
import { ArbeidsgiverRad, InntektMedKilde } from './InntekttabellKomponenter';

interface Props {
    arbeidsgiver: string;
    omregnetÅrsinntekt?: OmregnetÅrsinntekt;
    sammenligningsgrunnlag?: Sammenligningsgrunnlag;
    erGjeldende: boolean;
}

const Inntektssammenligning = ({ arbeidsgiver, omregnetÅrsinntekt, sammenligningsgrunnlag, erGjeldende }: Props) => (
    <ArbeidsgiverRad erGjeldende={erGjeldende}>
        <div>
            <Normaltekst style={{ marginLeft: '0.25rem' }}>{arbeidsgiver}</Normaltekst>
        </div>
        <InntektMedKilde>
            <Normaltekst>{omregnetÅrsinntekt ? somPenger(omregnetÅrsinntekt.beløp) : 'Ukjent'}</Normaltekst>
            {omregnetÅrsinntekt && <Kilde>{kilde(omregnetÅrsinntekt.kilde)}</Kilde>}
        </InntektMedKilde>
        <InntektMedKilde>
            <Normaltekst>{somPenger(sammenligningsgrunnlag?.beløp)}</Normaltekst>
            <Kilde>AO</Kilde>
        </InntektMedKilde>
    </ArbeidsgiverRad>
);

export default Inntektssammenligning;
