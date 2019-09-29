import { css } from '@emotion/core';
import { AppTheme } from '@self/lib/types';

const toolbar = (theme: AppTheme) => css`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: ${theme.colors.itemBg};
`;

const styles = { toolbar };

export default styles;
