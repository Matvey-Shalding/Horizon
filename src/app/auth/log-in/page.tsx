'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { m } from 'framer-motion';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { FormFields } from '@/constants/formFields';
import { LogInSchema, LogInSchemaType } from 'schemas/logIn.schema';
import { authorizationService } from 'services/Authorization.service';
import { setPending } from 'state/auth/authSlice';

import { Notification } from 'app/auth/Notification';
import { Button } from 'ui/Button';
import { ErrorMessage } from 'ui/Error';
import { Input } from 'ui/Input';
import { Logo } from 'ui/Logo';
import { Title } from 'ui/Title';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from 'routes';

export default function LogIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInSchemaType>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: 'John_doe@email.com',
      password: '12345678',
    },
  });

  const dispatch = useDispatch();
  const [isSubmitting, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  useEffect(() => {
    dispatch(setPending(isSubmitting));
  }, [isSubmitting, dispatch]);

  const router = useRouter();

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={clsx(
        'max-tablet-small:px-6 max-tablet-small:min-w-screen',
        'tablet:max-laptop:max-w-172.5 flex max-w-115 flex-col'
      )}
    >
      <div className="laptop:mb-6 max-tablet:mb-2 max-tablet-small:mb-1 mb-4">
        <Logo />
      </div>
      <div className="tablet-small:mb-3 mb-2">
        <Title
          title="Log in"
          subtitle="Welcome back! Please enter your details."
        />
      </div>

      <form
        onSubmit={handleSubmit(
          (data) => void authorizationService.logIn(data, setError, setSuccess, startTransition)
        )}
        className={clsx(
          'tablet:max-laptop:grid-cols-3 max-tablet-small:flex',
          'max-tablet-small:flex-col max-tablet-small:gap-y-2 grid gap-x-6 gap-y-3.5'
        )}
      >
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="tablet:max-laptop:col-span-3 col-span-2 flex flex-col gap-y-1"
        >
          <Input
            register={register}
            {...FormFields.email}
          />
          <ErrorMessage message={errors.email?.message} />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="tablet:max-laptop:col-span-3 col-span-2 flex flex-col gap-y-1"
        >
          <Input
            register={register}
            {...FormFields.password}
          />
          <ErrorMessage message={errors.password?.message} />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`col-span-2 -mt-1`}
        >
          <Notification
            message={success}
            type="success"
          />
          <Notification
            message={error}
            type="error"
          />
        </m.div>

        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="tablet:max-laptop:col-span-3 col-span-2"
        >
          <Button
            props={{ type: 'submit' }}
            content="Log in"
          />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={clsx(
            'tablet:max-laptop:col-span-3 col-span-2 flex gap-x-1',
            'self-center justify-self-center text-sm'
          )}
        >
          <span className="text-gray">Don’t have an account?</span>
          <span
            onClick={() => void router.push(AUTH_ROUTES.SIGN_UP)}
            className="text-light-blue cursor-pointer font-semibold"
          >
            Sign up
          </span>
        </m.div>
      </form>
    </m.div>
  );
}
