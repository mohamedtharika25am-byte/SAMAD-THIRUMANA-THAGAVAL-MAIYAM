import {
  Language,
  RegistrationFormData,
  ValidationErrors,
} from '../types/registration';
import { getTranslation } from '../i18n/translations';

/**
 * Automatically calculates completed years of age from an ISO date string (YYYY-MM-DD).
 * Returns empty string if date is invalid or in the future.
 */
export function calculateAgeFromDob(dobString: string): string {
  if (!dobString) return '';
  const dob = new Date(dobString);
  if (Number.isNaN(dob.getTime())) return '';

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  if (age < 0 || age > 110) return '';
  return String(age);
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into DD/MM/YYYY for WhatsApp readability.
 */
export function formatDobForDisplay(dobString: string): string {
  if (!dobString) return '';
  const parts = dobString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dobString;
}

/**
 * Cleans phone numbers to digits only and checks if it's a valid 10-15 digit phone number.
 */
export function isValidPhoneNumber(input: string): boolean {
  const digits = input.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * Validates the registration form in the active language ('ta' | 'en').
 */
export function validateRegistrationForm(
  data: RegistrationFormData,
  lang: Language
): ValidationErrors {
  const t = getTranslation(lang).validation;
  const errors: ValidationErrors = {};

  if (!data.profileType) {
    errors.profileType = t.profileTypeRequired;
  }

  if (!data.fullName.trim()) {
    errors.fullName = t.fullNameRequired;
  }

  if (!data.dateOfBirth.trim() && !data.age.trim()) {
    errors.age = t.dobOrAgeRequired;
  } else if (data.age.trim()) {
    const numericAge = Number(data.age.trim());
    if (Number.isNaN(numericAge) || numericAge < 18 || numericAge > 75) {
      errors.age = t.ageInvalid;
    }
  }

  if (!data.height.trim()) {
    errors.height = t.heightRequired;
  }

  if (!data.fatherName.trim()) {
    errors.fatherName = t.fatherNameRequired;
  }

  if (!data.motherName.trim()) {
    errors.motherName = t.motherNameRequired;
  }

  if (!data.educationLevel.trim() && !data.courseOrDegree.trim()) {
    errors.educationLevel = t.educationRequired;
  }

  if (!data.occupation.trim()) {
    errors.occupation = t.occupationRequired;
  }

  if (!data.religion.trim()) {
    errors.religion = t.religionRequired;
  }

  if (!data.currentTownCity.trim()) {
    errors.currentTownCity = t.currentTownRequired;
  }

  if (!data.district.trim()) {
    errors.district = t.districtRequired;
  }

  const hasAnyExpectation =
    Boolean(data.otherExpectations.trim()) ||
    Boolean(data.preferredEducation.trim()) ||
    Boolean(data.preferredOccupation.trim()) ||
    Boolean(data.preferredAge.trim()) ||
    Boolean(data.preferredLocation.trim());

  if (!hasAnyExpectation) {
    errors.otherExpectations = t.expectationsRequired;
  }

  if (!data.mobileNumber.trim()) {
    errors.mobileNumber = t.mobileRequired;
  } else if (!isValidPhoneNumber(data.mobileNumber)) {
    errors.mobileNumber = t.mobileInvalid;
  }

  if (!data.whatsappNumber.trim()) {
    errors.whatsappNumber = t.whatsappRequired;
  } else if (!isValidPhoneNumber(data.whatsappNumber)) {
    errors.whatsappNumber = t.whatsappInvalid;
  }

  return errors;
}
