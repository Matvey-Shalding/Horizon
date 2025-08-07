'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Notification } from 'app/auth/Notification';
import clsx from 'clsx';
import { FormFields } from 'constant/formFields';
import { SIGN_UP_FORM_FIELDS } from 'constant/signUpFormFields';
import { m } from 'framer-motion';
import { useSignUp } from 'hooks/useSignUp.hook';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AUTH_ROUTES } from 'routes';
import { SignUpSchema, SignUpSchemaType } from 'schemas/singUp.schema';
import { authorizationService } from 'services/Authorization.service';
import { setPending } from 'state/auth/authSlice';
import { Logo } from 'ui/Logo';
import { Title } from 'ui/Title';
import { Button } from '../../../ui/Button';
import { ErrorMessage } from '../../../ui/Error';
import { Input } from '../../../ui/Input';

export default function SingUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: SIGN_UP_FORM_FIELDS,
  });

  const router = useRouter();

  const dispatch = useDispatch();

  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(session, status);
  }, [session, status]);

  const { isSubmitting, startTransition, error, setError, setSuccess, success, userData, setUserData } =
    useSignUp();

  useEffect(() => {
    dispatch(setPending(isSubmitting));
  }, [isSubmitting, dispatch]);

  useEffect(() => {
    if (success) {
      authorizationService.singInAfterSignUp(userData, success, setSuccess, setError, router);
    }
  }, [success]);

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
          title="Sign up"
          subtitle="Please enter your details."
        />
      </div>

      <form
        onSubmit={handleSubmit(
          (data) => void authorizationService.singUp(data, setError, setSuccess, startTransition, setUserData)
        )}
        className={clsx(
          'laptop:grid-cols-2 max-tablet-small:flex max-tablet-small:flex-col',
          'max-tablet-small:gap-y-2 tablet:max-laptop:grid-cols-3 grid gap-x-6 gap-y-3.5'
        )}
      >
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="order-1 flex flex-col gap-y-1"
        >
          <Input
            register={register}
            {...FormFields.firstName}
          />
          <ErrorMessage message={errors.firstName?.message} />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="order-2 flex flex-col gap-y-1"
        >
          <Input
            register={register}
            {...FormFields.lastName}
          />
          <ErrorMessage message={errors.lastName?.message} />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={clsx(
            'tablet:max-laptop:order-4 tablet:max-laptop:col-span-3',
            'order-3 col-span-2 flex flex-col gap-y-1'
          )}
        >
          <Input
            register={register}
            {...FormFields.address}
          />
          <ErrorMessage message={errors.address?.message} />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="tablet:max-laptop:order-3 order-4 flex flex-col gap-y-1"
        >
          <Input
            register={register}
            {...FormFields.state}
          />
          <ErrorMessage message={errors.state?.message} />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="order-5 flex flex-col gap-y-1"
        >
          <Input
            register={register}
            {...FormFields.postalCode}
          />
          <ErrorMessage message={errors.postalCode?.message} />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="order-6 flex flex-col gap-y-1"
        >
          <Input
            register={register}
            {...FormFields.dateOfBirth}
          />
          <ErrorMessage message={errors.dateOfBirth?.message} />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="order-7 flex flex-col gap-y-1"
        >
          <Input
            register={register}
            {...FormFields.SSN}
          />
          <ErrorMessage message={errors.SSN?.message} />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="tablet:max-laptop:col-span-3 order-8 col-span-2 flex flex-col gap-y-1"
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
          transition={{ delay: 0.9 }}
          className="tablet:max-laptop:col-span-3 order-9 col-span-2 flex flex-col gap-y-1"
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
          transition={{ delay: 1 }}
          className={`order-10 col-span-2 ${(success || error) && 'mb-3'}`}
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
          transition={{ delay: 1.1, duration: 0.3 }}
          className="tablet:max-laptop:col-span-3 tablet-small:-mt-3 order-11 col-span-2"
        >
          <Button
            props={{ type: 'submit' }}
            content="Sign up"
          />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className={clsx(
            'tablet:max-laptop:col-span-3 tablet-small:-mt-2 order-12',
            'col-span-2 flex gap-x-1 self-center justify-self-center text-sm'
          )}
        >
          <span className="text-gray">Already have an account?</span>
          <span
            onClick={() => void router.push(AUTH_ROUTES.LOGIN)}
            className="text-light-blue cursor-pointer font-semibold"
          >
            Log in
          </span>
        </m.div>
      </form>
    </m.div>
  );
}
