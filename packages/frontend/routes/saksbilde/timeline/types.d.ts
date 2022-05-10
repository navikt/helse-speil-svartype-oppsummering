declare type GhostPeriode = import('@io/graphql').GhostPeriode;
declare type BeregnetPeriode = import('@io/graphql').BeregnetPeriode;
declare type UberegnetPeriode = import('@io/graphql').UberegnetPeriode;

declare type TimelineWindow = {
    fom: Dayjs;
    tom: Dayjs;
    label: string;
};

declare type TimelinePeriod = GhostPeriode | BeregnetPeriode | UberegnetPeriode | InfotrygdPeriod | DatePeriod;