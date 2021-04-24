import {
    EksternUtbetalingshistorikkElement,
    SpesialistArbeidsgiver,
    SpesialistInntektsgrunnlag,
    SpesialistPerson,
} from 'external-types';
import { Arbeidsgiver, Utbetalingstype, Vedtaksperiode } from 'internal-types';
import dayjs from 'dayjs';
import { VedtaksperiodeBuilder } from './vedtaksperiode';
import { sykdomstidslinjedag, utbetalingstidslinjedag } from './dag';
import { utbetalingshistorikkelement, Utbetalingstatus } from '../modell/UtbetalingshistorikkElement';

export class ArbeidsgiverBuilder {
    private unmapped: SpesialistArbeidsgiver;
    private person: SpesialistPerson;
    private arbeidsgiver: Partial<Arbeidsgiver> = {};
    private inntektsgrunnlag: SpesialistInntektsgrunnlag[];
    private problems: Error[] = [];

    addPerson(person: SpesialistPerson) {
        this.person = person;
        return this;
    }

    addArbeidsgiver(arbeidsgiver: SpesialistArbeidsgiver) {
        this.unmapped = arbeidsgiver;
        return this;
    }

    addInntektsgrunnlag(inntektsgrunnlag: SpesialistInntektsgrunnlag[]) {
        this.inntektsgrunnlag = inntektsgrunnlag;
        return this;
    }

    build(): { arbeidsgiver?: Arbeidsgiver; problems: Error[] } {
        if (!this.unmapped) {
            this.problems.push(Error('Mangler arbeidsgiverdata å mappe'));
            return { problems: this.problems };
        }
        this.mapArbeidsgiverinfo();
        this.mapArbeidsforhold();
        this.mapVedtaksperioder();
        this.sortVedtaksperioder();
        this.markerNyestePeriode();
        this.mapUtbetalingshistorikk();
        return { arbeidsgiver: this.arbeidsgiver as Arbeidsgiver, problems: this.problems };
    }

    private mapArbeidsforhold = () => {
        this.arbeidsgiver = {
            ...this.arbeidsgiver,
            arbeidsforhold:
                this.person?.arbeidsforhold
                    ?.filter((it) => it.organisasjonsnummer === this.arbeidsgiver.organisasjonsnummer)
                    .map((it) => ({
                        stillingstittel: it.stillingstittel,
                        stillingsprosent: it.stillingsprosent,
                        startdato: dayjs(it.startdato),
                        sluttdato: it.sluttdato ? dayjs(it.sluttdato) : undefined,
                    })) ?? [],
        };
    };

    private markerNyestePeriode() {
        if (this.arbeidsgiver.vedtaksperioder?.length ?? -1 > 0) {
            this.arbeidsgiver.vedtaksperioder![0].erNyeste = true;
        }
    }

    private mapArbeidsgiverinfo = () => {
        this.arbeidsgiver = {
            ...this.arbeidsgiver,
            navn: this.unmapped.navn,
            id: this.unmapped.id,
            organisasjonsnummer: this.unmapped.organisasjonsnummer,
        };
    };

    private mapUtbetalingshistorikk = () => {
        this.arbeidsgiver = {
            ...this.arbeidsgiver,
            utbetalingshistorikk:
                this.unmapped.utbetalingshistorikk
                    ?.filter((it) => {
                        return this.arbeidsgiver.vedtaksperioder?.some((periode) =>
                            periode.beregningIder?.includes(it.beregningId)
                        );
                    })
                    .map((element: EksternUtbetalingshistorikkElement) => {
                        return utbetalingshistorikkelement(
                            element.beregningId,
                            element.beregnettidslinje.map((dag) => ({
                                dato: dayjs(dag.dagen),
                                type: sykdomstidslinjedag(dag.type),
                            })),
                            element.hendelsetidslinje.map((dag) => ({
                                dato: dayjs(dag.dagen),
                                type: sykdomstidslinjedag(dag.type),
                            })),
                            element.utbetalinger.map((utbetaling) => ({
                                status: this.utbetalingsstatus(utbetaling.status),
                                type: this.utbetalingstype(utbetaling.type),
                                utbetalingstidslinje: utbetaling.utbetalingstidslinje.map((dag) => ({
                                    dato: dayjs(dag.dato),
                                    type: utbetalingstidslinjedag(dag.type),
                                })),
                                maksdato: dayjs(utbetaling.maksdato),
                                gjenståendeDager: utbetaling.gjenståendeSykedager,
                                nettobeløp: utbetaling.arbeidsgiverNettoBeløp,
                                forbrukteDager: utbetaling.forbrukteSykedager,
                            })),
                            this.arbeidsgiver.vedtaksperioder ?? [],
                            this.arbeidsgiver.organisasjonsnummer!
                        );
                    }) ?? [],
        };
    };

    private mapVedtaksperioder = () => {
        this.arbeidsgiver.vedtaksperioder = this.unmapped.vedtaksperioder.map((unmappedVedtaksperiode, index) => {
            const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
                .setVedtaksperiode(unmappedVedtaksperiode)
                .setPerson(this.person)
                .setArbeidsgiver(this.unmapped)
                .setOverstyringer(this.unmapped.overstyringer)
                .setInntektsgrunnlag(this.inntektsgrunnlag)
                .build();
            this.problems.push(...problems);
            return vedtaksperiode as Vedtaksperiode;
        });
    };

    private sortVedtaksperioder = () => {
        const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();
        this.arbeidsgiver.vedtaksperioder?.sort(reversert);
    };

    private utbetalingstype = (type: string): Utbetalingstype => {
        switch (type.toUpperCase()) {
            case 'UTBETALING':
                return Utbetalingstype.UTBETALING;
            case 'ANNULLERING':
                return Utbetalingstype.ANNULLERING;
            case 'ETTERUTBETALING':
                return Utbetalingstype.ETTERUTBETALING;
            case 'REVURDERING':
                return Utbetalingstype.REVURDERING;
            default:
                return Utbetalingstype.UKJENT;
        }
    };

    private utbetalingsstatus = (type: string): Utbetalingstatus => {
        switch (type.toUpperCase()) {
            case 'IKKE_UTBETALT':
                return Utbetalingstatus.IKKE_UTBETALT;
            case 'UTBETALT':
                return Utbetalingstatus.UTBETALT;
            case 'INGEN_UTBETALING':
                return Utbetalingstatus.INGEN_UTBETALING;
            case 'UKJENT':
                return Utbetalingstatus.UKJENT;
            default:
                return Utbetalingstatus.UKJENT;
        }
    };
}
