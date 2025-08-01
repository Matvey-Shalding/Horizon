'use client';

import { CategoryList } from 'app/main/connect-bank/CategoryItem';
import clsx from 'clsx';
import { connectBankFields } from 'data/connectBankFields';
import { motion } from 'framer-motion';
import { useConnectBankState } from 'hooks/useConnectBank.hook';
import { useEffect } from 'react';
import { connectBankService } from 'services/ConnectBank.service';
import { AddCategoryForm } from 'ui/AddCategory';
import { Button } from 'ui/Button';
import { CancelButton } from 'ui/CancelButton';
import { ErrorMessage } from 'ui/Error';
import { Input } from 'ui/Input';
import { Title } from 'ui/Title';

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { delay } },
});

export default function ConnectBank({}: {}) {
  const {
    banks,
    dispatch,
    router,
    categories,
    setCategories,
    handleSubmit,
    errors,
    setValue,
    register,
    watch,
    setError,
    clearErrors,
    reset,
    cardholderName,
    handleCancel,
    handleSubmitBank,
    handleGenerateRandom,
    generateCVV,
    generateCardId,
  } = useConnectBankState();

  useEffect(() => {
    setValue('categories', [...categories]);
  }, [categories, setValue]);

  useEffect(() => {
    if (!cardholderName) {
      clearErrors('cardholderName');
      return;
    }

    const isDuplicate = banks.some(
      (bank) => bank.cardholderName.toLowerCase() === cardholderName.toLowerCase()
    );

    if (isDuplicate) {
      setError('cardholderName', {
        type: 'manual',
        message: 'This cardholder name is already in use.',
      });
    } else {
      clearErrors('cardholderName');
    }
  }, [cardholderName, banks, setError, clearErrors]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="bg-gray-bg flex min-h-screen w-full justify-center overflow-y-auto px-4 py-9 min-[768px]:px-6 min-[768px]:py-17"
    >
      <motion.div
        className="w-115 max-w-115"
        {...fadeInUp()}
      >
        <Title
          title="Connect bank"
          subtitle="Please enter your details"
        />

        <motion.form
          {...fadeInUp(0.2)}
          className={clsx(
            'mt-2 mb-2 flex flex-col gap-y-2 min-[450px]:mt-4',
            'min-[450px]:gap-y-3 min-[768px]:mt-6 min-[768px]:mb-4'
          )}
        >
          {connectBankFields.map(({ label, field, placeholder, type = 'text' }, index) => (
            <motion.div
              key={field}
              {...fadeInUp(0.3 + index * 0.1)}
              className="flex flex-col gap-y-1"
            >
              <Input
                label={label}
                placeholder={placeholder}
                register={register}
                fieldRegister={field}
                {...(type === 'number' && { type, min: '1' })}
              />
              <ErrorMessage message={errors?.[field as keyof typeof errors]?.message} />
            </motion.div>
          ))}

          <motion.div
            {...fadeInUp(0.6)}
            className="flex flex-col gap-y-1"
          >
            <div className="flex items-end gap-x-2">
              <div className="flex basis-3/4 flex-col gap-y-1">
                <Input
                  label="Card CVV"
                  placeholder="CVV"
                  register={register}
                  fieldRegister="cardCvv"
                />
              </div>
              <Button
                onClick={generateCVV}
                className="shrink-0 basis-1/4 px-2"
                content="Generate"
                props={{ type: 'button' }}
              />
            </div>
            <ErrorMessage message={errors.cardCvv?.message} />
          </motion.div>

          <motion.div
            {...fadeInUp(0.7)}
            className="flex flex-col gap-y-1"
          >
            <div className="flex items-end gap-x-2">
              <div className="flex basis-3/4 flex-col gap-y-1">
                <Input
                  label="Card ID"
                  placeholder="Card ID"
                  register={register}
                  fieldRegister="cardId"
                />
              </div>
              <Button
                onClick={generateCardId}
                className="shrink-0 basis-1/4 px-2"
                content="Generate"
                props={{ type: 'button' }}
              />
            </div>
            <ErrorMessage message={errors.cardId?.message} />
          </motion.div>
        </motion.form>

        <motion.div {...fadeInUp(0.8)}>
          <AddCategoryForm
            categories={categories}
            setCategories={setCategories}
          />
          <CategoryList
            categories={categories}
            setCategories={setCategories}
          />
        </motion.div>

        <motion.div
          {...fadeInUp(1)}
          className="mb-2"
        >
          <ErrorMessage message={errors.root?.message} />
        </motion.div>

        <motion.div
          {...fadeInUp(1.1)}
          className="mt-3 flex gap-3"
        >
          <CancelButton
            className="basis-1/2"
            onClick={handleCancel}
          />
          <Button
            onClick={handleSubmit(
              (data) =>
                void connectBankService.connect(data, setError, reset, setCategories, dispatch, router)
            )}
            content="Connect bank"
            className="basis-1/2"
            props={{
              type: 'button',
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
