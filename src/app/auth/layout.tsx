'use client';

import clsx from 'clsx';
import { m } from 'framer-motion';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';
import Loader from 'ui/Loader';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const visible = useSelector((state: RootState) => state.auth.isPending);

  return (
    <div className="relative">
      <Loader visible={visible} />
      <div className="flex min-h-screen">
        <div
          className={clsx(
            'tablet:pt-[10vh] tablet:pb-[10vh] grid',
            'w-full place-content-center bg-white pt-[14vh] pb-[14vh]'
          )}
        >
          {children}
        </div>
        <m.div
          className={clsx(
            'laptop:grid laptop:min-w-[50%] laptop:place-content-start',
            'laptop:pt-[14vh] bg-light-white hidden min-w-[40%] pl-3'
          )}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 50 }}
        >
          <img
            src="/img/auth/bg.jpg"
            alt="Authentication background"
          />
        </m.div>
      </div>
    </div>
  );
};

export default memo(AuthLayout);
