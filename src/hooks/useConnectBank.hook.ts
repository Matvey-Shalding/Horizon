import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { connectBankSchema, ConnectBankSchemaType } from 'schemas/connectBank.schema';
import { connectBankService } from 'services/ConnectBank.service';
import { RootState } from 'state/store';
import { Category } from 'types/Category.interface';
import { useImmer } from 'use-immer';
import { generateRandomNumber } from 'utils/generateRandomNumber';

/**
 * Hook for managing state and form logic in the ConnectBank component.
 * @returns Object containing state, form methods, selectors, routing, and handlers for the ConnectBank component.
 */
export const useConnectBankState = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const banks = useSelector((state: RootState) => state.bank.banks);
  const [categories, setCategories] = useImmer<Category[]>([]);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    watch,
    setError,
    clearErrors,
    reset,
  } = useForm<ConnectBankSchemaType>({
    resolver: zodResolver(connectBankSchema),
    defaultValues: { categories: [] },
  });

  const cardholderName = watch('cardholderName');

  // Sync categories with form
  useEffect(() => {
    setValue('categories', [...categories]);
  }, [categories, setValue]);

  // Validate cardholder name for duplicates
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

  /**
   * Handles form cancellation, resetting form and categories.
   */
  const handleCancel = () => {
    reset();
    setCategories([]);
  };

  /**
   * Handles form submission, connecting a new bank.
   * @param data - Form data for the new bank.
   */
  const handleSubmitBank = (data: ConnectBankSchemaType) => {
    connectBankService.connect(data, setError, reset, setCategories, dispatch, router);
  };

  /**
   * Generates and sets a random value for a form field.
   * @param field - Form field to set ('cardCvv' or 'cardId').
   * @param length - Number of digits for the random value.
   */
  const handleGenerateRandom = (field: 'cardCvv' | 'cardId', length: number) => {
    setValue(field, generateRandomNumber(length).toString());
  };

  const generateCVV = useCallback(() => {
    setValue('cardCvv', generateRandomNumber(3).toString());
  }, []);

  const generateCardId = useCallback(() => setValue('cardId', generateRandomNumber(12).toString()), []);

  return {
    generateCVV,
    generateCardId,
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
  };
};
