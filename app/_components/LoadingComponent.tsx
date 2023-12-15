import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

export default function LoadingComponent() {
  return (
    <div className="flex justify-center my-5">
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={faSpinner} spin={true} size={'lg'} />
        <span>Loading...</span>
      </div>
    </div>
  );
}
