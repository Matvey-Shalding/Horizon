import { zodResolver } from '@hookform/resolvers/zod';
import { useMediaQuery } from '@react-hookz/web';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentTransferSchema, PaymentTransferSchemaType } from 'schemas/paymentTransfer.schema';
import { authorizationService } from 'services/Authorization.service';
import { paymentTransferService } from 'services/paymentTransfer.service';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { RootState } from 'state/store';
import { Bank } from 'types/Bank.interface';

/**
 * Hook for managing state and form logic in the PaymentTransferPage component.
 * @returns Object containing state, form methods, and handlers for the PaymentTransferPage component.
 */
export const usePaymentTransferState = () => {
  const banks: Bank[] = useSelector((state: RootState) => state.bank.banks);
  const dispatch = useDispatch();
  const paymentTransferSchema = getPaymentTransferSchema(banks);
  const [resetCounter, setResetCounter] = useState(0);
  const isTablet = useMediaQuery(`(max-width:${MEDIA_QUERIES.TABLETS})`);
  const user = useSelector((state: RootState) => state.user.user);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    setError,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<PaymentTransferSchemaType>({
    resolver: zodResolver(paymentTransferSchema),
    mode: 'onChange',
  });

  const sourceBank = watch('sourceBank');

  // Clear sourceBank error when it changes
  useEffect(() => {
    if (sourceBank) clearErrors('sourceBank');
  }, [sourceBank, clearErrors]);

  /**
   * Handles form submission, initiating fund transfer and resetting form.
   * @param data - Form data for the payment transfer.
   */
  const onSubmit = async (data: PaymentTransferSchemaType) => {
    setResetCounter((prev) => prev + 1);
    paymentTransferService.transferFunds({
      sourceBank: data.sourceBank,
      recipientAccount: data.recipientAccount,
      balance: data.balance,
      categoryId: data.categoryId,
      note: data.note,
      banks,
      dispatch,
      reset,
      clearErrors,
    });
    authorizationService.handleSaveData(user, banks);
  };

  /**
   * Handles form cancellation, resetting form state.
   */
  const handleCancel = () => {
    setResetCounter((prev) => prev + 1);
    paymentTransferService.resetFormState({ reset, clearErrors });
  };

  return {
    banks,
    dispatch,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    setError,
    getValues,
    errors,
    isSubmitted,
    sourceBank,
    resetCounter,
    setResetCounter,
    isTablet,
    onSubmit,
    handleCancel,
  };
};
