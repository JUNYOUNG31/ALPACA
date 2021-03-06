import React, { useState } from 'react';
import RoomStudyLiveCamListItem from './RoomStudyLiveCamListItem';
import UserModel from './user-model';
import { Stack, IconButton, useTheme } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';

type usersPropsType = {
  users: UserModel[];
};

function RoomStudyLiveCamList({ users }: usersPropsType) {
  const theme = useTheme();
  const [page, setPage] = useState<number>(0);
  const minPage = 0;
  const maxPage = parseInt(`${(users.length - 1) / 6}`);
  const pageDown = () => {
    if (page > minPage) setPage((prev) => prev - 1);
  };
  const pageUp = () => {
    if (page < maxPage) setPage((prev) => prev + 1);
  };
  return (
    <div className="align_column_center">
      {page > minPage && (
        <IconButton onClick={pageDown} sx={{ color: theme.palette.txt }}>
          <ArrowDropUp />
        </IconButton>
      )}
      <Stack sx={{ width: '6vw' }} spacing={{ xs: 1, sm: 2, md: 3 }}>
        {users.slice(page * 6, page * 6 + 6).map((user) => {
          return (
            user !== undefined && (
              <RoomStudyLiveCamListItem key={user.getConnectionId()} user={user} />
            )
          );
        })}
      </Stack>
      {page < maxPage && (
        <IconButton onClick={pageUp} sx={{ color: theme.palette.txt }}>
          <ArrowDropDown />
        </IconButton>
      )}
    </div>
  );
}

export default RoomStudyLiveCamList;
