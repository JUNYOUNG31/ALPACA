import React, { useEffect, useState } from 'react';
import CBtn from '../../Components/Commons/CBtn';
import CContainerWithLogo from '../../Components/Commons/CContainerWithLogo';
import CInput from '../../Components/Commons/CInput';
import CInputWithBtn from '../../Components/Commons/CInputWithBtn';
import { customAxios } from '../../Lib/customAxios';

function Signup() {
  // 회원가입에 필요한 유저정보 정의
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [bojId, setBojId] = useState<string>('');

  // 중복검사 여부 체크
  const [isUsernameChecked, setIsUsernameChecked] = useState<boolean>(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false);

  // 백준인증 여부 체크
  const [isBojIdChecked, setIsBojIdChecked] = useState<boolean>(false);

  // 유효성 검사 실패 메시지
  const [usernameMessage, setUsernameMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
  const [nicknameMessage, setNicknameMessage] = useState<string>('');
  const [bojIdMessage, setBojIdMessage] = useState<string>('');

  // 유저정보 입력 및 유효성 검사 정보
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,30}$/;
  const usernameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,20}$/;

  // 비밀번호 유효성검사
  useEffect(() => {
    if (!password || passwordRegex.test(password)) {
      setPasswordMessage('');
    } else {
      setPasswordMessage('영문자+숫자+특수문자 조합으로 8자리이상 입력하세요.');
    }
  }, [password]);

  // 비밀번호 일치검사
  useEffect(() => {
    if (!!passwordCheck && password !== passwordCheck) {
      setPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordCheckMessage('');
    }
  }, [password, passwordCheck]);

  // ID 유효성검사
  useEffect(() => {
    if (!username || usernameRegex.test(username)) {
      setUsernameMessage('');
    } else {
      setUsernameMessage('영문자+숫자 조합으로 6자리이상 입력하세요.');
    }
  }, [username]);

  // // 닉네임 유효성검사
  useEffect(() => {
    if (!nickname || (nickname.length > 1 && nickname.length < 9)) {
      setNicknameMessage('');
    } else {
      setNicknameMessage('닉네임은 2글자 이상 8글자 이하로 입력해 주세요');
    }
  }, [nickname]);

  // 아이디 중복체크
  const usernameDuplicateCheck = async () => {
    if (isUsernameChecked) {
      setIsUsernameChecked(false);
      return;
    }

    try {
      const res = await customAxios({ method: 'get', url: `/auth/duplicated/${username}` });
      console.log(res);
      setIsUsernameChecked(true);
    } catch (e) {
      console.log(e);
      setIsUsernameChecked(false);
      setUsernameMessage('아이디 중복검사에 실패했습니다.');
    }
  };

  // 닉네임 중복체크
  const nicknameDuplicateCheck = async () => {
    if (isNicknameChecked) {
      setIsUsernameChecked(false);
      return;
    }

    try {
      const res = await customAxios({ method: 'get', url: `/auth/duplicated/${nickname}` });
      console.log(res);
      setIsNicknameChecked(true);
    } catch (e) {
      console.log(e);
      setIsNicknameChecked(false);
      setNicknameMessage('닉네임 중복검사에 실패했습니다.');
    }
  };

  // 백준연결
  const bojConnect = async () => {
    // try {
    //   const res = await customAxios({
    //     method:
    //     url:
    //   })
    // setIsBojIdChecked(true)
    // } catch(e) {
    //   console.log(e)
    // }
  };

  // 회원가입
  const signup = async () => {
    const userInfo = {
      username,
      password,
      passwordCheck,
      nickname,
      bojId,
    };
    try {
      console.log(userInfo);
      const res = await customAxios({
        method: 'post',
        url: '/auth/signup',
        data: userInfo,
      });
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <CContainerWithLogo>
      <CInputWithBtn
        onChange={setUsername}
        label="ID"
        buttonContent={isUsernameChecked ? '수정하기' : '중복확인'}
        onButtonClick={usernameDuplicateCheck}
        disabled={isUsernameChecked}
        helperText={usernameMessage}
      />
      <CInput
        type="password"
        onChange={setPassword}
        label="PASSWORD"
        helperText={passwordMessage}
      />
      <CInput
        type="password"
        onChange={setPasswordCheck}
        label="PASSWORD CONFIRM"
        helperText={passwordCheckMessage}
      />
      <CInputWithBtn
        onChange={setNickname}
        label="NICKNAME"
        buttonContent={isNicknameChecked ? '수정하기' : '중복확인'}
        onButtonClick={nicknameDuplicateCheck}
        disabled={isNicknameChecked}
        helperText={nicknameMessage}
      />
      <CInputWithBtn
        onChange={setBojId}
        label="BOJ ID"
        buttonContent="연동하기"
        onButtonClick={bojConnect}
        disabled={true}
        helperText={bojIdMessage}
      />
      <CBtn
        content="회원가입"
        onClick={signup}
        // 회원가입 유효성 검사 통과시에만 활성화
        disabled={
          usernameMessage === '' ||
          passwordMessage === '' ||
          passwordCheckMessage === '' ||
          nicknameMessage === '' ||
          bojIdMessage === '' ||
          isUsernameChecked === false ||
          isNicknameChecked === false ||
          isBojIdChecked === false
        }
      />
    </CContainerWithLogo>
  );
}

export default Signup;
