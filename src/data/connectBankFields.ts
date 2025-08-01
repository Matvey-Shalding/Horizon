/**
 * Interface defining the structure of a form field configuration.
 */
interface FormField {
  /** The label displayed for the form field. */
  label: string;
  /** The field name used in the form schema and register function. */
  field: 'cardholderName' | 'balance' | 'monthlyBudget';
  /** The placeholder text for the input field. */
  placeholder: string;
  /** The input type, defaults to 'text' if not specified. */
  type?: 'text' | 'number';
}

/**
 * Array of form field configurations for the ConnectBank form.
 * @constant
 * @type {ReadonlyArray<FormField>}
 */
export const connectBankFields: ReadonlyArray<FormField> = [
  {
    label: 'Cardholder Name',
    field: 'cardholderName',
    placeholder: 'John Doe',
  },
  {
    label: 'Initial Balance',
    field: 'balance',
    placeholder: '0.00',
    type: 'number',
  },
  {
    label: 'Monthly Budget',
    field: 'monthlyBudget',
    placeholder: '0.00',
    type: 'number',
  },
] as const;
