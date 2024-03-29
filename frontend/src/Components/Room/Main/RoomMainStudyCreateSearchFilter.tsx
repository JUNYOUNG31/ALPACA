import {
  alpha,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  styled,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Member, memberQueryCheck, memberQueryUncheck } from '../../../Redux/roomReducer';
import CBadge from '../../Commons/CBadge';
import CProfile from '../../Commons/CProfile';

interface RoomMainStudyCreateSearchFilterProps {
  tierValue: number;
  setTierValue: React.Dispatch<React.SetStateAction<number>>;
}

const TierBox = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
}));

const CRadio = styled(Radio)(({ theme }) => ({
  color: alpha(theme.palette.txt, 0.5),
}));
const CCheckbox = styled(Radio)(({ theme }) => ({
  color: alpha(theme.palette.txt, 0.5),
}));

function RoomMainStudyCreateSearchFilter({
  tierValue,
  setTierValue,
}: RoomMainStudyCreateSearchFilterProps) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const members = useSelector((state: any) => state.room.members);
  const [selectMemberCnt, setSelectMemberCnt] = useState<number>(0);

  const onTierChageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTierValue(parseInt(event.target.value));
  };

  const onMemberCheckedChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    if (event.target.checked) setSelectMemberCnt((prev) => prev + 1);
    else setSelectMemberCnt((prev) => prev + 1);

    dispatch(memberQueryCheck({ idx, isChecked: event.target.checked }));
  };

  const onAllMemberCheckedChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) return;
    dispatch(memberQueryUncheck());
    setSelectMemberCnt(0);
  };

  useEffect(() => {
    dispatch(memberQueryUncheck());
  }, []);

  return (
    <>
      <FormControl sx={{ width: '100%' }}>
        <FormLabel sx={{ color: alpha(theme.palette.txt, 0.5) }} id="problem-tier">
          문제 난이도
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="problem-tier"
          onChange={onTierChageHandler}
          value={tierValue}
          sx={{ width: '100%' }}>
          <Stack sx={{ width: '100%' }}>
            <TierBox>
              <FormControlLabel value={0} control={<Radio />} label="전체" />
            </TierBox>
            <TierBox>
              <FormControlLabel
                value={1}
                control={<CRadio />}
                label={<CBadge tier={1} labelOff />}
              />
              <FormControlLabel
                value={6}
                control={<CRadio />}
                label={<CBadge tier={6} labelOff />}
              />
              <FormControlLabel
                value={11}
                control={<CRadio />}
                label={<CBadge tier={11} labelOff />}
              />
            </TierBox>
            <TierBox>
              <FormControlLabel
                value={16}
                control={<CRadio />}
                label={<CBadge tier={16} labelOff />}
              />
              <FormControlLabel
                value={21}
                control={<CRadio />}
                label={<CBadge tier={21} labelOff />}
              />
              <FormControlLabel
                value={26}
                control={<CRadio />}
                label={<CBadge tier={26} labelOff />}
              />
            </TierBox>
          </Stack>
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel sx={{ color: alpha(theme.palette.txt, 0.5) }} id="problem-member">
          멤버가 풀지 않은 문제만
        </FormLabel>
        <RadioGroup aria-labelledby="problem-member">
          <FormControlLabel
            value={0}
            control={
              <CCheckbox
                checked={selectMemberCnt === 0}
                onChange={onAllMemberCheckedChangeHandler}
                name="전체"
              />
            }
            label={'전체'}
          />
          <div>
            {members.map((member: Member, idx: number) => (
              <FormControlLabel
                key={idx}
                value={1}
                control={
                  <CCheckbox
                    checked={member.isQuery || false}
                    onChange={(event) => onMemberCheckedChangeHandler(event, idx)}
                    name={member.nickname}
                  />
                }
                label={<CProfile nickname={member.nickname} profileImg={member.profileImg} />}
              />
            ))}
          </div>
        </RadioGroup>
      </FormControl>
    </>
  );
}

export default RoomMainStudyCreateSearchFilter;
