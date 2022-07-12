import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {};

export const GoBackLink = (props: Props) => {
  const navigate = useNavigate();
  return <div onClick={() => navigate(-1)}>GoBackLink</div>;
};
