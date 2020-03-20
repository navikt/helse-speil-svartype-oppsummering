import React, { useContext } from 'react';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { PersonContext } from '../../context/PersonContext';
import styled from '@emotion/styled';
import BehandletVedtaksperiode from './BehandletVedtaksperiode';
import UbehandletVedtaksperiode from './UbehandletVedtaksperiode';
import PåfølgendeVedtaksperiode from './PåfølgendeVedtaksperiode';
import { useVedtaksperiodestatus, VedtaksperiodeStatus } from '../../hooks/useVedtaksperiodestatus';
import Toppvarsel from '../../components/Toppvarsel';
import { finnFørsteVedtaksperiode } from '../../hooks/finnFørsteVedtaksperiode';
import IkkeVurderteVilkår from './Vilkårsgrupper/IkkeVurderteVilkår';
import Aktivitetsplikt from './Aktivitetsplikt';
import { Strek } from './Vilkår.styles';

const Footer = styled(NavigationButtons)`
    margin: 2.5rem 2rem 2rem;
`;

const Vilkår = () => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const periodeStatus = useVedtaksperiodestatus();

    if (!aktivVedtaksperiode?.vilkår || personTilBehandling === undefined) return null;
    const førsteVedtaksperiode = finnFørsteVedtaksperiode(aktivVedtaksperiode, personTilBehandling!);

    return (
        <>
            {periodeStatus === VedtaksperiodeStatus.Behandlet && (
                <BehandletVedtaksperiode
                    aktivVedtaksperiode={aktivVedtaksperiode}
                    førsteVedtaksperiode={førsteVedtaksperiode}
                />
            )}
            {periodeStatus !== VedtaksperiodeStatus.Behandlet && (
                <>
                    <Toppvarsel text="Enkelte vilkår må vurderes manuelt" type="advarsel" />
                    <IkkeVurderteVilkår />
                    {periodeStatus === VedtaksperiodeStatus.Ubehandlet ? (
                        <UbehandletVedtaksperiode aktivVedtaksperiode={aktivVedtaksperiode} />
                    ) : (
                        <PåfølgendeVedtaksperiode
                            aktivVedtaksperiode={aktivVedtaksperiode}
                            førsteVedtaksperiode={førsteVedtaksperiode}
                        />
                    )}
                </>
            )}
            <Strek />
            <Aktivitetsplikt />
            <Footer />
        </>
    );
};

export default Vilkår;
