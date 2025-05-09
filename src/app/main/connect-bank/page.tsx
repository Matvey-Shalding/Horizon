"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryList } from "app/main/connect-bank/CategoryItem";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  connectBankSchema,
  ConnectBankSchemaType,
} from "schemas/connectBank.schema";
import { connectBankService } from "services/ConnectBank.service";
import { RootState } from "state/store";
import { Category } from "types/Category.interface";
import { AddCategoryForm } from "ui/AddCategory";
import { Button } from "ui/Button";
import { CancelButton } from "ui/CancelButton";
import { ErrorMessage } from "ui/Error";
import { Input } from "ui/Input";
import { Logo } from "ui/Logo";
import { useImmer } from "use-immer";
import { generateRandomNumber } from "utils/generateRandomNumber";

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { delay } },
});

export default function ConnectBank({}: {}) {
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
    defaultValues: {
      categories: [],
    },
  });

  const cardholderName = watch("cardholderName");

  const dispatch = useDispatch();
  const banks = useSelector((state: RootState) => state.bank.banks);

  const router = useRouter()

  const [categories, setCategories] = useImmer<Category[]>([]);

  useEffect(() => {
    setValue("categories", [...categories]);
  }, [categories, setValue]);

  useEffect(() => {
    if (!cardholderName) {
      clearErrors("cardholderName");
      return;
    }

    const isDuplicate = banks.some(
      (bank) =>
        bank.cardholderName.toLowerCase() === cardholderName.toLowerCase(),
    );

    if (isDuplicate) {
      setError("cardholderName", {
        type: "manual",
        message: "This cardholder name is already in use.",
      });
    } else {
      clearErrors("cardholderName");
    }
  }, [cardholderName, banks, setError, clearErrors]);

  const handleCancel = () => {
    reset();
    setCategories([]);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="flex min-h-screen w-full justify-center overflow-y-auto"
    >
      <motion.div className="w-115 py-17" {...fadeInUp()}>
        <Logo />
        <motion.div {...fadeInUp(0.1)} className="mt-4 flex flex-col gap-y-1">
          <span className="text-dark max-laptop:text-3xl/tight text-4xl/tight font-semibold">
            Connect bank
          </span>
          <span className="text-gray text-base/normal">
            Please enter your details
          </span>
        </motion.div>

        <motion.form {...fadeInUp(0.2)} className="mt-6 mb-4 space-y-4">
          {[
            {
              label: "Cardholder Name",
              field: "cardholderName",
              placeholder: "John Doe",
            },
            {
              label: "Initial Balance",
              field: "balance",
              placeholder: "0.00",
              type: "number",
            },
            {
              label: "Monthly Budget",
              field: "monthlyBudget",
              placeholder: "0.00",
              type: "number",
            },
          ].map(({ label, field, placeholder, type = "text" }, index) => (
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
                {...(type === "number" && { type, min: "1" })}
              />
              <ErrorMessage
                message={errors?.[field as keyof typeof errors]?.message}
              />
            </motion.div>
          ))}

          <motion.div {...fadeInUp(0.6)} className="flex flex-col gap-y-1">
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
                onClick={() => {
                  setValue("cardCvv", generateRandomNumber(3).toString());
                }}
                styles="basis-1/4 shrink-0"
                content="Generate"
                props={{ type: "button" }}
              />
            </div>
            <ErrorMessage message={errors.cardCvv?.message} />
          </motion.div>

          <motion.div {...fadeInUp(0.7)} className="flex flex-col gap-y-1">
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
                onClick={() =>
                  setValue("cardId", generateRandomNumber(12).toString())
                }
                styles="basis-1/4 shrink-0"
                content="Generate"
                props={{ type: "button" }}
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
          <CategoryList categories={categories} setCategories={setCategories} />
        </motion.div>

        <motion.div {...fadeInUp(1)} className="mb-2">
          <ErrorMessage message={errors.root?.message} />
        </motion.div>

        <motion.div
          {...fadeInUp(1.1)}
          className="flex gap-3 pb-17"
        >
          <CancelButton className='basis-1/2' onClick={handleCancel} />
          <Button           
            onClick={handleSubmit((data) =>
              connectBankService.connect(
                data,
                setError,
                reset,
                setCategories,
                dispatch,
                router
              ),
            )}
            content="Connect bank"
            styles='basis-1/2'
            props={{
              type: "button",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
