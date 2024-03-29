import React, { useEffect, useRef, useState } from 'react';
import {
  Popover,
  styled,
  Paper,
  Divider,
  useTheme,
  Button,
  IconButton,
  alpha,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { customAxios } from '../../Lib/customAxios';
import { isMobile } from 'react-device-detect';
import useAlert from '../../Hooks/useAlert';
import { useDispatch } from 'react-redux';
import { joinAndAddStudy } from '../../Redux/accountReducer';
import dateToString, {
  dateToStringDate,
  dateToStringTime,
  dateToStringTimeSimple,
} from '../../Lib/dateToString';

type NotificationDialogType = {
  anchorEl: HTMLElement | null;
  setAnchorEl: Function;
  setNewNotiCount: Function;
};

type NotificationDataType = {
  id: string;
  isInvitation: boolean;
  roomMaker: string;
  roomMakerProfileImg: string;
  scheduleId: number;
  scheduleStartedAt: string;
  studyId: number;
  studyTitle: string;
  userId: number;
  createdAt: string;
};

type NotificationItemType = {
  notification: NotificationDataType;
  deleteNoti: Function;
};

const CustomPopover = styled(Popover)(({ theme }) => ({
  maxHeight: '60vh',
  '.MuiPopover-paper': {
    padding: '10px',
    margin: 10,
    backgroundColor: theme.palette.component,
  },
}));
const NotiPaper = styled(Paper)(({ theme }) => ({
  maxWidth: isMobile ? '80vw' : '20vw',
  background: theme.palette.main,
  color: theme.palette.txt,
  margin: '10px',
  padding: '10px',
  borderRadius: '5px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const CustomBtn = styled(Button)(({ theme }) => ({
  fontFamily: 'Pretendard-Regular',
  background: theme.palette.bg,
  color: theme.palette.txt,
  marginLeft: '5px',
  marginRight: '5px',
  padding: 5,
  borderRadius: '10px',
  '&:hover': {
    background: theme.palette.bg + '90',
  },
}));

function NotificationItem({ notification, deleteNoti }: NotificationItemType) {
  const cAlert = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { id, isInvitation, studyId, studyTitle, scheduleStartedAt, createdAt } = notification;
  const joinStudy = async () => {
    deleteNoti(id);
    try {
      const res = await customAxios({
        method: 'post',
        url: `/study/${id}/join`,
      });

      // console.log('joinStudy: ', res);
      dispatch(joinAndAddStudy(res.data));

      cAlert
        .fire({
          title: '가입완료',
          text: `${studyTitle}에 가입되었습니다.\n 스터디로 이동하시겠습니까?`,
          icon: 'success',
          confirmButtonText: '이동',
        })
        .then((res) => {
          if (res.isConfirmed) {
            navigate(`/room/${studyId}`);
          } else {
            navigate('/');
          }
        });
    } catch (e: any) {
      if (e.response.status === 400) {
        cAlert.fire({
          title: '가입 실패',
          text: '잘못된 접근입니다.',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (e.response.status === 409) {
        cAlert.fire({
          title: '가입 실패',
          text: '이미 가입되어있는 스터디입니다.',
          icon: 'error',
          showCancelButton: false,
          timer: 1500,
        });
      }
    }
  };

  const rejectStudy = async () => {
    try {
      await customAxios({
        method: 'post',
        url: `/study/${id}/reject`,
      });
      deleteNoti(id);
      cAlert.fire({
        title: '거절 완료',
        text: '스터디 초대 거절을 완료했습니다.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (e) {}
  };

  return (
    <NotiPaper>
      <div
        style={{
          marginBottom: '10px',
          padding: '0 10px 10px 10px',
          minWidth: '15vw',
          width: '100%',
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>
            {isInvitation ? `스터디 초대` : `스터디 일정 추가`}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 14,
              color: alpha(theme.palette.txt, 0.5),
            }}>
            {new Date(createdAt).toLocaleDateString() !== new Date().toLocaleDateString() ? (
              <span>
                <div>
                  {dateToStringDate(
                    new Date(createdAt),
                    new Date(createdAt).getFullYear() !== new Date().getFullYear(),
                  )}{' '}
                  {dateToStringTimeSimple(new Date(createdAt))}
                </div>
              </span>
            ) : (
              <span>{dateToStringTime(new Date(createdAt))}</span>
            )}
            <IconButton
              size="small"
              onClick={() => {
                deleteNoti(id);
              }}>
              <Close />
            </IconButton>
          </div>
        </div>
        <Divider variant="middle" sx={{ margin: '10px 0' }} />
        {isInvitation ? (
          <>
            <div
              style={{
                textAlign: 'center',
                marginBottom: '2px',
              }}>{`${studyTitle} 스터디에 초대되었습니다`}</div>
            <div style={{ textAlign: 'center' }}>수락하시겠습니까?</div>
          </>
        ) : (
          <>
            <div
              style={{
                textAlign: 'center',
              }}>{`${studyTitle} 스터디에 일정이 추가되었습니다.`}</div>
            <div style={{ textAlign: 'center', marginTop: '2px' }}>
              {scheduleStartedAt &&
                '스터디 일정 : ' + dateToStringDate(new Date(scheduleStartedAt))}
            </div>
          </>
        )}
      </div>
      <div className="align_center">
        {isInvitation ? (
          <>
            <CustomBtn
              size="small"
              onClick={() => {
                joinStudy();
              }}>
              수락
            </CustomBtn>
            <Divider
              sx={{ border: `1px solid ${theme.palette.txt + '50'}` }}
              orientation="vertical"
              variant="middle"
              flexItem></Divider>
            <CustomBtn
              size="small"
              onClick={() => {
                rejectStudy();
              }}>
              거절
            </CustomBtn>
          </>
        ) : (
          <CustomBtn
            size="small"
            onClick={() => {
              deleteNoti(id);
              navigate(`/room/${studyId}`);
            }}>
            이동
          </CustomBtn>
        )}
      </div>
    </NotiPaper>
  );
}

function NotificationDialog({ anchorEl, setAnchorEl, setNewNotiCount }: NotificationDialogType) {
  const location = useLocation();
  const [notificationList, setNotificationList] = useState<NotificationDataType[]>([]);

  const getNotifications = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: '/notification',
      });
      // console.log(res.data);
      setNotificationList(res.data);
      setNewNotiCount(res.data.length);
    } catch (e) {}
  };

  const deleteNotifications = (id: string) => {
    try {
      customAxios({
        method: 'post',
        url: '/notification',
        data: {
          notificationId: id,
        },
      });
      setNewNotiCount((prev: number) => prev - 1);
      setNotificationList((notifications) => {
        return notifications.filter((notification, idx) => {
          return notification.id !== id;
        });
      });
    } catch (e) {}
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getNotifications();
  }, [location.pathname]);
  return (
    <CustomPopover
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}>
      {notificationList.length > 0 ? (
        notificationList.map((noti, index) => {
          return (
            <NotificationItem
              key={`noti-${index}`}
              notification={noti}
              deleteNoti={deleteNotifications}
            />
          );
        })
      ) : (
        <div>모든 알림을 확인했습니다.</div>
      )}
    </CustomPopover>
  );
}

export default NotificationDialog;
