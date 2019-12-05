import React from 'react';

import Navigator from './navigator';

export default function AppView() {
  return <Navigator onNavigationStateChange={() => {}} uriPrefix="/app" />;
}