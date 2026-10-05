export type Language = 'ta' | 'en';

export type ProfileSeekingType = '' | 'bride' | 'groom';

export type MaritalStatusType =
  | ''
  | 'unmarried'
  | 'divorced'
  | 'widowed'
  | 'separated';

export type HouseStatusType = '' | 'own' | 'rental' | 'lease' | 'other';

export interface RegistrationFormData {
  // Section A — Personal Details
  profileType: ProfileSeekingType; // Bride (மணமகள்) / Groom (மணமகன்)
  fullName: string;
  dateOfBirth: string;
  age: string;
  height: string;
  maritalStatus: MaritalStatusType;

  // Section B — Family Details
  fatherName: string;
  motherName: string;
  fatherOccupation: string;
  motherOccupation: string;
  brothersCount: string;
  sistersCount: string;
  siblingMaritalDetails: string;
  familyOtherDetails: string;
  houseStatus: HouseStatusType;

  // Section C — Education & Career
  educationLevel: string;
  courseOrDegree: string;
  occupation: string;
  workLocation: string;
  income: string;
  careerOtherDetails: string;

  // Section D — Religion & Community
  religion: string;
  community: string;
  religionOtherDetails: string;

  // Section E — Location
  nativePlace: string;
  currentTownCity: string;
  district: string;
  state: string;
  country: string;

  // Section F — Expectations
  preferredAge: string;
  preferredLocation: string;
  preferredEducation: string;
  preferredOccupation: string;
  preferredReligionCommunity: string;
  otherExpectations: string; // Large natural-language textarea

  // Section G — Contact
  mobileNumber: string;
  whatsappNumber: string;
}

export type ValidationErrors = Partial<Record<keyof RegistrationFormData, string>>;

export const INITIAL_REGISTRATION_DATA: RegistrationFormData = {
  profileType: '',
  fullName: '',
  dateOfBirth: '',
  age: '',
  height: '',
  maritalStatus: 'unmarried',

  fatherName: '',
  motherName: '',
  fatherOccupation: '',
  motherOccupation: '',
  brothersCount: '0',
  sistersCount: '0',
  siblingMaritalDetails: '',
  familyOtherDetails: '',
  houseStatus: '',

  educationLevel: '',
  courseOrDegree: '',
  occupation: '',
  workLocation: '',
  income: '',
  careerOtherDetails: '',

  religion: '',
  community: '',
  religionOtherDetails: '',

  nativePlace: '',
  currentTownCity: '',
  district: '',
  state: 'Tamil Nadu',
  country: 'India',

  preferredAge: '',
  preferredLocation: '',
  preferredEducation: '',
  preferredOccupation: '',
  preferredReligionCommunity: '',
  otherExpectations: '',

  mobileNumber: '',
  whatsappNumber: '',
};
