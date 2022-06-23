import { DocumentReference } from 'firebase/firestore';
import React from 'react';

type Props = {
  game?: {
    courseRef: string;
    date: any;
    id: string;
  };
  gameRef: DocumentReference | null;
};
export const MentalCard = (props: Props) => {
  return <div>MentalCard</div>;
};
