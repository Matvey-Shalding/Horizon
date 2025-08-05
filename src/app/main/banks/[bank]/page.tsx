'use client';

import { CategoryList } from 'app/main/connect-bank/CategoryItem';
import { useBankPageState } from 'hooks/useBankPageState.hook';
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

  if (!bank) {
    return <p className="text-center text-red-500">Bank not found</p>;
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
