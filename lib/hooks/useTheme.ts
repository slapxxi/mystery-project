import { ThemeContext } from '@self/components/ThemeProvider';
import { useContext } from 'react';
import { AppTheme } from '../types';

function useTheme(): [AppTheme, any] {
  let { theme, changeTheme } = useContext(ThemeContext);
  return [theme, changeTheme];
}

export default useTheme;
