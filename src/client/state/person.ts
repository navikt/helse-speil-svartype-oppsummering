import { Person } from 'internal-types';
import { atom, selector, useRecoilValue, useRecoilValueLoadable, useResetRecoilState, useSetRecoilState } from 'recoil';
import { fetchPerson, getPersoninfo } from '../io/http';
import { mapPerson } from '../mapping/person';
import { aktivVedtaksperiodeIdState } from './vedtaksperiode';

interface PersonState {
    problems?: Error[];
    person?: Person;
}

const hentPerson = (id: string): Promise<PersonState> =>
    fetchPerson(id)
        .then(async ({ data }) => {
            const personinfo =
                data.person.personinfo.kjønn === null
                    ? await getPersoninfo(data.person.aktørId).then(({ data }) => data)
                    : undefined;
            return { ...mapPerson(data.person, personinfo) };
        })
        .catch((error) => {
            switch (error.statusCode) {
                case 404:
                    throw Error('Personen har ingen utbetalinger i NAV Sykepenger');
                case 401:
                    throw Error('Du må logge inn for å utføre søk');
                default:
                    throw Error('Kunne ikke utføre søket. Prøv igjen senere');
            }
        });

export const personTilBehandlingState = atom<string | undefined>({
    key: 'personTilBehandlingState',
    default: undefined,
});

export const personState = selector<PersonState>({
    key: 'personState',
    get: ({ get }) => {
        const personTilBehandling = get(personTilBehandlingState);
        return personTilBehandling ? hentPerson(personTilBehandling) : {};
    },
});

const tildelingState = atom<string | undefined>({
    key: 'tildelingState',
    default: undefined,
});

export const useTildelPerson = () => useSetRecoilState(tildelingState);

export const usePerson = () => {
    const person = useRecoilValue(personState).person;
    const tildeling = useRecoilValue(tildelingState);
    return (
        person && {
            ...person,
            tildeltTil: person.tildeltTil ?? tildeling,
        }
    );
};

export const useHentPerson = () => {
    const setPerson = useSetRecoilState(personTilBehandlingState);
    const resetAktivVedtaksperiode = useResetRecoilState(aktivVedtaksperiodeIdState);
    const resetTildeling = useResetRecoilState(tildelingState);
    return (id: string) => {
        resetTildeling();
        resetAktivVedtaksperiode();
        setPerson(id);
    };
};

export const useIsLoadingPerson = () => useRecoilValueLoadable(personState).state === 'loading';
