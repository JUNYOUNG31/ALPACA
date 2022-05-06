import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Button, styled } from '@mui/material';
import CBadge from './CBadge';

interface CProblemProps {
  number: number;
  level: number;
  title: string;
  backgroundColor?: string;
  button?: ReactJSXElement;
  borderRadius?: number | string;
}

const ProblemContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
}));

const ProblemBox = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
}));

function CProblem({ number, level, title, button, backgroundColor, borderRadius }: CProblemProps) {
  // 새 창에서 문제페이지 띄워줌
  const onClickHandler = () => {
    window.open(`https://www.acmicpc.net/problem/${number}`, '_blank');
  };
  return (
    <ProblemContainer
      sx={{
        backgroundColor: backgroundColor,
        borderRadius: borderRadius,
        paddingTop: '4px',
        paddingBottom: '4px',
      }}>
      <ProblemBox onClick={onClickHandler} sx={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CBadge tier={level} type="problem" />
          <div style={{ paddingLeft: 16 }}>{number}</div>
        </div>
        <div>{title}</div>
      </ProblemBox>
      {button}
    </ProblemContainer>
  );
}

export default CProblem;
