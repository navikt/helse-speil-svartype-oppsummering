import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import { Send, SpeechBubble, StopWatch } from '@navikt/ds-icons';
import { ErrorMessage } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { FeilregistrerNotatMutationDocument } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useRefetchPerson } from '@state/person';

import { ExpandableHistorikkContent } from '../ExpandableHistorikkContent';
import { Hendelse } from '../Hendelse';
import { HendelseDate } from '../HendelseDate';
import { HendelseDropdownMenu } from './HendelseDropdownMenu';
import { NotatHendelseContent } from './NotathendelseContent';
import { MAX_TEXT_LENGTH_BEFORE_TRUNCATION } from './constants';

import styles from './Notathendelse.module.css';

type NotathendelseProps = Omit<NotathendelseObject, 'type'>;

export const Notathendelse: React.FC<NotathendelseProps> = ({
    id,
    tekst,
    notattype,
    saksbehandler,
    saksbehandlerOid,
    timestamp,
    feilregistrert,
    vedtaksperiodeId,
    kommentarer,
}) => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const refetchPerson = useRefetchPerson();

    const [feilregistrerNotat, { loading, error }] = useMutation(FeilregistrerNotatMutationDocument, {
        variables: { id: parseInt(id) },
        onCompleted: () => {
            refetchPerson().finally(() => {
                setShowAddDialog(false);
            });
        },
    });

    const isExpandable = () => tekst.length > MAX_TEXT_LENGTH_BEFORE_TRUNCATION;
    const toggleNotat = (event: React.KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'Space') {
            setExpanded(isExpandable() && !expanded);
        }
    };

    return (
        <Hendelse
            title={<NotatTittel feilregistrert={feilregistrert} notattype={notattype} />}
            icon={<NotatIkon notattype={notattype} />}
        >
            {!feilregistrert && innloggetSaksbehandler.oid === saksbehandlerOid && (
                <HendelseDropdownMenu feilregistrerAction={feilregistrerNotat} isFetching={loading} />
            )}
            <div
                role="button"
                tabIndex={0}
                onKeyDown={toggleNotat}
                onClick={() => setExpanded(isExpandable() && !expanded)}
                className={styles.NotatTextWrapper}
            >
                <AnimatePresence mode="wait">
                    {expanded ? (
                        <motion.pre
                            key="pre"
                            className={styles.Notat}
                            initial={{ height: 40 }}
                            exit={{ height: 40 }}
                            animate={{ height: 'auto' }}
                            transition={{
                                type: 'tween',
                                duration: 0.2,
                                ease: 'easeInOut',
                            }}
                        >
                            {tekst}
                        </motion.pre>
                    ) : (
                        <motion.p key="p" className={styles.NotatTruncated}>
                            {tekst}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
            {error && <ErrorMessage>Kunne ikke feilregistrere notat. Prøv igjen senere.</ErrorMessage>}
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
            <ExpandableHistorikkContent openText={`Kommentarer (${kommentarer.length})`} closeText="Lukk kommentarer">
                <NotatHendelseContent
                    kommentarer={kommentarer}
                    saksbehandlerOid={saksbehandlerOid}
                    id={id}
                    showAddDialog={showAddDialog}
                    setShowAddDialog={setShowAddDialog}
                    vedtaksperiodeId={vedtaksperiodeId}
                />
            </ExpandableHistorikkContent>
        </Hendelse>
    );
};

interface NotatTittelProps {
    feilregistrert: boolean;
    notattype: NotatType;
}

const NotatTittel = ({ feilregistrert, notattype }: NotatTittelProps) => (
    <span className={classNames(feilregistrert && styles.Feilregistrert)}>
        {notattype === 'PaaVent' && 'Lagt på vent'}
        {notattype === 'Retur' && 'Returnert'}
        {notattype === 'Generelt' && 'Notat'}
        {feilregistrert && ' (feilregistrert)'}
    </span>
);

interface NotatIkonProps {
    notattype: NotatType;
}

const NotatIkon = ({ notattype }: NotatIkonProps) => {
    switch (notattype) {
        case 'PaaVent':
            return <StopWatch title="Stop-watch-ikon" className={classNames(styles.Innrammet, styles.LagtPaaVent)} />;
        case 'Retur':
            return <Send title="Send-ikon" className={classNames(styles.Innrammet, styles.Retur)} />;
        case 'Generelt':
            return (
                <SpeechBubble
                    title="Speech-bubble-ikon"
                    className={classNames(styles.Innrammet, styles.InnrammetNotat)}
                />
            );
    }
};
