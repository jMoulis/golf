import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle, faTrash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DeleteButton } from 'components/commons/Buttons/DeleteButton';
import { FloatingButton } from 'components/commons/Buttons/FloatingButton';
import { List, ListItem } from 'components/commons/List';
import { SwipableDefault } from 'components/commons/SwipableDefault';
import { BagType, ClubType } from 'components/types';
import { useToggle } from 'hooks/useToggle';
import { theme } from 'style/theme';
import { sortArrayByAlphabet } from 'utils/global.utils';
import { useClubs } from './useClubs';

const CustomListItem = styled(ListItem)`
  border-radius: 5px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
type Props = {
  onSelect: (club: ClubType) => void;
  userClubs: BagType;
};

export const AddClub = ({ onSelect, userClubs }: Props) => {
  const { open, onClose, onOpen } = useToggle();

  const { clubs } = useClubs();
  return (
    <>
      <FloatingButton backgroundColor="#000" onClick={onOpen} color="#fff">
        <FontAwesomeIcon icon={faPlus} size="3x" />
      </FloatingButton>
      <SwipableDefault
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        title="Ajouter un club"
      >
        <List>
          {clubs
            .sort((a, b) => a.order - b.order)
            .map((club) => (
              <CustomListItem key={club.id}>
                {club.name}
                <DeleteButton
                  buttonStyle={{
                    backgroundColor: userClubs?.some(
                      (userClub) => userClub.id === club.id
                    )
                      ? theme.colors.deleteButton
                      : theme.colors.blue,
                  }}
                  icon={
                    userClubs?.some((userClub) => userClub.id === club.id)
                      ? faTrash
                      : faPlus
                  }
                  onClick={() => onSelect(club)}
                />
              </CustomListItem>
            ))}
        </List>
      </SwipableDefault>
    </>
  );
};
