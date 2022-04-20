import { Button, styled } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setTheme } from './Redux/theme/themeActions';

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
}));

function Testbtn() {
  const dispatch = useDispatch();

  return (
    <div>
      <CustomButton>버튼이다</CustomButton>
      <Button onClick={() => dispatch(setTheme('basic'))}>1</Button>
      <Button onClick={() => dispatch(setTheme('dark'))}>2</Button>
      <Button onClick={() => dispatch(setTheme('olivegreen'))}>3</Button>
      <Button onClick={() => dispatch(setTheme('peachpink'))}>4</Button>
    </div>
  );
}

export default Testbtn;