import {
  alpha,
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  Input,
  Stack,
  styled,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customAxios } from '../../Lib/customAxios';
import { setLoading } from '../../Redux/commonReducer';
import CBtn from '../Commons/CBtn';
import CProfile from '../Commons/CProfile';
import CSearchBar from '../Commons/CSearchBar';
import alpaca from '../../Assets/Img/alpaca.png';
import useAlert from '../../Hooks/useAlert';
import { BrowserView, isMobile, MobileView } from 'react-device-detect';
import { Add } from '@mui/icons-material';

interface MemberInviteProps {
  roomId: string | undefined;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserInfo {
  id: number;
  nickname: string;
  profileImg: string;
}

const CustomBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  padding: theme.spacing(3),
  minWidth: isMobile ? 300 : 450,
}));

const SearchResultBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.component,
  height: '30vh',
}));

const CChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.main,
  color: theme.palette.txt,
}));

const CustomInput = styled(Input)(({ theme }) => ({
  color: theme.palette.txt,
  width: 270,
  '&:before': { borderBottom: `1px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.accent,
  color: theme.palette.icon,
  width: 30,
  height: 30,
  marginRight: theme.spacing(2),
  '&:hover': { backgroundColor: theme.palette.main },
}));

function MemberInvite({ roomId, open, setOpen }: MemberInviteProps) {
  const dispatch = useDispatch();
  const cAlert = useAlert();
  const theme = useTheme();
  const userId = useSelector((state: any) => state.account.userId);
  const isRoomMaker = useSelector((state: any) => state.room.isRoomMaker);

  const [nickname, setNickname] = useState<string>('');
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [selectedUserList, setSelectedUserList] = useState<UserInfo[]>([]);

  // 초대코드 조회
  const getInviteCode = async () => {
    if (!isRoomMaker) return;

    try {
      const res = await customAxios({
        method: 'get',
        url: `/study/${roomId}/inviteCode`,
      });
      console.log('inviteCode: ', res.data.message);
      setInviteCode(res.data.message);
    } catch (e: any) {
      console.log(e);
    }
  };

  // 초대코드 복사
  const copyInviteCode = async () => {
    if (navigator.clipboard) {
      // IE는 사용 못하고, 크롬은 66버전 이상일때 사용 가능
      navigator.clipboard
        .writeText(`${process.env.REACT_APP_CLIENT_URL}/invite/${inviteCode}`)
        .then(() => {
          console.log('초대코드를 복사하는데 성공했습니다.');
          cAlert.fire({
            title: '복사 성공',
            text: '초대코드를 복사하는데 성공했습니다.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        })

        .catch(() => {
          console.log('초대코드를 복사하는데 실패했습니다.');
          cAlert.fire({
            title: '복사 실패',
            text: '잠시 후 다시 시도해주세요..',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      cAlert.fire({
        title: '복사 실패',
        text: '복사하기가 지원되지 않는 브라우저입니다.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // 타이핑할때마다 유저이름을 검색하는 함수
  const searchUserByNickname = async () => {
    if (!nickname) return;

    dispatch(setLoading(true));
    try {
      const res = await customAxios({
        method: 'get',
        url: `/user/search`,
        params: { nickname },
      });
      console.log(res);
      const tempList: UserInfo[] = [];

      // 검색결과 중 선택된 유저리스트에 이미 있는 유저는 추가하지 않음
      res.data.forEach((userInfo: UserInfo) => {
        if (
          selectedUserList.every(
            (selectedUserInfo: UserInfo) =>
              selectedUserInfo.id !== userInfo.id && userInfo.id !== userId,
          )
        )
          tempList.push(userInfo);
      });

      setUserList(tempList);
    } catch (e: any) {
      console.log(e);
    }

    dispatch(setLoading(false));
  };

  // 검색결과를 선택된 유저리스트에 추가하는 함수
  const searchResultClickHandler = (idx: number) => {
    const tempList = [...userList];
    const selectedUser = tempList.splice(idx, 1);
    setUserList(tempList);
    setSelectedUserList((prevList) => [...prevList, ...selectedUser]);
  };

  // 선택된 유저리스트에서 유저를 삭제하는 함수
  const deleteHandler = (idx: number) => {
    const tempList = [...selectedUserList];
    tempList.splice(idx, 1);

    setSelectedUserList(tempList);
  };

  // 검색창 변경시마다 검색요청
  useEffect(() => {
    searchUserByNickname();
  }, [nickname]);

  useEffect(() => {
    if (open) getInviteCode();
  }, [open]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle
        sx={{
          padding: 2,
          fontSize: isMobile ? 12 : '',
          backgroundColor: theme.palette.accent,
          color: theme.palette.icon,
        }}>
        <h1>스터디원 초대하기</h1>
      </DialogTitle>
      <CustomBox spacing={2}>
        <CSearchBar onChange={setNickname} />
        <SearchResultBox className="scroll-box" sx={{ position: 'relative', height: '30vh' }}>
          {userList.map((userInfo, idx) => (
            <Box
              sx={{
                py: 1,
                backgroundColor:
                  idx % 2 ? alpha(theme.palette.bg, 0.3) : alpha(theme.palette.main, 0.3),
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              key={idx}>
              <CProfile nickname={userInfo.nickname} profileImg={userInfo.profileImg} />

              <CustomIconButton onClick={() => searchResultClickHandler(idx)}>
                <Add />
              </CustomIconButton>
            </Box>
          ))}
        </SearchResultBox>

        <div>
          {selectedUserList.map((userInfo, idx) => (
            <div key={idx}>
              <CChip
                avatar={<Avatar src={!!userInfo.profileImg ? userInfo.profileImg : alpaca} />}
                label={userInfo.nickname}
                onDelete={() => deleteHandler(idx)}
              />
            </div>
          ))}
        </div>
        <div style={{ alignSelf: 'end' }}>
          <CBtn width="100px" onClick={() => {}}>
            초대
          </CBtn>
        </div>
        <div>
          <Divider>
            <span>or</span>
          </Divider>
        </div>

        <BrowserView>
          <h3>초대링크</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <CustomInput value={`${process.env.REACT_APP_CLIENT_URL}/${inviteCode}`} readOnly />
            <CBtn width="100px" onClick={copyInviteCode}>
              복사
            </CBtn>
          </div>
        </BrowserView>

        <MobileView>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              paddingBottom: 16,
            }}>
            <h3>초대링크</h3>
            <CBtn width="100px" onClick={copyInviteCode}>
              복사
            </CBtn>
          </div>
          <CustomInput value={`${process.env.REACT_APP_CLIENT_URL}/${inviteCode}`} readOnly />
        </MobileView>
      </CustomBox>
    </Dialog>
  );
}

export default MemberInvite;