import React from 'react';
import { Link, Outlet } from 'react-router-dom';

type Props = {};

export const Homepage = (props: Props) => {
  return (
    <div>
      <ul>
        <li>
          <Link to='/training'>Training</Link>
        </li>
        <li>
          <Link to='/game'>Play</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};
