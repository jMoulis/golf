import React from 'react';
import { Link, Outlet } from 'react-router-dom';

type Props = {};

export const GameIndex = (props: Props) => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
