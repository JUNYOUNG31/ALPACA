import React, { useRef, useState, useEffect } from 'react';
import { Dialog, Button, Grid, MenuItem, FormControl, Box, Input } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useDispatch } from 'react-redux';
import { setTheme } from '../../Redux/themeReducer';
import { customAxios } from '../../Lib/customAxios';
import { useSelector } from 'react-redux';
import { setUserInfo } from '../../Redux/accountReducer';
import { logout } from '../../Redux/accountReducer';
import EditPassword from './EditPassword';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import styles from '../Main/MainIntroductionProfile.module.css';
import Basic from '../../Assets/Img/Basic.png';
import Dark from '../../Assets/Img/Dark.png';
import Olivegreen from '../../Assets/Img/Olivegreen.png';
import Peachpink from '../../Assets/Img/Peachpink.png';
import { setLoading } from '../../Redux/commonReducer';
import CInputWithBtn from '../../Components/Commons/CInputWithBtn';
import FormHelperText from '@mui/material/FormHelperText';
import { BrowserView, MobileView } from 'react-device-detect';
import useAlert from '../../Hooks/useAlert';

const WButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.warn,
  color: theme.palette.txt,
}));

const ProfileSearch = styled('input')({
  display: 'none',
});

const Clabel = styled('label')(({ theme }) => ({
  color: theme.palette.txt,
}));
const TInput = styled(Input)(({ theme }) => ({
  color: theme.palette.txt,
  '&:before': { borderBottom: `1px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
}));

const CSelect = styled(Select)(({ theme }) => ({
  color: theme.palette.txt,
  '&:before': { borderBottom: `1px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
}));

const CustomContent = styled('div')(({ theme }) => ({
  minWidth: 960,
  minHeight: 720,
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.bg,
}));

const MContent = styled('div')(({ theme }) => ({
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.bg,
  width: '100%',
  height: '100%',
  minHeight: '100vh',
}));

const ThemeButton = styled('button')(({ theme }) => ({
  background: theme.palette.bg,
  borderRadius: '10px',
  border: 0,
  padding: 10,
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

const CButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.main,
  color: theme.palette.txt,
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

export interface EditProfileProps {
  open: boolean;
  onClose: () => void;
}

function EditProfile({ onClose, open }: EditProfileProps) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const cAlert = useAlert();
  const userTheme = useSelector((state: any) => state.theme.themeType);
  const userInfo = useSelector((state: any) => state.account);
  const [stacks, setStacks] = React.useState(userInfo.preferredLanguage);
  const [newNickname, setNewNickname] = useState<string>(userInfo.nickname);
  const [introduction, setIntroduction] = useState<string>(userInfo.info);
  const [imgData, setImgData] = useState<any>();
  const [themeSelect, setThemeSelect] = useState(userTheme);
  const [openEditPassword, setOpenEditPassword] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(true);
  const [nicknameMessage, setNicknameMessage] = useState<string>('');
  const [nicknameOkMessage, setNicknameOkMessage] = useState<string>('');

  const cancleClose = () => {
    onClose();
    setThemeSelect(userTheme);
    setNewNickname(userInfo.nickname);
    setNicknameOkMessage('');
  };

  const editDataClose = () => {
    editUserData();
    onClose();
    setNicknameOkMessage('');
  };

  const dialogOpen = () => {
    setOpenEditPassword(true);
  };
  const dialogClose = () => {
    setOpenEditPassword(false);
  };

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (typeof event.target.value === 'string') {
      setStacks(event.target.value);
    }
  };

  const inputIntro = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntroduction(event.target.value);
  };

  const editProfileImg = async (profileData: string) => {
    // console.log(frm.get('file'));
    try {
      await customAxios({
        method: 'post',
        url: `/user/${userInfo.userId}/profile`,
        data: frm,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const resUserInfo = { ...userInfo };
      resUserInfo.profileImg = profileData;
      dispatch(setUserInfo(resUserInfo));
    } catch (e: any) {
      setImgData(userInfo.profileImg);
    }
  };

  const imgRef = useRef<HTMLInputElement>(null);
  const frm = new FormData();
  const reader = new FileReader();
  const imageChange = (event: any) => {
    const files = event.target.files[0];
    if (files.size > 10240000) {
      cAlert.fire({
        title: '????????? ?????? ??????!',
        text: '????????? ???????????? 10MB??? ????????? ??? ????????????.',
        icon: 'error',
        showConfirmButton: true,
      });
      return;
    }
    frm.append('file', event.target.files[0]);
    reader.readAsDataURL(files);
    reader.onloadend = () => {
      setImgData(reader.result);
      if (typeof reader.result === 'string') {
        editProfileImg(reader.result);
      }
    };
  };

  const editUserData = async () => {
    try {
      await customAxios({
        method: 'put',
        url: `/user/${userInfo.userId}`,
        data: {
          info: introduction,
          nickname: newNickname,
          preferredLanguage: stacks,
          theme: themeSelect,
        },
      });
      const resUserInfo = { ...userInfo };
      resUserInfo.nickname = newNickname;
      resUserInfo.info = introduction;
      resUserInfo.preferredLanguage = stacks;
      // console.log('?????? ??????', themeSelect);
      dispatch(setTheme(themeSelect));
      dispatch(setUserInfo(resUserInfo));
    } catch (e) {
      // console.log(e);
    }
  };

  const deleteUserData = async () => {
    try {
      await customAxios({
        method: 'delete',
        url: `/user/${userInfo.userId}`,
      });
      cAlert.fire({
        title: '?????? ?????? ??????',
        text: '?????? ?????? ???????????????.',
        icon: 'success',
        showConfirmButton: true,
      });
      dispatch(logout());
    } catch (e: any) {
      cAlert.fire({
        title: '?????? ?????? ??????!',
        text:
          e.response.data.message ||
          '?????? ????????? ???????????? ???????????????. ????????? ?????? ??? ?????? ?????????????????? ????????????.',
        icon: 'error',
        showConfirmButton: true,
      });
    }
  };

  const deleteClick = () => {
    cAlert
      .fire({
        title: '?????? ??????',
        html: '?????? ??? ??????????????? ?????? ????????????, <br/><br/> ????????? ???????????? ???????????? ????????????.',
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '??????',
        cancelButtonText: '??????',
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteUserData();
        }
      });
  };

  const nicknameDuplicateCheck = async () => {
    if (newNickname === '') {
      dispatch(setLoading(false));
      return;
    }
    if (newNickname === userInfo.nickname) {
      return;
    }
    dispatch(setLoading(true));
    try {
      await customAxios({
        method: 'get',
        url: `/auth/duplicated/nickname`,
        params: { nickname: newNickname },
      });

      setIsNicknameChecked(true);
      setNicknameOkMessage('?????? ????????? ????????? ?????????.');
    } catch (e: any) {
      setIsNicknameChecked(false);
      if (e.response.status === 409) {
        setNicknameMessage(e.response.data.message);
      } else {
        setNicknameMessage('?????? ???????????? ????????? ?????????.');
        // console.log(e);
      }
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (!newNickname || (newNickname.length > 1 && newNickname.length < 21)) {
      setNicknameMessage('');
      setNicknameOkMessage('');
    } else {
      setNicknameMessage('???????????? 2?????? ?????? 20?????? ????????? ??????????????????.');
    }
    if (newNickname === userInfo.nickname) {
      setIsNicknameChecked(true);
    } else {
      setIsNicknameChecked(false);
    }
  }, [newNickname]);

  return (
    <>
      <BrowserView style={{ width: '100%', height: '100%' }}>
        <Dialog onClose={cancleClose} open={open} maxWidth="lg">
          <CustomContent>
            <Grid
              sx={{
                minWidth: 720,
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
              }}>
              <img
                src={imgData ? imgData : userInfo.profileImg}
                className={styles.profileimg}
                alt=""
              />
              <Box sx={{ position: 'absolute', bottom: 0, right: 250 }}>
                <label htmlFor="icon-button-file">
                  <ProfileSearch
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    onChange={imageChange}
                    ref={imgRef}
                  />
                  <IconButton
                    aria-label="upload picture"
                    component="span"
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      background: theme.palette.main,
                      height: '50px',
                      width: '50px',
                      '&:hover': {
                        background: theme.palette.main + '90',
                      },
                    }}>
                    <EditIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: 'center',
                        color: '#FFFFFF',
                      }}
                    />
                  </IconButton>
                </label>
              </Box>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} container sx={{ position: 'relative' }}>
                <CInputWithBtn
                  onChange={setNewNickname}
                  label="?????????"
                  buttonContent={'????????????'}
                  onButtonClick={nicknameDuplicateCheck}
                  helperText={nicknameMessage}
                  value={newNickname}
                  buttonDisable={!!nicknameMessage}
                />
                <FormHelperText
                  sx={{
                    color: theme.palette.main,
                    fontWeight: '400',
                    position: 'absolute',
                    top: '50%',
                    right: '22%',
                  }}>
                  {nicknameOkMessage}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Grid container>
                  <Grid
                    item
                    xs={4}
                    sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
                    <Clabel>????????????</Clabel>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="standard" sx={{ minWidth: '100%' }}>
                      <CSelect
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={stacks}
                        onChange={handleChange}>
                        <MenuItem value="python3">python3</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                        <MenuItem value="c">C</MenuItem>
                        <MenuItem value="cpp">C++</MenuItem>
                      </CSelect>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={2} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'center' }}>
                <Clabel>????????????</Clabel>
              </Grid>
              <Grid item xs={10}>
                <TInput
                  multiline={true}
                  maxRows={4}
                  sx={{ minWidth: '100%' }}
                  onChange={inputIntro}
                  value={introduction}></TInput>
              </Grid>
            </Grid>

            <div>
              <Clabel htmlFor="" sx={{ marginLeft: 4 }}>
                ??????
              </Clabel>
              <Grid
                sx={{
                  paddingTop: 1,
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItem: 'center',
                }}>
                <ThemeButton
                  onClick={() => setThemeSelect('basic')}
                  sx={{
                    background: themeSelect === 'basic' ? theme.palette.main : theme.palette.bg,
                  }}>
                  <img src={Basic} alt="" />
                  <br />
                  <Clabel>??????</Clabel>
                </ThemeButton>
                <ThemeButton
                  onClick={() => setThemeSelect('dark')}
                  sx={{
                    background: themeSelect === 'dark' ? theme.palette.main : theme.palette.bg,
                  }}>
                  <img src={Dark} alt="" />
                  <br />
                  <Clabel>??????</Clabel>
                </ThemeButton>
                <ThemeButton
                  onClick={() => setThemeSelect('olivegreen')}
                  sx={{
                    background:
                      themeSelect === 'olivegreen' ? theme.palette.main : theme.palette.bg,
                  }}>
                  <img src={Olivegreen} alt="" />
                  <br />
                  <Clabel>???????????????</Clabel>
                </ThemeButton>
                <ThemeButton
                  onClick={() => setThemeSelect('peachpink')}
                  sx={{
                    background: themeSelect === 'peachpink' ? theme.palette.main : theme.palette.bg,
                  }}>
                  <img src={Peachpink} alt="" />
                  <br />
                  <Clabel>????????????</Clabel>
                </ThemeButton>
              </Grid>
            </div>
            <Grid container>
              <Grid item xs={8}>
                <WButton onClick={deleteClick} sx={{ height: 35, width: 50 }}>
                  ??????
                </WButton>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  paddingTop: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItem: 'center',
                }}>
                <CButton onClick={dialogOpen} sx={{ height: 35, width: 110 }}>
                  ???????????? ??????
                </CButton>
                <EditPassword open={openEditPassword} onClose={dialogClose}></EditPassword>
                <CButton
                  onClick={editDataClose}
                  sx={{ height: 35, width: 50 }}
                  disabled={!isNicknameChecked}>
                  ??????
                </CButton>
              </Grid>
            </Grid>

            <IconButton
              component="span"
              sx={{ position: 'absolute', top: 40, right: 40 }}
              onClick={cancleClose}>
              <ClearIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  color: theme.palette.txt,
                }}
              />
            </IconButton>
          </CustomContent>
        </Dialog>
      </BrowserView>
      <MobileView>
        <Dialog onClose={cancleClose} open={open} fullScreen>
          <MContent>
            <DialogTitle sx={{ textAlign: 'center', color: theme.palette.txt }}>
              ????????? ??????
            </DialogTitle>
            <Grid
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <img
                src={imgData ? imgData : userInfo.profileImg}
                className={styles.profileimg}
                alt=""
                style={{ height: '12vh', width: '12vh' }}
              />
              <Box sx={{ position: 'absolute', bottom: 0, left: '55%' }}>
                <label htmlFor="icon-button-file">
                  <ProfileSearch
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    onChange={imageChange}
                    ref={imgRef}
                  />
                  <IconButton
                    aria-label="upload picture"
                    component="span"
                    sx={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      background: theme.palette.main,
                      height: '35px',
                      width: '35px',
                    }}>
                    <EditIcon
                      sx={{
                        minWidth: 0,
                        justifyContent: 'center',
                        color: '#FFFFFF',
                      }}
                    />
                  </IconButton>
                </label>
              </Box>
            </Grid>
            <Grid sx={{ position: 'relative', height: '12vh', minWidth: '230px', width: '100%' }}>
              <CInputWithBtn
                onChange={setNewNickname}
                label="?????????"
                buttonContent={'????????????'}
                onButtonClick={nicknameDuplicateCheck}
                helperText={nicknameMessage}
                value={newNickname}
                buttonDisable={!!nicknameMessage}
              />
              <FormHelperText
                sx={{
                  color: theme.palette.main,
                  fontWeight: '400',
                  position: 'absolute',
                  bottom: 0,
                  left: '22%',
                }}>
                {nicknameOkMessage}
              </FormHelperText>
            </Grid>
            <Grid container sx={{ height: '12vh' }}>
              <Grid item xs={12} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'left' }}>
                <Clabel>????????????</Clabel>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{ minWidth: '230px', width: '100%' }}>
                  <CSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={stacks}
                    onChange={handleChange}>
                    <MenuItem value="python3">python3</MenuItem>
                    <MenuItem value="Java">Java</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="C++">C++</MenuItem>
                  </CSelect>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container sx={{ height: '12vh', alignContent: 'center' }}>
              <Grid item xs={12} sx={{ paddingTop: 1, display: 'flex', justifyContent: 'left' }}>
                <Clabel>????????????</Clabel>
              </Grid>
              <Grid item xs={12}>
                <TInput
                  multiline={true}
                  maxRows={4}
                  onChange={inputIntro}
                  value={introduction}
                  sx={{ minWidth: '230px', width: '100%' }}></TInput>
              </Grid>
            </Grid>
            <div>
              <Clabel htmlFor="">??????</Clabel>
              <Grid
                container
                sx={{
                  paddingTop: 1,
                  paddingBottom: 1,
                  display: 'flex',
                  justifyContent: 'space-around',
                }}>
                <CButton
                  onClick={() => setThemeSelect('basic')}
                  sx={{
                    background:
                      themeSelect === 'basic' ? theme.palette.main : theme.palette.component,
                  }}>
                  ??????
                </CButton>
                <CButton
                  onClick={() => setThemeSelect('dark')}
                  sx={{
                    background:
                      themeSelect === 'dark' ? theme.palette.main : theme.palette.component,
                  }}>
                  ??????
                </CButton>
                <CButton
                  onClick={() => setThemeSelect('olivegreen')}
                  sx={{
                    background:
                      themeSelect === 'olivegreen' ? theme.palette.main : theme.palette.component,
                  }}>
                  ???????????????
                </CButton>
                <CButton
                  onClick={() => setThemeSelect('peachpink')}
                  sx={{
                    background:
                      themeSelect === 'peachpink' ? theme.palette.main : theme.palette.component,
                  }}>
                  ????????????
                </CButton>
              </Grid>
              <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                {themeSelect === 'basic' ? <img src={Basic} alt="" /> : null}
                {themeSelect === 'dark' ? <img src={Dark} alt="" /> : null}
                {themeSelect === 'olivegreen' ? <img src={Olivegreen} alt="" /> : null}
                {themeSelect === 'peachpink' ? <img src={Peachpink} alt="" /> : null}
              </Grid>
            </div>
            <Grid
              container
              sx={{
                paddingTop: 1,
                marginBottom: '5vh',
                display: 'flex',
                justifyContent: 'space-around',
              }}>
              <WButton onClick={deleteClick} sx={{ height: 35, width: 50 }}>
                ??????
              </WButton>
              <CButton onClick={dialogOpen} sx={{ height: 35, width: 110 }}>
                ???????????? ??????
              </CButton>
              <EditPassword open={openEditPassword} onClose={dialogClose}></EditPassword>
              <CButton
                onClick={editDataClose}
                sx={{ height: 35, width: 50 }}
                disabled={!isNicknameChecked}>
                ??????
              </CButton>
            </Grid>

            <IconButton
              component="span"
              sx={{ position: 'absolute', top: 25, right: 25 }}
              onClick={cancleClose}>
              <ClearIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  color: theme.palette.txt,
                }}
              />
            </IconButton>
          </MContent>
        </Dialog>
      </MobileView>
    </>
  );
}

export default EditProfile;
