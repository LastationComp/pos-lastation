import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
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
    <Button startContent={<FontAwesomeIcon icon={icon}/>} radius='full' onClick={onClick} className="hover:bg-teal-500 hover:text-white bg-teal-300 my-3">
      {children}
    </Button>
  );
}
