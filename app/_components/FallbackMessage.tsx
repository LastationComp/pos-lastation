import { faCircleCheck, faCircleExclamation, faCircleInfo, faExclamation, faGhost } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface FallbackMessage {
  message?: string;
  state?: 'success' | 'danger' | 'info' | 'warning';
}
export default function FallbackMessage({ message = '', state = 'success' }: FallbackMessage) {
  const getState = () => {
    if (state === 'success') return faCircleCheck;
    if (state === 'danger') return faCircleExclamation;
    if (state === 'info') return faCircleInfo;
    if (state === 'warning') return faExclamation;

    return faGhost;
  };

  const getColor = () => {
    if (state === 'success') return 'bg-green-600';
    if (state === 'danger') return 'bg-red-600';
    if (state === 'info') return 'bg-blue-600';
    if (state === 'warning') return 'bg-yellow-600';

    return 'bg-white';
  };
  return (
    <div className={'text-white p-3 rounded flex items-center gap-3 ' + getColor()}>
      <FontAwesomeIcon icon={getState()} />
      {message}
    </div>
  );
}
