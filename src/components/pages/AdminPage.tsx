import React from 'react';
import { Link, Outlet } from 'react-router-dom';

type Props = {};

export const AdminPage = (props: Props) => {
  return (
    <div>
      <nav>
        <Link to='themes'>Themes</Link>
        <Link to='courses'>Courses</Link>
      </nav>
      <Outlet />
    </div>
  );
};
