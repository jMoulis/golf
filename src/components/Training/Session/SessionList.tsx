import styled from '@emotion/styled';
import { faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ENUM_COLLECTION } from '../../../hooks/enumCollection';
import { DeleteButton } from '../../commons/DeleteButton';
import { List, ListItem } from '../../commons/List';
import { EditSession } from './EditSession';
import { NewSession } from './NewSession';
import { SessionType } from './types';
import { useSession } from './useSession';

const CustomListItem = styled(ListItem)`
  display: flex;
  align-items: center;
`;

type Props = {
  userId: string;
};

export const SessionList = ({ userId }: Props) => {
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const {
    getDocuments,
    documents,
    onDeleteDocument,
  }: {
    getDocuments: (userId: string) => void;
    documents: SessionType[];
    onDeleteDocument: (docID: string) => void;
  } = useSession(ENUM_COLLECTION.SESSION);

  useEffect(() => {
    if (userId) getDocuments(userId);
  }, [getDocuments, userId]);

  return (
    <div>
      <List>
        {documents.map((document, key) => (
          <CustomListItem key={key}>
            <span
              style={{ flex: 1 }}
              onClick={() => setSelectedSession(document)}
            >
              {document.topic || 'Aucun sujet'}
            </span>
            <DeleteButton onClick={() => onDeleteDocument(document.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </DeleteButton>
          </CustomListItem>
        ))}
      </List>
      <NewSession />
      <EditSession
        selectedSession={selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </div>
  );
};
