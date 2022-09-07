export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};

export enum Adressebeskyttelse {
    Fortrolig = 'Fortrolig',
    StrengtFortrolig = 'StrengtFortrolig',
    StrengtFortroligUtland = 'StrengtFortroligUtland',
    Ugradert = 'Ugradert',
    Ukjent = 'Ukjent',
}

export type Aktivitet = {
    __typename?: 'Aktivitet';
    alvorlighetsgrad: Scalars['String'];
    melding: Scalars['String'];
    tidsstempel: Scalars['String'];
    vedtaksperiodeId: Scalars['String'];
};

export type Alder = {
    __typename?: 'Alder';
    alderSisteSykedag: Scalars['Int'];
    oppfylt: Scalars['Boolean'];
};

export type Annullering = {
    __typename?: 'Annullering';
    saksbehandler: Scalars['String'];
    tidspunkt: Scalars['String'];
};

export type Antall = {
    __typename?: 'Antall';
    automatisk: Scalars['Int'];
    manuelt: Scalars['Int'];
    tilgjengelig: Scalars['Int'];
};

export type Arbeidsforhold = {
    __typename?: 'Arbeidsforhold';
    sluttdato?: Maybe<Scalars['String']>;
    startdato: Scalars['String'];
    stillingsprosent: Scalars['Int'];
    stillingstittel: Scalars['String'];
};

export type Arbeidsforholdoverstyring = Overstyring & {
    __typename?: 'Arbeidsforholdoverstyring';
    begrunnelse: Scalars['String'];
    deaktivert: Scalars['Boolean'];
    forklaring: Scalars['String'];
    hendelseId: Scalars['String'];
    saksbehandler: Saksbehandler;
    skjaeringstidspunkt: Scalars['String'];
    timestamp: Scalars['String'];
};

export type Arbeidsgiver = {
    __typename?: 'Arbeidsgiver';
    arbeidsforhold: Array<Arbeidsforhold>;
    bransjer: Array<Scalars['String']>;
    generasjoner: Array<Generasjon>;
    ghostPerioder: Array<GhostPeriode>;
    navn: Scalars['String'];
    organisasjonsnummer: Scalars['String'];
    overstyringer: Array<Overstyring>;
};

export type Arbeidsgiverinntekt = {
    __typename?: 'Arbeidsgiverinntekt';
    arbeidsgiver: Scalars['String'];
    deaktivert?: Maybe<Scalars['Boolean']>;
    omregnetArsinntekt?: Maybe<OmregnetArsinntekt>;
    sammenligningsgrunnlag?: Maybe<Sammenligningsgrunnlag>;
};

export type Arbeidsgiveroppdrag = Spennoppdrag & {
    __typename?: 'Arbeidsgiveroppdrag';
    fagsystemId: Scalars['String'];
    linjer: Array<Utbetalingslinje>;
    organisasjonsnummer: Scalars['String'];
};

export enum Begrunnelse {
    EgenmeldingUtenforArbeidsgiverperiode = 'EGENMELDING_UTENFOR_ARBEIDSGIVERPERIODE',
    EtterDodsdato = 'ETTER_DODSDATO',
    ManglerMedlemskap = 'MANGLER_MEDLEMSKAP',
    ManglerOpptjening = 'MANGLER_OPPTJENING',
    MinimumInntekt = 'MINIMUM_INNTEKT',
    MinimumInntektOver_67 = 'MINIMUM_INNTEKT_OVER_67',
    MinimumSykdomsgrad = 'MINIMUM_SYKDOMSGRAD',
    Over_70 = 'OVER_70',
    SykepengedagerOppbrukt = 'SYKEPENGEDAGER_OPPBRUKT',
    SykepengedagerOppbruktOver_67 = 'SYKEPENGEDAGER_OPPBRUKT_OVER_67',
    Ukjent = 'UKJENT',
}

export type Behandlingsstatistikk = {
    __typename?: 'Behandlingsstatistikk';
    antallAnnulleringer: Scalars['Int'];
    beslutter: Antall;
    delvisRefusjon: Antall;
    enArbeidsgiver: Antall;
    faresignaler: Antall;
    flereArbeidsgivere: Antall;
    forlengelseIt: Antall;
    forlengelser: Antall;
    forstegangsbehandling: Antall;
    fortroligAdresse: Antall;
    revurdering: Antall;
    stikkprover: Antall;
    utbetalingTilArbeidsgiver: Antall;
    utbetalingTilSykmeldt: Antall;
};

export type BeregnetPeriode = Periode & {
    __typename?: 'BeregnetPeriode';
    aktivitetslogg: Array<Aktivitet>;
    beregningId: Scalars['String'];
    /** @deprecated erBeslutterOppgave bør hentes fra periodens oppgave */
    erBeslutterOppgave: Scalars['Boolean'];
    erForkastet: Scalars['Boolean'];
    /** @deprecated erReturOppgave bør hentes fra periodens oppgave */
    erReturOppgave: Scalars['Boolean'];
    fom: Scalars['String'];
    forbrukteSykedager?: Maybe<Scalars['Int']>;
    gjenstaendeSykedager?: Maybe<Scalars['Int']>;
    hendelser: Array<Hendelse>;
    id: Scalars['String'];
    inntektstype: Inntektstype;
    maksdato: Scalars['String'];
    notater: Array<Notat>;
    oppgave?: Maybe<OppgaveForPeriodevisning>;
    /** @deprecated Oppgavereferanse bør hentes fra periodens oppgave */
    oppgavereferanse?: Maybe<Scalars['String']>;
    opprettet: Scalars['String'];
    periodehistorikk: Array<PeriodeHistorikkElement>;
    periodetilstand: Periodetilstand;
    periodetype: Periodetype;
    periodevilkar: Periodevilkar;
    refusjon?: Maybe<Refusjon>;
    risikovurdering?: Maybe<Risikovurdering>;
    skjaeringstidspunkt: Scalars['String'];
    /** @deprecated tidligereSaksbehandlerOid bør hentes fra periodens oppgave */
    tidligereSaksbehandlerOid?: Maybe<Scalars['String']>;
    tidslinje: Array<Dag>;
    tom: Scalars['String'];
    /** @deprecated trengerTotrinnsvurdering bør hentes fra periodens oppgave */
    trengerTotrinnsvurdering: Scalars['Boolean'];
    utbetaling: Utbetaling;
    varsler: Array<Scalars['String']>;
    vedtaksperiodeId: Scalars['String'];
    vilkarsgrunnlaghistorikkId: Scalars['String'];
};

export type Boenhet = {
    __typename?: 'Boenhet';
    id: Scalars['String'];
    navn: Scalars['String'];
};

export type Dag = {
    __typename?: 'Dag';
    begrunnelser?: Maybe<Array<Begrunnelse>>;
    dato: Scalars['String'];
    grad?: Maybe<Scalars['Float']>;
    kilde: Kilde;
    sykdomsdagtype: Sykdomsdagtype;
    utbetalingsdagtype: Utbetalingsdagtype;
    utbetalingsinfo?: Maybe<Utbetalingsinfo>;
};

export type Dagoverstyring = Overstyring & {
    __typename?: 'Dagoverstyring';
    begrunnelse: Scalars['String'];
    dager: Array<OverstyrtDag>;
    hendelseId: Scalars['String'];
    saksbehandler: Saksbehandler;
    timestamp: Scalars['String'];
};

export enum Dagtype {
    Egenmeldingsdag = 'Egenmeldingsdag',
    Feriedag = 'Feriedag',
    Permisjonsdag = 'Permisjonsdag',
    Sykedag = 'Sykedag',
}

export type Endring = {
    __typename?: 'Endring';
    belop: Scalars['Float'];
    dato: Scalars['String'];
};

export type Enhet = {
    __typename?: 'Enhet';
    id: Scalars['String'];
    navn: Scalars['String'];
};

export type Faresignal = {
    __typename?: 'Faresignal';
    beskrivelse: Scalars['String'];
    kategori: Array<Scalars['String']>;
};

export type Generasjon = {
    __typename?: 'Generasjon';
    id: Scalars['String'];
    perioder: Array<Periode>;
};

export type GhostPeriode = {
    __typename?: 'GhostPeriode';
    deaktivert: Scalars['Boolean'];
    fom: Scalars['String'];
    id: Scalars['String'];
    organisasjonsnummer: Scalars['String'];
    skjaeringstidspunkt: Scalars['String'];
    tom: Scalars['String'];
    vilkarsgrunnlaghistorikkId?: Maybe<Scalars['String']>;
};

export type Hendelse = {
    id: Scalars['String'];
    type: Hendelsetype;
};

export enum Hendelsetype {
    Inntektsmelding = 'INNTEKTSMELDING',
    NySoknad = 'NY_SOKNAD',
    SendtSoknadArbeidsgiver = 'SENDT_SOKNAD_ARBEIDSGIVER',
    SendtSoknadNav = 'SENDT_SOKNAD_NAV',
    Ukjent = 'UKJENT',
}

export type Infotrygdutbetaling = {
    __typename?: 'Infotrygdutbetaling';
    dagsats: Scalars['Float'];
    fom: Scalars['String'];
    grad: Scalars['String'];
    organisasjonsnummer: Scalars['String'];
    tom: Scalars['String'];
    typetekst: Scalars['String'];
};

export type InntektFraAOrdningen = {
    __typename?: 'InntektFraAOrdningen';
    maned: Scalars['String'];
    sum: Scalars['Float'];
};

export type Inntektoverstyring = Overstyring & {
    __typename?: 'Inntektoverstyring';
    begrunnelse: Scalars['String'];
    hendelseId: Scalars['String'];
    inntekt: OverstyrtInntekt;
    saksbehandler: Saksbehandler;
    timestamp: Scalars['String'];
};

export enum Inntektskilde {
    Aordningen = 'AORDNINGEN',
    IkkeRapportert = 'IKKE_RAPPORTERT',
    Infotrygd = 'INFOTRYGD',
    Inntektsmelding = 'INNTEKTSMELDING',
    Saksbehandler = 'SAKSBEHANDLER',
}

export type Inntektsmelding = Hendelse & {
    __typename?: 'Inntektsmelding';
    beregnetInntekt: Scalars['Float'];
    id: Scalars['String'];
    mottattDato: Scalars['String'];
    type: Hendelsetype;
};

export enum Inntektstype {
    Enarbeidsgiver = 'ENARBEIDSGIVER',
    Flerearbeidsgivere = 'FLEREARBEIDSGIVERE',
}

export type Kilde = {
    __typename?: 'Kilde';
    id: Scalars['String'];
    type: Kildetype;
};

export enum Kildetype {
    Inntektsmelding = 'INNTEKTSMELDING',
    Saksbehandler = 'SAKSBEHANDLER',
    Soknad = 'SOKNAD',
    Sykmelding = 'SYKMELDING',
    Ukjent = 'UKJENT',
}

export enum Kjonn {
    Kvinne = 'Kvinne',
    Mann = 'Mann',
    Ukjent = 'Ukjent',
}

export type Notat = {
    __typename?: 'Notat';
    feilregistrert: Scalars['Boolean'];
    feilregistrert_tidspunkt?: Maybe<Scalars['String']>;
    id: Scalars['Int'];
    opprettet: Scalars['String'];
    saksbehandlerEpost: Scalars['String'];
    saksbehandlerIdent: Scalars['String'];
    saksbehandlerNavn: Scalars['String'];
    saksbehandlerOid: Scalars['String'];
    tekst: Scalars['String'];
    type: NotatType;
    vedtaksperiodeId: Scalars['String'];
};

export enum NotatType {
    Generelt = 'Generelt',
    PaaVent = 'PaaVent',
    Retur = 'Retur',
}

export type OmregnetArsinntekt = {
    __typename?: 'OmregnetArsinntekt';
    belop: Scalars['Float'];
    inntektFraAOrdningen?: Maybe<Array<InntektFraAOrdningen>>;
    kilde: Inntektskilde;
    manedsbelop: Scalars['Float'];
};

export type Oppdrag = {
    __typename?: 'Oppdrag';
    annullering?: Maybe<Annullering>;
    arbeidsgiveroppdrag?: Maybe<Arbeidsgiveroppdrag>;
    personoppdrag?: Maybe<Personoppdrag>;
    status: Oppdragsstatus;
    totalbelop?: Maybe<Scalars['Int']>;
    type: Scalars['String'];
};

export enum Oppdragsstatus {
    Annullert = 'ANNULLERT',
    Forkastet = 'FORKASTET',
    Godkjent = 'GODKJENT',
    GodkjentUtenUtbetaling = 'GODKJENT_UTEN_UTBETALING',
    IkkeGodkjent = 'IKKE_GODKJENT',
    IkkeUtbetalt = 'IKKE_UTBETALT',
    Ny = 'NY',
    Overfort = 'OVERFORT',
    Sendt = 'SENDT',
    UtbetalingFeilet = 'UTBETALING_FEILET',
    Utbetalt = 'UTBETALT',
}

export type OppgaveForOversiktsvisning = {
    __typename?: 'OppgaveForOversiktsvisning';
    aktorId: Scalars['String'];
    antallVarsler: Scalars['Int'];
    boenhet: Boenhet;
    erBeslutter: Scalars['Boolean'];
    erRetur: Scalars['Boolean'];
    flereArbeidsgivere: Scalars['Boolean'];
    fodselsnummer: Scalars['String'];
    id: Scalars['String'];
    opprettet: Scalars['String'];
    periodetype?: Maybe<Periodetype>;
    personinfo: Personinfo;
    tidligereSaksbehandler?: Maybe<Scalars['String']>;
    tildeling?: Maybe<Tildeling>;
    trengerTotrinnsvurdering: Scalars['Boolean'];
    type: Oppgavetype;
    vedtaksperiodeId: Scalars['String'];
};

export type OppgaveForPeriodevisning = {
    __typename?: 'OppgaveForPeriodevisning';
    erBeslutter: Scalars['Boolean'];
    erRetur: Scalars['Boolean'];
    id: Scalars['String'];
    tidligereSaksbehandler?: Maybe<Scalars['String']>;
    trengerTotrinnsvurdering: Scalars['Boolean'];
};

export type Oppgaver = {
    __typename?: 'Oppgaver';
    oppgaver: Array<OppgaveForOversiktsvisning>;
    paginering: Paginering;
};

export enum Oppgavetype {
    DelvisRefusjon = 'DELVIS_REFUSJON',
    FortroligAdresse = 'FORTROLIG_ADRESSE',
    Revurdering = 'REVURDERING',
    RiskQa = 'RISK_QA',
    Soknad = 'SOKNAD',
    Stikkprove = 'STIKKPROVE',
    UtbetalingTilSykmeldt = 'UTBETALING_TIL_SYKMELDT',
}

export type Overstyring = {
    begrunnelse: Scalars['String'];
    hendelseId: Scalars['String'];
    saksbehandler: Saksbehandler;
    timestamp: Scalars['String'];
};

export type OverstyrtDag = {
    __typename?: 'OverstyrtDag';
    dato: Scalars['String'];
    grad?: Maybe<Scalars['Int']>;
    type: Dagtype;
};

export type OverstyrtInntekt = {
    __typename?: 'OverstyrtInntekt';
    forklaring: Scalars['String'];
    manedligInntekt: Scalars['Float'];
    skjaeringstidspunkt: Scalars['String'];
};

export type Paginering = {
    __typename?: 'Paginering';
    antallSider: Scalars['Int'];
    elementerPerSide: Scalars['Int'];
    peker?: Maybe<Scalars['String']>;
    side: Scalars['Int'];
};

export type Periode = {
    erForkastet: Scalars['Boolean'];
    fom: Scalars['String'];
    inntektstype: Inntektstype;
    opprettet: Scalars['String'];
    periodetilstand: Periodetilstand;
    periodetype: Periodetype;
    skjaeringstidspunkt: Scalars['String'];
    tidslinje: Array<Dag>;
    tom: Scalars['String'];
    vedtaksperiodeId: Scalars['String'];
};

export type PeriodeHistorikkElement = {
    __typename?: 'PeriodeHistorikkElement';
    notat_id?: Maybe<Scalars['Int']>;
    saksbehandler_ident: Scalars['String'];
    timestamp: Scalars['String'];
    type: PeriodehistorikkType;
};

export enum PeriodehistorikkType {
    TotrinnsvurderingAttestert = 'TOTRINNSVURDERING_ATTESTERT',
    TotrinnsvurderingRetur = 'TOTRINNSVURDERING_RETUR',
    TotrinnsvurderingTilGodkjenning = 'TOTRINNSVURDERING_TIL_GODKJENNING',
}

export enum Periodetilstand {
    AnnulleringFeilet = 'AnnulleringFeilet',
    Annullert = 'Annullert',
    ForberederGodkjenning = 'ForberederGodkjenning',
    IngenUtbetaling = 'IngenUtbetaling',
    ManglerInformasjon = 'ManglerInformasjon',
    RevurderingFeilet = 'RevurderingFeilet',
    TilAnnullering = 'TilAnnullering',
    TilGodkjenning = 'TilGodkjenning',
    TilInfotrygd = 'TilInfotrygd',
    TilUtbetaling = 'TilUtbetaling',
    Ukjent = 'Ukjent',
    UtbetalingFeilet = 'UtbetalingFeilet',
    Utbetalt = 'Utbetalt',
    VenterPaEnAnnenPeriode = 'VenterPaEnAnnenPeriode',
}

export enum Periodetype {
    Forlengelse = 'FORLENGELSE',
    Forstegangsbehandling = 'FORSTEGANGSBEHANDLING',
    Infotrygdforlengelse = 'INFOTRYGDFORLENGELSE',
    OvergangFraIt = 'OVERGANG_FRA_IT',
}

export type Periodevilkar = {
    __typename?: 'Periodevilkar';
    alder: Alder;
    soknadsfrist?: Maybe<Soknadsfrist>;
    sykepengedager: Sykepengedager;
};

export type Person = {
    __typename?: 'Person';
    aktorId: Scalars['String'];
    arbeidsgivere: Array<Arbeidsgiver>;
    dodsdato?: Maybe<Scalars['String']>;
    enhet: Enhet;
    fodselsnummer: Scalars['String'];
    infotrygdutbetalinger?: Maybe<Array<Infotrygdutbetaling>>;
    personinfo: Personinfo;
    tildeling?: Maybe<Tildeling>;
    versjon: Scalars['Int'];
    vilkarsgrunnlaghistorikk: Array<Vilkarsgrunnlaghistorikk>;
};

export type Personinfo = {
    __typename?: 'Personinfo';
    adressebeskyttelse: Adressebeskyttelse;
    etternavn: Scalars['String'];
    fodselsdato?: Maybe<Scalars['String']>;
    fornavn: Scalars['String'];
    kjonn?: Maybe<Kjonn>;
    mellomnavn?: Maybe<Scalars['String']>;
    reservasjon?: Maybe<Reservasjon>;
};

export type Personoppdrag = Spennoppdrag & {
    __typename?: 'Personoppdrag';
    fagsystemId: Scalars['String'];
    fodselsnummer: Scalars['String'];
    linjer: Array<Utbetalingslinje>;
};

export type Query = {
    __typename?: 'Query';
    behandlingsstatistikk: Behandlingsstatistikk;
    oppdrag: Array<Oppdrag>;
    oppgaver: Oppgaver;
    person?: Maybe<Person>;
};

export type QueryOppdragArgs = {
    fnr: Scalars['String'];
};

export type QueryOppgaverArgs = {
    after?: InputMaybe<Scalars['String']>;
    first: Scalars['Int'];
};

export type QueryPersonArgs = {
    aktorId?: InputMaybe<Scalars['String']>;
    fnr?: InputMaybe<Scalars['String']>;
};

export type Refusjon = {
    __typename?: 'Refusjon';
    arbeidsgiverperioder: Array<Refusjonsperiode>;
    belop?: Maybe<Scalars['Float']>;
    endringer: Array<Endring>;
    forsteFravaersdag?: Maybe<Scalars['String']>;
    sisteRefusjonsdag?: Maybe<Scalars['String']>;
};

export type Refusjonsperiode = {
    __typename?: 'Refusjonsperiode';
    fom: Scalars['String'];
    tom: Scalars['String'];
};

export type Reservasjon = {
    __typename?: 'Reservasjon';
    kanVarsles: Scalars['Boolean'];
    reservert: Scalars['Boolean'];
};

export type Risikovurdering = {
    __typename?: 'Risikovurdering';
    funn?: Maybe<Array<Faresignal>>;
    kontrollertOk: Array<Faresignal>;
};

export type Saksbehandler = {
    __typename?: 'Saksbehandler';
    ident?: Maybe<Scalars['String']>;
    navn: Scalars['String'];
};

export type Sammenligningsgrunnlag = {
    __typename?: 'Sammenligningsgrunnlag';
    belop: Scalars['Float'];
    inntektFraAOrdningen: Array<InntektFraAOrdningen>;
};

export type Simulering = {
    __typename?: 'Simulering';
    fagsystemId: Scalars['String'];
    perioder?: Maybe<Array<Simuleringsperiode>>;
    tidsstempel: Scalars['String'];
    totalbelop?: Maybe<Scalars['Int']>;
    utbetalingslinjer: Array<Simuleringslinje>;
};

export type Simuleringsdetaljer = {
    __typename?: 'Simuleringsdetaljer';
    antallSats: Scalars['Int'];
    belop: Scalars['Int'];
    fom: Scalars['String'];
    klassekode: Scalars['String'];
    klassekodebeskrivelse: Scalars['String'];
    konto: Scalars['String'];
    refunderesOrgNr: Scalars['String'];
    sats: Scalars['Float'];
    tilbakeforing: Scalars['Boolean'];
    tom: Scalars['String'];
    typeSats: Scalars['String'];
    uforegrad: Scalars['Int'];
    utbetalingstype: Scalars['String'];
};

export type Simuleringslinje = {
    __typename?: 'Simuleringslinje';
    dagsats: Scalars['Int'];
    fom: Scalars['String'];
    grad: Scalars['Int'];
    tom: Scalars['String'];
};

export type Simuleringsperiode = {
    __typename?: 'Simuleringsperiode';
    fom: Scalars['String'];
    tom: Scalars['String'];
    utbetalinger: Array<Simuleringsutbetaling>;
};

export type Simuleringsutbetaling = {
    __typename?: 'Simuleringsutbetaling';
    detaljer: Array<Simuleringsdetaljer>;
    feilkonto: Scalars['Boolean'];
    forfall: Scalars['String'];
    mottakerId: Scalars['String'];
    mottakerNavn: Scalars['String'];
};

export type SoknadArbeidsgiver = Hendelse & {
    __typename?: 'SoknadArbeidsgiver';
    fom: Scalars['String'];
    id: Scalars['String'];
    rapportertDato: Scalars['String'];
    sendtArbeidsgiver: Scalars['String'];
    tom: Scalars['String'];
    type: Hendelsetype;
};

export type SoknadNav = Hendelse & {
    __typename?: 'SoknadNav';
    fom: Scalars['String'];
    id: Scalars['String'];
    rapportertDato: Scalars['String'];
    sendtNav: Scalars['String'];
    tom: Scalars['String'];
    type: Hendelsetype;
};

export type Soknadsfrist = {
    __typename?: 'Soknadsfrist';
    oppfylt: Scalars['Boolean'];
    sendtNav: Scalars['String'];
    soknadFom: Scalars['String'];
    soknadTom: Scalars['String'];
};

export type Spennoppdrag = {
    fagsystemId: Scalars['String'];
    linjer: Array<Utbetalingslinje>;
};

export enum Sykdomsdagtype {
    Arbeidsdag = 'ARBEIDSDAG',
    Arbeidsgiverdag = 'ARBEIDSGIVERDAG',
    Avslatt = 'AVSLATT',
    Feriedag = 'FERIEDAG',
    ForeldetSykedag = 'FORELDET_SYKEDAG',
    FriskHelgedag = 'FRISK_HELGEDAG',
    Permisjonsdag = 'PERMISJONSDAG',
    Sykedag = 'SYKEDAG',
    SykHelgedag = 'SYK_HELGEDAG',
    Ubestemtdag = 'UBESTEMTDAG',
}

export type Sykepengedager = {
    __typename?: 'Sykepengedager';
    forbrukteSykedager?: Maybe<Scalars['Int']>;
    gjenstaendeSykedager?: Maybe<Scalars['Int']>;
    maksdato: Scalars['String'];
    oppfylt: Scalars['Boolean'];
    skjaeringstidspunkt: Scalars['String'];
};

export type Sykepengegrunnlagsgrense = {
    __typename?: 'Sykepengegrunnlagsgrense';
    grense: Scalars['Int'];
    grunnbelop: Scalars['Int'];
    virkningstidspunkt: Scalars['String'];
};

export type Sykmelding = Hendelse & {
    __typename?: 'Sykmelding';
    fom: Scalars['String'];
    id: Scalars['String'];
    rapportertDato: Scalars['String'];
    tom: Scalars['String'];
    type: Hendelsetype;
};

export type Tildeling = {
    __typename?: 'Tildeling';
    epost: Scalars['String'];
    navn: Scalars['String'];
    oid: Scalars['String'];
    reservert: Scalars['Boolean'];
};

export type UberegnetPeriode = Periode & {
    __typename?: 'UberegnetPeriode';
    erForkastet: Scalars['Boolean'];
    fom: Scalars['String'];
    id: Scalars['String'];
    inntektstype: Inntektstype;
    opprettet: Scalars['String'];
    periodetilstand: Periodetilstand;
    periodetype: Periodetype;
    skjaeringstidspunkt: Scalars['String'];
    tidslinje: Array<Dag>;
    tom: Scalars['String'];
    vedtaksperiodeId: Scalars['String'];
};

export type Utbetaling = {
    __typename?: 'Utbetaling';
    arbeidsgiverFagsystemId: Scalars['String'];
    arbeidsgiverNettoBelop: Scalars['Int'];
    arbeidsgiversimulering?: Maybe<Simulering>;
    id: Scalars['String'];
    personFagsystemId: Scalars['String'];
    personNettoBelop: Scalars['Int'];
    personsimulering?: Maybe<Simulering>;
    status: Utbetalingstatus;
    type: Utbetalingtype;
    vurdering?: Maybe<Vurdering>;
};

export enum Utbetalingsdagtype {
    Arbeidsdag = 'ARBEIDSDAG',
    Arbeidsgiverperiodedag = 'ARBEIDSGIVERPERIODEDAG',
    AvvistDag = 'AVVIST_DAG',
    Feriedag = 'FERIEDAG',
    ForeldetDag = 'FORELDET_DAG',
    Helgedag = 'HELGEDAG',
    Navdag = 'NAVDAG',
    Navhelgdag = 'NAVHELGDAG',
    UkjentDag = 'UKJENT_DAG',
}

export type Utbetalingsinfo = {
    __typename?: 'Utbetalingsinfo';
    arbeidsgiverbelop?: Maybe<Scalars['Int']>;
    inntekt?: Maybe<Scalars['Int']>;
    personbelop?: Maybe<Scalars['Int']>;
    refusjonsbelop?: Maybe<Scalars['Int']>;
    totalGrad?: Maybe<Scalars['Float']>;
    utbetaling?: Maybe<Scalars['Int']>;
};

export type Utbetalingslinje = {
    __typename?: 'Utbetalingslinje';
    fom: Scalars['String'];
    tom: Scalars['String'];
    totalbelop: Scalars['Int'];
};

export enum Utbetalingstatus {
    Annullert = 'ANNULLERT',
    Forkastet = 'FORKASTET',
    Godkjent = 'GODKJENT',
    Godkjentutenutbetaling = 'GODKJENTUTENUTBETALING',
    Ikkegodkjent = 'IKKEGODKJENT',
    Overfort = 'OVERFORT',
    Sendt = 'SENDT',
    Ubetalt = 'UBETALT',
    Ukjent = 'UKJENT',
    Utbetalingfeilet = 'UTBETALINGFEILET',
    Utbetalt = 'UTBETALT',
}

export enum Utbetalingtype {
    Annullering = 'ANNULLERING',
    Etterutbetaling = 'ETTERUTBETALING',
    Feriepenger = 'FERIEPENGER',
    Revurdering = 'REVURDERING',
    Ukjent = 'UKJENT',
    Utbetaling = 'UTBETALING',
}

export type Vilkarsgrunnlag = {
    inntekter: Array<Arbeidsgiverinntekt>;
    omregnetArsinntekt: Scalars['Float'];
    sammenligningsgrunnlag?: Maybe<Scalars['Float']>;
    skjaeringstidspunkt: Scalars['String'];
    sykepengegrunnlag: Scalars['Float'];
    vilkarsgrunnlagtype: Vilkarsgrunnlagtype;
};

export type VilkarsgrunnlagInfotrygd = Vilkarsgrunnlag & {
    __typename?: 'VilkarsgrunnlagInfotrygd';
    inntekter: Array<Arbeidsgiverinntekt>;
    omregnetArsinntekt: Scalars['Float'];
    sammenligningsgrunnlag?: Maybe<Scalars['Float']>;
    skjaeringstidspunkt: Scalars['String'];
    sykepengegrunnlag: Scalars['Float'];
    vilkarsgrunnlagtype: Vilkarsgrunnlagtype;
};

export type VilkarsgrunnlagSpleis = Vilkarsgrunnlag & {
    __typename?: 'VilkarsgrunnlagSpleis';
    antallOpptjeningsdagerErMinst: Scalars['Int'];
    avviksprosent?: Maybe<Scalars['Float']>;
    grunnbelop: Scalars['Int'];
    inntekter: Array<Arbeidsgiverinntekt>;
    omregnetArsinntekt: Scalars['Float'];
    oppfyllerKravOmMedlemskap?: Maybe<Scalars['Boolean']>;
    oppfyllerKravOmMinstelonn: Scalars['Boolean'];
    oppfyllerKravOmOpptjening: Scalars['Boolean'];
    opptjeningFra: Scalars['String'];
    sammenligningsgrunnlag?: Maybe<Scalars['Float']>;
    skjaeringstidspunkt: Scalars['String'];
    sykepengegrunnlag: Scalars['Float'];
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    vilkarsgrunnlagtype: Vilkarsgrunnlagtype;
};

export type Vilkarsgrunnlaghistorikk = {
    __typename?: 'Vilkarsgrunnlaghistorikk';
    grunnlag: Array<Vilkarsgrunnlag>;
    id: Scalars['String'];
};

export enum Vilkarsgrunnlagtype {
    Infotrygd = 'INFOTRYGD',
    Spleis = 'SPLEIS',
    Ukjent = 'UKJENT',
}

export type Vurdering = {
    __typename?: 'Vurdering';
    automatisk: Scalars['Boolean'];
    godkjent: Scalars['Boolean'];
    ident: Scalars['String'];
    tidsstempel: Scalars['String'];
};

export type AntallFragment = { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };

export type HentBehandlingsstatistikkQueryVariables = Exact<{ [key: string]: never }>;

export type HentBehandlingsstatistikkQuery = {
    __typename?: 'Query';
    behandlingsstatistikk: {
        __typename?: 'Behandlingsstatistikk';
        antallAnnulleringer: number;
        enArbeidsgiver: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        flereArbeidsgivere: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        beslutter: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        delvisRefusjon: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        faresignaler: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        forlengelser: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        forlengelseIt: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        forstegangsbehandling: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        fortroligAdresse: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        revurdering: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        stikkprover: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        utbetalingTilArbeidsgiver: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
        utbetalingTilSykmeldt: { __typename?: 'Antall'; automatisk: number; manuelt: number; tilgjengelig: number };
    };
};

export type FetchOppdragQueryVariables = Exact<{
    fnr: Scalars['String'];
}>;

export type FetchOppdragQuery = {
    __typename?: 'Query';
    oppdrag: Array<{
        __typename?: 'Oppdrag';
        type: string;
        status: Oppdragsstatus;
        arbeidsgiveroppdrag?: {
            __typename?: 'Arbeidsgiveroppdrag';
            organisasjonsnummer: string;
            fagsystemId: string;
            linjer: Array<{ __typename?: 'Utbetalingslinje'; fom: string; tom: string; totalbelop: number }>;
        } | null;
        personoppdrag?: {
            __typename?: 'Personoppdrag';
            fodselsnummer: string;
            fagsystemId: string;
            linjer: Array<{ __typename?: 'Utbetalingslinje'; fom: string; tom: string; totalbelop: number }>;
        } | null;
        annullering?: { __typename?: 'Annullering'; saksbehandler: string; tidspunkt: string } | null;
    }>;
};

export type SimuleringFragment = {
    __typename?: 'Simulering';
    fagsystemId: string;
    totalbelop?: number | null;
    tidsstempel: string;
    utbetalingslinjer: Array<{
        __typename?: 'Simuleringslinje';
        fom: string;
        tom: string;
        dagsats: number;
        grad: number;
    }>;
    perioder?: Array<{
        __typename?: 'Simuleringsperiode';
        fom: string;
        tom: string;
        utbetalinger: Array<{
            __typename?: 'Simuleringsutbetaling';
            mottakerId: string;
            mottakerNavn: string;
            forfall: string;
            feilkonto: boolean;
            detaljer: Array<{
                __typename?: 'Simuleringsdetaljer';
                fom: string;
                tom: string;
                utbetalingstype: string;
                uforegrad: number;
                typeSats: string;
                tilbakeforing: boolean;
                sats: number;
                refunderesOrgNr: string;
                konto: string;
                klassekode: string;
                antallSats: number;
                belop: number;
                klassekodebeskrivelse: string;
            }>;
        }>;
    }> | null;
};

export type FetchPersonQueryVariables = Exact<{
    fnr?: InputMaybe<Scalars['String']>;
    aktorId?: InputMaybe<Scalars['String']>;
}>;

export type FetchPersonQuery = {
    __typename?: 'Query';
    person?: {
        __typename?: 'Person';
        fodselsnummer: string;
        dodsdato?: string | null;
        versjon: number;
        aktorId: string;
        enhet: { __typename?: 'Enhet'; id: string; navn: string };
        infotrygdutbetalinger?: Array<{
            __typename?: 'Infotrygdutbetaling';
            organisasjonsnummer: string;
            dagsats: number;
            fom: string;
            tom: string;
            grad: string;
            typetekst: string;
        }> | null;
        personinfo: {
            __typename?: 'Personinfo';
            fornavn: string;
            mellomnavn?: string | null;
            etternavn: string;
            adressebeskyttelse: Adressebeskyttelse;
            fodselsdato?: string | null;
            kjonn?: Kjonn | null;
            reservasjon?: { __typename?: 'Reservasjon'; kanVarsles: boolean; reservert: boolean } | null;
        };
        tildeling?: { __typename?: 'Tildeling'; navn: string; epost: string; oid: string; reservert: boolean } | null;
        vilkarsgrunnlaghistorikk: Array<{
            __typename?: 'Vilkarsgrunnlaghistorikk';
            id: string;
            grunnlag: Array<
                | {
                      __typename?: 'VilkarsgrunnlagInfotrygd';
                      sykepengegrunnlag: number;
                      skjaeringstidspunkt: string;
                      omregnetArsinntekt: number;
                      sammenligningsgrunnlag?: number | null;
                      vilkarsgrunnlagtype: Vilkarsgrunnlagtype;
                      inntekter: Array<{
                          __typename?: 'Arbeidsgiverinntekt';
                          arbeidsgiver: string;
                          deaktivert?: boolean | null;
                          sammenligningsgrunnlag?: {
                              __typename?: 'Sammenligningsgrunnlag';
                              belop: number;
                              inntektFraAOrdningen: Array<{
                                  __typename?: 'InntektFraAOrdningen';
                                  maned: string;
                                  sum: number;
                              }>;
                          } | null;
                          omregnetArsinntekt?: {
                              __typename?: 'OmregnetArsinntekt';
                              belop: number;
                              manedsbelop: number;
                              kilde: Inntektskilde;
                              inntektFraAOrdningen?: Array<{
                                  __typename?: 'InntektFraAOrdningen';
                                  maned: string;
                                  sum: number;
                              }> | null;
                          } | null;
                      }>;
                  }
                | {
                      __typename?: 'VilkarsgrunnlagSpleis';
                      oppfyllerKravOmMinstelonn: boolean;
                      oppfyllerKravOmMedlemskap?: boolean | null;
                      oppfyllerKravOmOpptjening: boolean;
                      antallOpptjeningsdagerErMinst: number;
                      grunnbelop: number;
                      avviksprosent?: number | null;
                      opptjeningFra: string;
                      sykepengegrunnlag: number;
                      skjaeringstidspunkt: string;
                      omregnetArsinntekt: number;
                      sammenligningsgrunnlag?: number | null;
                      vilkarsgrunnlagtype: Vilkarsgrunnlagtype;
                      sykepengegrunnlagsgrense: {
                          __typename?: 'Sykepengegrunnlagsgrense';
                          grunnbelop: number;
                          grense: number;
                          virkningstidspunkt: string;
                      };
                      inntekter: Array<{
                          __typename?: 'Arbeidsgiverinntekt';
                          arbeidsgiver: string;
                          deaktivert?: boolean | null;
                          sammenligningsgrunnlag?: {
                              __typename?: 'Sammenligningsgrunnlag';
                              belop: number;
                              inntektFraAOrdningen: Array<{
                                  __typename?: 'InntektFraAOrdningen';
                                  maned: string;
                                  sum: number;
                              }>;
                          } | null;
                          omregnetArsinntekt?: {
                              __typename?: 'OmregnetArsinntekt';
                              belop: number;
                              manedsbelop: number;
                              kilde: Inntektskilde;
                              inntektFraAOrdningen?: Array<{
                                  __typename?: 'InntektFraAOrdningen';
                                  maned: string;
                                  sum: number;
                              }> | null;
                          } | null;
                      }>;
                  }
            >;
        }>;
        arbeidsgivere: Array<{
            __typename?: 'Arbeidsgiver';
            bransjer: Array<string>;
            navn: string;
            organisasjonsnummer: string;
            arbeidsforhold: Array<{
                __typename?: 'Arbeidsforhold';
                sluttdato?: string | null;
                startdato: string;
                stillingsprosent: number;
                stillingstittel: string;
            }>;
            ghostPerioder: Array<{
                __typename?: 'GhostPeriode';
                id: string;
                deaktivert: boolean;
                vilkarsgrunnlaghistorikkId?: string | null;
                skjaeringstidspunkt: string;
                fom: string;
                tom: string;
                organisasjonsnummer: string;
            }>;
            generasjoner: Array<{
                __typename?: 'Generasjon';
                id: string;
                perioder: Array<
                    | {
                          __typename?: 'BeregnetPeriode';
                          id: string;
                          beregningId: string;
                          forbrukteSykedager?: number | null;
                          gjenstaendeSykedager?: number | null;
                          trengerTotrinnsvurdering: boolean;
                          erReturOppgave: boolean;
                          erBeslutterOppgave: boolean;
                          tidligereSaksbehandlerOid?: string | null;
                          maksdato: string;
                          varsler: Array<string>;
                          vilkarsgrunnlaghistorikkId: string;
                          oppgavereferanse?: string | null;
                          fom: string;
                          tom: string;
                          erForkastet: boolean;
                          inntektstype: Inntektstype;
                          opprettet: string;
                          periodetype: Periodetype;
                          vedtaksperiodeId: string;
                          periodetilstand: Periodetilstand;
                          skjaeringstidspunkt: string;
                          aktivitetslogg: Array<{
                              __typename?: 'Aktivitet';
                              alvorlighetsgrad: string;
                              melding: string;
                              tidsstempel: string;
                              vedtaksperiodeId: string;
                          }>;
                          notater: Array<{
                              __typename?: 'Notat';
                              id: number;
                              tekst: string;
                              opprettet: string;
                              saksbehandlerOid: string;
                              saksbehandlerNavn: string;
                              saksbehandlerEpost: string;
                              saksbehandlerIdent: string;
                              vedtaksperiodeId: string;
                              feilregistrert: boolean;
                              feilregistrert_tidspunkt?: string | null;
                              type: NotatType;
                          }>;
                          periodehistorikk: Array<{
                              __typename?: 'PeriodeHistorikkElement';
                              type: PeriodehistorikkType;
                              timestamp: string;
                              saksbehandler_ident: string;
                              notat_id?: number | null;
                          }>;
                          hendelser: Array<
                              | {
                                    __typename?: 'Inntektsmelding';
                                    beregnetInntekt: number;
                                    mottattDato: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename?: 'SoknadArbeidsgiver';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtArbeidsgiver: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename?: 'SoknadNav';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    sendtNav: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                              | {
                                    __typename?: 'Sykmelding';
                                    fom: string;
                                    tom: string;
                                    rapportertDato: string;
                                    id: string;
                                    type: Hendelsetype;
                                }
                          >;
                          periodevilkar: {
                              __typename?: 'Periodevilkar';
                              alder: { __typename?: 'Alder'; alderSisteSykedag: number; oppfylt: boolean };
                              soknadsfrist?: {
                                  __typename?: 'Soknadsfrist';
                                  oppfylt: boolean;
                                  sendtNav: string;
                                  soknadFom: string;
                                  soknadTom: string;
                              } | null;
                              sykepengedager: {
                                  __typename?: 'Sykepengedager';
                                  forbrukteSykedager?: number | null;
                                  gjenstaendeSykedager?: number | null;
                                  maksdato: string;
                                  oppfylt: boolean;
                                  skjaeringstidspunkt: string;
                              };
                          };
                          risikovurdering?: {
                              __typename?: 'Risikovurdering';
                              funn?: Array<{
                                  __typename?: 'Faresignal';
                                  beskrivelse: string;
                                  kategori: Array<string>;
                              }> | null;
                              kontrollertOk: Array<{
                                  __typename?: 'Faresignal';
                                  beskrivelse: string;
                                  kategori: Array<string>;
                              }>;
                          } | null;
                          utbetaling: {
                              __typename?: 'Utbetaling';
                              id: string;
                              arbeidsgiverFagsystemId: string;
                              arbeidsgiverNettoBelop: number;
                              personFagsystemId: string;
                              personNettoBelop: number;
                              status: Utbetalingstatus;
                              type: Utbetalingtype;
                              vurdering?: {
                                  __typename?: 'Vurdering';
                                  automatisk: boolean;
                                  godkjent: boolean;
                                  ident: string;
                                  tidsstempel: string;
                              } | null;
                              arbeidsgiversimulering?: {
                                  __typename?: 'Simulering';
                                  fagsystemId: string;
                                  totalbelop?: number | null;
                                  tidsstempel: string;
                                  utbetalingslinjer: Array<{
                                      __typename?: 'Simuleringslinje';
                                      fom: string;
                                      tom: string;
                                      dagsats: number;
                                      grad: number;
                                  }>;
                                  perioder?: Array<{
                                      __typename?: 'Simuleringsperiode';
                                      fom: string;
                                      tom: string;
                                      utbetalinger: Array<{
                                          __typename?: 'Simuleringsutbetaling';
                                          mottakerId: string;
                                          mottakerNavn: string;
                                          forfall: string;
                                          feilkonto: boolean;
                                          detaljer: Array<{
                                              __typename?: 'Simuleringsdetaljer';
                                              fom: string;
                                              tom: string;
                                              utbetalingstype: string;
                                              uforegrad: number;
                                              typeSats: string;
                                              tilbakeforing: boolean;
                                              sats: number;
                                              refunderesOrgNr: string;
                                              konto: string;
                                              klassekode: string;
                                              antallSats: number;
                                              belop: number;
                                              klassekodebeskrivelse: string;
                                          }>;
                                      }>;
                                  }> | null;
                              } | null;
                              personsimulering?: {
                                  __typename?: 'Simulering';
                                  fagsystemId: string;
                                  totalbelop?: number | null;
                                  tidsstempel: string;
                                  utbetalingslinjer: Array<{
                                      __typename?: 'Simuleringslinje';
                                      fom: string;
                                      tom: string;
                                      dagsats: number;
                                      grad: number;
                                  }>;
                                  perioder?: Array<{
                                      __typename?: 'Simuleringsperiode';
                                      fom: string;
                                      tom: string;
                                      utbetalinger: Array<{
                                          __typename?: 'Simuleringsutbetaling';
                                          mottakerId: string;
                                          mottakerNavn: string;
                                          forfall: string;
                                          feilkonto: boolean;
                                          detaljer: Array<{
                                              __typename?: 'Simuleringsdetaljer';
                                              fom: string;
                                              tom: string;
                                              utbetalingstype: string;
                                              uforegrad: number;
                                              typeSats: string;
                                              tilbakeforing: boolean;
                                              sats: number;
                                              refunderesOrgNr: string;
                                              konto: string;
                                              klassekode: string;
                                              antallSats: number;
                                              belop: number;
                                              klassekodebeskrivelse: string;
                                          }>;
                                      }>;
                                  }> | null;
                              } | null;
                          };
                          refusjon?: {
                              __typename?: 'Refusjon';
                              sisteRefusjonsdag?: string | null;
                              forsteFravaersdag?: string | null;
                              belop?: number | null;
                              endringer: Array<{ __typename?: 'Endring'; dato: string; belop: number }>;
                              arbeidsgiverperioder: Array<{
                                  __typename?: 'Refusjonsperiode';
                                  fom: string;
                                  tom: string;
                              }>;
                          } | null;
                          tidslinje: Array<{
                              __typename?: 'Dag';
                              dato: string;
                              grad?: number | null;
                              sykdomsdagtype: Sykdomsdagtype;
                              utbetalingsdagtype: Utbetalingsdagtype;
                              begrunnelser?: Array<Begrunnelse> | null;
                              kilde: { __typename?: 'Kilde'; id: string; type: Kildetype };
                              utbetalingsinfo?: {
                                  __typename?: 'Utbetalingsinfo';
                                  arbeidsgiverbelop?: number | null;
                                  inntekt?: number | null;
                                  personbelop?: number | null;
                                  refusjonsbelop?: number | null;
                                  totalGrad?: number | null;
                                  utbetaling?: number | null;
                              } | null;
                          }>;
                      }
                    | {
                          __typename?: 'UberegnetPeriode';
                          id: string;
                          fom: string;
                          tom: string;
                          erForkastet: boolean;
                          inntektstype: Inntektstype;
                          opprettet: string;
                          periodetype: Periodetype;
                          vedtaksperiodeId: string;
                          periodetilstand: Periodetilstand;
                          skjaeringstidspunkt: string;
                          tidslinje: Array<{
                              __typename?: 'Dag';
                              dato: string;
                              grad?: number | null;
                              sykdomsdagtype: Sykdomsdagtype;
                              utbetalingsdagtype: Utbetalingsdagtype;
                              begrunnelser?: Array<Begrunnelse> | null;
                              kilde: { __typename?: 'Kilde'; id: string; type: Kildetype };
                              utbetalingsinfo?: {
                                  __typename?: 'Utbetalingsinfo';
                                  arbeidsgiverbelop?: number | null;
                                  inntekt?: number | null;
                                  personbelop?: number | null;
                                  refusjonsbelop?: number | null;
                                  totalGrad?: number | null;
                                  utbetaling?: number | null;
                              } | null;
                          }>;
                      }
                >;
            }>;
            overstyringer: Array<
                | {
                      __typename: 'Arbeidsforholdoverstyring';
                      deaktivert: boolean;
                      skjaeringstidspunkt: string;
                      forklaring: string;
                      begrunnelse: string;
                      hendelseId: string;
                      timestamp: string;
                      saksbehandler: { __typename?: 'Saksbehandler'; ident?: string | null; navn: string };
                  }
                | {
                      __typename: 'Dagoverstyring';
                      begrunnelse: string;
                      hendelseId: string;
                      timestamp: string;
                      dager: Array<{ __typename?: 'OverstyrtDag'; grad?: number | null; dato: string; type: Dagtype }>;
                      saksbehandler: { __typename?: 'Saksbehandler'; ident?: string | null; navn: string };
                  }
                | {
                      __typename: 'Inntektoverstyring';
                      begrunnelse: string;
                      hendelseId: string;
                      timestamp: string;
                      inntekt: {
                          __typename?: 'OverstyrtInntekt';
                          skjaeringstidspunkt: string;
                          forklaring: string;
                          manedligInntekt: number;
                      };
                      saksbehandler: { __typename?: 'Saksbehandler'; ident?: string | null; navn: string };
                  }
            >;
        }>;
    } | null;
};
