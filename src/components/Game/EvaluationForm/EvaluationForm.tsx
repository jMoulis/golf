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
export const EvaluationForm = (props: Props) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Tee</th>
            <th>Second coups</th>
            <th>Troisième coups</th>
            <th>Wedge</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};
