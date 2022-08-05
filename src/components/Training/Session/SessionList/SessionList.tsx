import { useEffect, useState } from 'react';
import { ENUM_COLLECTION } from '../../../../hooks/enumCollection';
import { List } from '../../../commons/List';
import { EditSession } from '../EditSession';
import { NewSession } from '../NewSession';
import { SessionType } from '../types';
import { useSession } from '../useSession';
import { SessionListItem } from './SessionListItem/SessionListItem';

type Props = {
  userId: string;
};

export const SessionList = ({ userId }: Props) => {
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const {
    getDocuments,
    documents: sessions,
    onDeleteDocument,
    onEditDocument,
  } = useSession(ENUM_COLLECTION.SESSION);

  useEffect(() => {
    if (userId) {
      getDocuments(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleEditDocument = async (value: SessionType, docId: string) => {
    await onEditDocument(value, docId);
    if (selectedSession) {
      setSelectedSession(value);
    }
  };

  return (
    <div>
      <List>
        {sessions.map((session, key) => (
          <SessionListItem
            session={session}
            key={key}
            onDeleteSession={onDeleteDocument}
            onSelectSession={setSelectedSession}
            onEditDocument={handleEditDocument}
          />
        ))}
      </List>
      <NewSession />
      <EditSession
        selectedSession={selectedSession}
        onClose={() => setSelectedSession(null)}
        onEditDocument={handleEditDocument}
      />
    </div>
  );
};
