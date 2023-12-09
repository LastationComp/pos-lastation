import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

export default function PosButton({
    icon,
    children,
    onClick
}: {
    icon: IconDefinition,
    children: React.ReactNode,
    onClick: any
}) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 p-3 hover:bg-teal-500 transition hover:text-white rounded-full bg-teal-300 my-3">
      <FontAwesomeIcon icon={icon} size="lg" />
      {children}
    </button>
  );
}
