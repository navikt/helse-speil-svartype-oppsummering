import React from 'react';
import styled from '@emotion/styled';
import { Normaltekst } from 'nav-frontend-typografi';
import { Vilkårsgruppe } from './Vilkårsgruppe';
import { toKronerOgØre } from '../../../../utils/locale';
import { Vilkårsgrupperad } from './Vilkårsgrupperad';
import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { Opptjening, Risikovurdering as RisikovurderingType, Vilkår } from 'internal-types';
import { Infoikon } from '../../../../components/ikoner/Infoikon';
import { Flex } from '../../../../components/Flex';
import { Paragraf } from '../vilkårstitler';

export const Alder = ({ alder }: Vilkår) => (
    <Vilkårsgrupperad label="Alder">{alder.alderSisteSykedag}</Vilkårsgrupperad>
);

export const Søknadsfrist = ({ søknadsfrist }: Vilkår) => (
    <>
        <Vilkårsgrupperad label="Sendt NAV">
            {søknadsfrist?.sendtNav!.format(NORSK_DATOFORMAT) ?? 'Ukjent dato'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Siste sykepengedag">
            {søknadsfrist?.søknadTom?.format(NORSK_DATOFORMAT) ?? 'Ukjent dato'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Innen 3 mnd">{søknadsfrist?.oppfylt ? 'Ja' : 'Nei'}</Vilkårsgrupperad>
    </>
);

export const Opptjeningstid = ({ dagerIgjen, opptjening }: Vilkår) => (
    <>
        <Vilkårsgrupperad label="Skjæringstidspunkt">
            {dagerIgjen.skjæringstidspunkt?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Opptjening fra">
            {(opptjening as Opptjening)?.opptjeningFra?.format(NORSK_DATOFORMAT) ?? 'ukjent'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Antall dager (>28)">{`${
            (opptjening as Opptjening)?.antallOpptjeningsdagerErMinst ?? false
        }`}</Vilkårsgrupperad>
    </>
);

interface Grunnbeløp {
    grunnbeløp: number;
    alder: number;
}

const Grunnbeløp = ({ grunnbeløp, alder }: Grunnbeløp) =>
    alder >= 67 ? (
        <Normaltekst>{`2G er ${toKronerOgØre(grunnbeløp * 2)} kr`}</Normaltekst>
    ) : (
        <Normaltekst>{`0,5G er ${toKronerOgØre(grunnbeløp / 2)} kr`}</Normaltekst>
    );

export const Sykepengegrunnlag = ({ sykepengegrunnlag, alder }: Vilkår) => (
    <>
        <Vilkårsgrupperad label="Sykepengegrunnlaget">
            {sykepengegrunnlag.sykepengegrunnlag
                ? `${toKronerOgØre(sykepengegrunnlag.sykepengegrunnlag)} kr`
                : 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Grunnbeløp grunnbeløp={sykepengegrunnlag.grunnebeløp} alder={alder.alderSisteSykedag} />
    </>
);

export const AlderIkon = styled(Infoikon)`
    padding: 0 10px;
`;

interface GjenståendeDagerProps {
    gjenståendeDager: number;
    alderSisteSykedag: number;
}

const GjenståendeDager = ({ gjenståendeDager, alderSisteSykedag }: GjenståendeDagerProps) => (
    <Flex alignItems="center">
        {gjenståendeDager}
        {alderSisteSykedag >= 67 && alderSisteSykedag < 70 && (
            <>
                <AlderIkon width={16} height={16} />
                <Paragraf>§ 8-51</Paragraf>
            </>
        )}
    </Flex>
);

export const DagerIgjen = ({ dagerIgjen, alder }: Vilkår) => (
    <>
        <Vilkårsgrupperad label="Skjæringstidspunkt">
            {dagerIgjen.skjæringstidspunkt?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Første sykepengedag">
            {dagerIgjen.førsteSykepengedag?.format(NORSK_DATOFORMAT) ?? 'Ingen sykepengedager'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Yrkesstatus">Arbeidstaker</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Dager brukt">{dagerIgjen.dagerBrukt ?? 'Ikke funnet'}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Dager igjen">
            {dagerIgjen.gjenståendeDager ? (
                <GjenståendeDager
                    alderSisteSykedag={alder.alderSisteSykedag}
                    gjenståendeDager={dagerIgjen.gjenståendeDager}
                />
            ) : (
                <Normaltekst>Ikke funnet</Normaltekst>
            )}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Maksdato">
            {dagerIgjen.maksdato?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
        </Vilkårsgrupperad>
    </>
);

export const Medlemskap = ({ medlemskap }: Vilkår) => (
    <Vilkårsgruppe tittel="Medlemskap" paragraf="§ 2" ikontype={medlemskap?.oppfylt ? 'ok' : 'kryss'} />
);

const Vurderinger = styled.ul`
    list-style: initial;
    color: #3e3832;
`;

export const Arbeidsuførhet = ({ risikovurdering }: { risikovurdering?: RisikovurderingType }) => (
    <Vurderinger>
        {risikovurdering?.arbeidsuførhetvurdering?.map((vurdering, i) => (
            <li key={i}>
                <Normaltekst>{vurdering}</Normaltekst>
            </li>
        ))}
    </Vurderinger>
);
