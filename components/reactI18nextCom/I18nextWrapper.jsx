import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from '~/components/reactI18nextCom/i18next';

function I18nextWrapper({ children }) {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}

export default I18nextWrapper;