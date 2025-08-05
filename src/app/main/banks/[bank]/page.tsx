'use client';

import { CategoryList } from 'app/main/connect-bank/CategoryItem';
import { m } from 'framer-motion';
import { useBankPageState } from 'hooks/useBankPageState.hook';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { MAIN_ROUTES } from 'routes';
import { RootState } from 'state/store';
import { AddCategoryForm } from 'ui/AddCategory';
import { Button } from 'ui/Button';
import { CancelButton } from 'ui/CancelButton';
import { Card } from 'ui/Card';
import { ErrorMessage } from 'ui/Error';
import { Input } from 'ui/Input';
import { Label } from 'ui/Label';
import { Title } from 'ui/Title';

/**
 * BankPage component for editing bank details and categories.
 * @returns JSX.Element
 */
export default function BankPage() {
  const {
    bank,
    user,
    categories,
    setCategories,
    isDesktop,
    register,
    handleSubmit,
    errors,
    cardholderName,
    onSubmit,
    handleCancel,
    handleBack,
  } = useBankPageState();

  const banks = useSelector((state: RootState) => state.bank.banks);

  const router = useRouter();

  if (!bank) {
    return <p className="text-center text-red-500">Bank not found</p>;
  }

  if (!banks.length) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-y-4"
        >
          <m.span
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 1.5,
            }}
            className="text-dark-gray text-2xl font-semibold"
          >
            You have no banks yet
          </m.span>
          <m.div
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 1.5,
            }}
            className="w-full basis-full"
          >
            <Button
              onClick={() => void router.push(MAIN_ROUTES.CONNECT_BANK)}
              content="Connect bank"
            />
          </m.div>
        </m.div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full justify-center gap-x-12 overflow-y-scroll pt-20 max-[450px]:px-4 min-[450px]:px-6 min-[640px]:px-8 min-[768px]:px-12 min-[1024px]:pr-0">
      {isDesktop && (
        <div className="border-border relative flex h-[calc(100vh-96px)] flex-col gap-y-4 border-r pr-12 max-[1024px]:hidden">
          <button
            onClick={handleBack}
            className="absolute -top-6 left-0 flex w-fit items-center text-sm text-blue-600 hover:underline"
          >
            <Label
              content="← Back to Banks"
              onClick={() => {}}
            />
          </button>
          <Title
            title={cardholderName}
            subtitle="Effortlessly Manage Your Banking Activities"
          />
          <Card
            {...bank}
            cardholderName={cardholderName}
            firstName={user?.firstName}
            lastName={user?.lastName}
          />
        </div>
      )}

      <div className="relative flex w-full flex-col gap-y-4 self-stretch max-[1024px]:max-w-160 max-[640px]:gap-y-2.5 min-[1024px]:basis-full min-[1024px]:overflow-y-auto min-[1024px]:pr-12">
        {!isDesktop && (
          <button
            onClick={handleBack}
            className="absolute -top-6 left-0 flex w-fit items-center text-sm text-blue-600 hover:underline"
          >
            <Label
              content="← Back to Banks"
              onClick={() => {}}
            />
          </button>
        )}
        <Title
          title="Edit Bank Details"
          subtitle="Update your card information"
        />
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.error('validation blocked submit:', errors);
          })}
          id="my-form"
          className="flex flex-col gap-y-1 min-[450px]:gap-y-1.5 min-[640px]:gap-y-2.5"
        >
          <div className="flex flex-col gap-y-1">
            <Input
              label="Cardholder Name"
              placeholder="John Doe"
              register={register}
              fieldRegister="cardholderName"
            />
            <ErrorMessage message={errors.cardholderName?.message} />
          </div>
          <div className="flex flex-col gap-y-1">
            <Input
              label="Monthly Budget"
              placeholder="0.00"
              type="number"
              min="0"
              register={register}
              fieldRegister="monthlyBudget"
            />
            <ErrorMessage message={errors.monthlyBudget?.message} />
          </div>
          <div className="flex flex-col gap-y-1">
            <Input
              label="Card CVV"
              placeholder="123"
              register={register}
              fieldRegister="cardCvv"
            />
            <ErrorMessage message={errors.cardCvv?.message} />
          </div>
        </form>

        <div className="flex flex-col">
          <AddCategoryForm
            categories={categories}
            setCategories={setCategories}
          />
          <CategoryList
            categories={categories}
            setCategories={setCategories}
          />
        </div>

        <div className="flex gap-4 pb-6">
          <CancelButton
            className="basis-1/2"
            onClick={handleCancel}
          />
          <Button
            props={{ type: 'submit', form: 'my-form' }}
            className="basis-1/2"
            content="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}
