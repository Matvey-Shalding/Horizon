/**
 * Interface representing the data structure for user sign-up information
 * @interface SingUp
 */
export interface SingUp {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's street address */
  address: string;
  /** User's state of residence */
  state: string;
  /** User's postal/zip code */
  postalCode: string;
  /** User's date of birth (format: YYYY-MM-DD) */
  dateOfBirth: string;
  /** User's Social Security Number */
  SSN: string;
  /** User's account password */
  password: string;
  /** User's email address */
  email: string;
}


/**
 * Interface representing the data structure for user login credentials
 * @interface LogIn
 */
export interface LogIn {
  /** User's account password */
  password: string;
  /** User's email address */
  email: string;
}
