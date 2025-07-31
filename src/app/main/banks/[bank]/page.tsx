'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useImmer } from 'use-immer';
import { z } from 'zod';

import { setBanks } from 'state/main/bankSlice';
import { RootState } from 'state/store';
import { Bank } from 'types/Bank.interface';
import { getBankFromSlug } from 'utils/getNameFromSlug';

import { useMediaQuery } from '@react-hookz/web';
import { CategoryList } from 'app/main/connect-bank/CategoryItem';
import { connectBankSchema } from 'schemas/connectBank.schema';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { AddCategoryForm } from 'ui/AddCategory';
import { Button } from 'ui/Button';
import { CancelButton } from 'ui/CancelButton';
import { Card } from 'ui/Card';
import { ErrorMessage } from 'ui/Error';
import { Input } from 'ui/Input';
import { Label } from 'ui/Label';
import { Title } from 'ui/Title';

const editSchema = connectBankSchema.omit({
  balance: true,
});

type EditSchemaType = z.infer<typeof editSchema>;

export default function BankPage() {
  const { bank: slug } = useParams();
  const user = useSelector((state: RootState) => state.user.user);
  const banks = useSelector((state: RootState) => state.bank.banks);
  const bank = getBankFromSlug(banks as any, slug?.toString() ?? '') as Bank | undefined;
  const dispatch = useDispatch();
  const router = useRouter();

  const [categories, setCategories] = useImmer<Bank['categories']>(bank?.categories ?? []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<EditSchemaType>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      cardId: bank?.cardId ?? '',
      cardholderName: bank?.cardholderName ?? '',
      monthlyBudget: bank?.monthlyBudget ?? '0.00',
      cardCvv: bank?.cardCvv ?? '',
      categories: bank?.categories ?? [],
    },
  });

  const cardholderName = watch('cardholderName');
  const monthlyBudget = watch('monthlyBudget');
  const cardCvv = watch('cardCvv');

  useEffect(() => {
    setValue('categories', categories);
  }, [categories, setValue]);

  const onSubmit = (data: EditSchemaType) => {
    const updated = {
      ...bank!,
      ...data,
      categories,
    };

    const updatedBanks = banks.map((b) => (b.cardId === bank?.cardId ? updated : b));
    dispatch(setBanks(updatedBanks));
    router.push('/main/banks');
  };

  const isDesktop = useMediaQuery(`(min-width:${MEDIA_QUERIES.DESKTOPS})`);

  if (!bank) {
    return <p className="text-center text-red-500">Bank not found</p>;
  }

  return (
    <div className="relative flex w-full justify-center gap-x-12 overflow-y-scroll pt-20 max-[450px]:px-4 min-[450px]:px-6 min-[640px]:px-8 min-[768px]:px-12 min-[1024px]:pr-0">
      {isDesktop && (
        <div className="border-border relative flex h-[calc(100vh-96px)] flex-col gap-y-4 border-r pr-12 max-[1024px]:hidden">
          <button
            onClick={() => router.push('/main/banks')}
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

      {/* Form & Controls Section */}
      <div className="relative flex w-full flex-col gap-y-4 self-stretch max-[1024px]:max-w-160 max-[640px]:gap-y-2.5 min-[1024px]:basis-full min-[1024px]:overflow-y-auto min-[1024px]:pr-12">
        {!isDesktop && (
          <button
            onClick={() => router.push('/main/banks')}
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

        {/* Form (only inputs) */}
        <form
          onSubmit={handleSubmit((data) => onSubmit({ ...data, categories }))}
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

        {/* AddCategory and list */}
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
            onClick={() => {
              reset();
              router.push('/main/banks');
            }}
          />
          <Button
            styles="basis-1/2"
            content="Save Changes"
            props={{
              onClick: handleSubmit((data) => onSubmit({ ...data, categories })),
            }}
          />
        </div>
      </div>
    </div>
  );
}
