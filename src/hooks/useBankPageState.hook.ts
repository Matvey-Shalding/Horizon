import { zodResolver } from '@hookform/resolvers/zod';
import { useMediaQuery } from '@react-hookz/web';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { connectBankSchema } from 'schemas/connectBank.schema';
import { authorizationService } from 'services/Authorization.service';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { setBanks } from 'state/main/bankSlice';
import { RootState } from 'state/store';
import { Bank } from 'types/Bank.interface';
import { Category } from 'types/Category.interface';
import { useImmer } from 'use-immer';
import { getBankFromSlug } from 'utils/getNameFromSlug';
import { z } from 'zod';

/**
 * Schema for editing bank details, omitting balance.
 */
const editSchema = connectBankSchema.omit({ balance: true });

/**
 * Type for the edit bank form.
 */
type EditSchemaType = z.infer<typeof editSchema>;

/**
 * Hook for managing state and form logic in the BankPage component.
 * @returns Object containing state, form methods, selectors, routing, and handlers for the BankPage component.
 */
export const useBankPageState = () => {
  const { bank: slug } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const banks = useSelector((state: RootState) => state.bank.banks);
  const user = useSelector((state: RootState) => state.user.user);
  const bank = getBankFromSlug(banks as any, slug?.toString() ?? '') as Bank | undefined;
  const [categories, setCategories] = useImmer<Category[]>(bank?.categories ?? []);
  const isDesktop = useMediaQuery(`(min-width:${MEDIA_QUERIES.DESKTOPS})`);

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

  // Sync categories with form
  useEffect(() => {
    setValue('categories', categories);
  }, [categories, setValue]);

  /**
   * Handles form submission, updating bank details and navigating back.
   * @param data - Form data for the bank details.
   */
  const onSubmit = useCallback(async (data: EditSchemaType) => {
    if (!bank) return;
    const updated = { ...bank, ...data } as Bank;
    const updatedBanks = banks.map((b) => (b.cardId === bank.cardId ? updated : b));
    dispatch(setBanks(updatedBanks));
    router.push('/main/banks');
    authorizationService.handleSaveData(user, updatedBanks);
  }, []);

  /**
   * Handles form cancellation, resetting form and navigating back.
   */
  const handleCancel = useCallback(() => {
    reset();
    router.push('/main/banks');
  }, []);

  /**
   * Navigates back to the banks list.
   */
  const handleBack = useCallback(() => {
    router.push('/main/banks');
  }, []);

  return {
    bank,
    user,
    categories,
    setCategories,
    isDesktop,
    register,
    handleSubmit,
    errors,
    cardholderName,
    reset,
    onSubmit,
    handleCancel,
    handleBack,
    setValue,
  };
};
