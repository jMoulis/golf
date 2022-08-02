import React, { FormEvent, useState } from 'react';
import { CoachPage } from '../../pages/AdminPages/CoachPage';
import { UserType } from '../../types';
import { FixedBottomToolbar } from '../../commons/FixedBottomToolbar';
import { ButtonPill } from '../../commons/ButtonPill';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase';
import { useSession } from './useSession';
import { ENUM_COLLECTION } from '../../../hooks/enumCollection';
import { Timestamp } from 'firebase/firestore';
import { SessionType } from './types';

type Props = {
  onClose: () => void;
};
export const NewSessionForm = ({ onClose }: Props) => {
  const { onCreate } = useSession(ENUM_COLLECTION.SESSION);
  const [selectedCoach, setSelectedCoach] = useState<UserType | null>(null);
  const [form, setForm] = useState<SessionType | null>(null);
  const [user] = useAuthState(auth);

  const handleSubmit = () => {
    onClose();
    if (form) {
      const date = new Date(form.date);
      onCreate({ ...form, date: Timestamp.fromDate(date), userId: user?.uid });
    }
  };

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setForm((prevForm: any) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSelectCoach = (coach: UserType | null) => {
    if (!user) return null;
    let users = form?.users || [];
    setSelectedCoach(coach);
    if (coach) {
      users = [user?.uid, coach.id as string];
    } else {
      users = [user?.uid];
    }
    setForm((prevForm: any) => ({
      ...prevForm,
      users,
    }));
  };

  return (
    <div>
      <input name="topic" onChange={handleChange} placeholder="Sujet" />
      <input name="date" type="date" onChange={handleChange} />
      <CoachPage
        coachControl={{ coach: selectedCoach }}
        onSelect={handleSelectCoach}
      />
      <FixedBottomToolbar>
        <ButtonPill onClick={handleSubmit}>ENREGISTRER</ButtonPill>
      </FixedBottomToolbar>
    </div>
  );
};
