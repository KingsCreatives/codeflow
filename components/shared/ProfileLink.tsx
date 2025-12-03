import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ProfileLinkProps {
  imageUrl: string;
  href?: string;
  title: string;
}

const ProfileLink = ({ imageUrl, href, title }: ProfileLinkProps) => {
  return (
    <div className='flex-center gap-1'>
      <Image
        src={imageUrl}
        alt={title}
        width={20}
        height={20}
        className='object-contain'
      />
      {href ? (
        <Link
          href={href}
          target='_blank'
          className='paragraph-medium text-blue-500'
        >
          {title}
        </Link>
      ) : (
        <p className='paragraph-medium text-dark400_light700'>{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
