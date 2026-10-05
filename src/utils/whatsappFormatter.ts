import {
  HouseStatusType,
  Language,
  MaritalStatusType,
  ProfileSeekingType,
  RegistrationFormData,
} from '../types/registration';
import { formatDobForDisplay } from './validation';

function getProfileTypeLabel(type: ProfileSeekingType, lang: Language): string {
  if (type === 'groom') return lang === 'ta' ? 'மணமகன்' : 'Groom (மணமகன்)';
  if (type === 'bride') return lang === 'ta' ? 'மணமகள்' : 'Bride (மணமகள்)';
  return '-';
}

function getMaritalStatusLabel(
  status: MaritalStatusType,
  lang: Language
): string {
  const mapTa: Record<MaritalStatusType, string> = {
    '': '-',
    unmarried: 'திருமணம் ஆகாதவர்',
    divorced: 'விவாகரத்து ஆனவர்',
    widowed: 'துணையை இழந்தவர்',
    separated: 'பிரிந்து வாழ்பவர்',
  };
  const mapEn: Record<MaritalStatusType, string> = {
    '': '-',
    unmarried: 'Unmarried',
    divorced: 'Divorced',
    widowed: 'Widowed',
    separated: 'Separated',
  };
  return lang === 'ta' ? mapTa[status] : mapEn[status];
}

function getHouseStatusLabel(status: HouseStatusType, lang: Language): string {
  const mapTa: Record<HouseStatusType, string> = {
    '': '-',
    own: 'சொந்த வீடு',
    rental: 'வாடகை வீடு',
    lease: 'லீஸ் வீடு',
    other: 'மற்றவை',
  };
  const mapEn: Record<HouseStatusType, string> = {
    '': '-',
    own: 'Own House',
    rental: 'Rental House',
    lease: 'Lease House',
    other: 'Other',
  };
  return lang === 'ta' ? mapTa[status] : mapEn[status];
}

function formatSiblingsSummary(
  data: RegistrationFormData,
  lang: Language
): string {
  const parts: string[] = [];
  const bros = Number(data.brothersCount || 0);
  const siss = Number(data.sistersCount || 0);

  if (lang === 'ta') {
    if (bros > 0) parts.push(`${bros} சகோதரர்`);
    if (siss > 0) parts.push(`${siss} சகோதரி`);
    if (parts.length === 0 && !data.siblingMaritalDetails.trim()) {
      return 'உடன் பிறந்தோர் இல்லை';
    }
  } else {
    if (bros > 0) parts.push(`${bros} Brother${bros > 1 ? 's' : ''}`);
    if (siss > 0) parts.push(`${siss} Sister${siss > 1 ? 's' : ''}`);
    if (parts.length === 0 && !data.siblingMaritalDetails.trim()) {
      return 'No siblings';
    }
  }

  if (data.siblingMaritalDetails.trim()) {
    parts.push(data.siblingMaritalDetails.trim());
  }

  return parts.join(', ');
}

function formatEducationSummary(data: RegistrationFormData): string {
  const parts = [data.courseOrDegree.trim(), data.educationLevel.trim()].filter(
    Boolean
  );
  if (parts.length === 0) return '-';
  // Avoid duplicating if both have the same text
  if (
    parts.length === 2 &&
    parts[0].toLowerCase() === parts[1].toLowerCase()
  ) {
    return parts[0];
  }
  return parts.join(' - ');
}

function formatExpectationsSummary(
  data: RegistrationFormData,
  lang: Language
): string {
  const lines: string[] = [];

  if (data.otherExpectations.trim()) {
    lines.push(data.otherExpectations.trim());
  }

  const structured: string[] = [];
  if (data.preferredAge.trim()) {
    structured.push(
      lang === 'ta'
        ? `வயது: ${data.preferredAge.trim()}`
        : `Preferred Age: ${data.preferredAge.trim()}`
    );
  }
  if (data.preferredEducation.trim()) {
    structured.push(
      lang === 'ta'
        ? `படிப்பு: ${data.preferredEducation.trim()}`
        : `Preferred Education: ${data.preferredEducation.trim()}`
    );
  }
  if (data.preferredOccupation.trim()) {
    structured.push(
      lang === 'ta'
        ? `வேலை: ${data.preferredOccupation.trim()}`
        : `Preferred Occupation: ${data.preferredOccupation.trim()}`
    );
  }
  if (data.preferredLocation.trim()) {
    structured.push(
      lang === 'ta'
        ? `ஊர்: ${data.preferredLocation.trim()}`
        : `Preferred Location: ${data.preferredLocation.trim()}`
    );
  }
  if (data.preferredReligionCommunity.trim()) {
    structured.push(
      lang === 'ta'
        ? `மதம்/சமூகம்: ${data.preferredReligionCommunity.trim()}`
        : `Preferred Religion/Community: ${data.preferredReligionCommunity.trim()}`
    );
  }

  if (structured.length > 0) {
    lines.push(structured.join(' | '));
  }

  return lines.length > 0 ? lines.join('\n') : '-';
}

/**
 * Dedicated WhatsApp Message Formatter
 * Dynamically generates a clean, human-readable Tamil or English WhatsApp message
 * from the visitor's entered registration form data.
 */
export function formatWhatsAppRegistrationMessage(
  data: RegistrationFormData,
  lang: Language
): string {
  const dobFormatted = formatDobForDisplay(data.dateOfBirth) || '-';
  const educationSummary = formatEducationSummary(data);
  const siblingsSummary = formatSiblingsSummary(data, lang);
  const expectationsSummary = formatExpectationsSummary(data, lang);

  const fatherLine = [data.fatherName.trim(), data.fatherOccupation.trim()]
    .filter(Boolean)
    .join(' - ');
  const motherLine = [data.motherName.trim(), data.motherOccupation.trim()]
    .filter(Boolean)
    .join(' - ');
  const occupationLine = [
    data.occupation.trim(),
    data.workLocation.trim() ? `(${data.workLocation.trim()})` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const currentResidenceLine = [
    data.currentTownCity.trim(),
    data.district.trim() &&
    data.district.trim().toLowerCase() !==
      data.currentTownCity.trim().toLowerCase()
      ? data.district.trim()
      : '',
    data.state.trim() && data.state.trim().toLowerCase() !== 'tamil nadu'
      ? data.state.trim()
      : '',
    data.country.trim() && data.country.trim().toLowerCase() !== 'india'
      ? data.country.trim()
      : '',
  ]
    .filter(Boolean)
    .join(', ');

  const contactLine =
    data.whatsappNumber.trim() &&
    data.whatsappNumber.trim() !== data.mobileNumber.trim()
      ? `${data.mobileNumber.trim()} / WhatsApp: ${data.whatsappNumber.trim()}`
      : data.mobileNumber.trim();

  if (lang === 'ta') {
    const blocks: string[] = [
      'சமது திருமண தகவல் மையம்',
      'திருமண பதிவு விவரங்கள்',
      `பதிவு வகை:\n${getProfileTypeLabel(data.profileType, 'ta')}`,
      `பெயர்:\n${data.fullName.trim() || '-'}`,
      `பிறந்த தேதி:\n${dobFormatted}`,
      `வயது:\n${data.age.trim() || '-'}`,
      `உயரம்:\n${data.height.trim() || '-'}`,
      `திருமண நிலை:\n${getMaritalStatusLabel(data.maritalStatus, 'ta')}`,
      `படிப்பு:\n${educationSummary}`,
      `வேலை:\n${occupationLine || '-'}`,
      `வருமானம்:\n${data.income.trim() || '-'}`,
    ];

    if (data.careerOtherDetails.trim()) {
      blocks.push(`பணி கூடுதல் விவரம்:\n${data.careerOtherDetails.trim()}`);
    }

    blocks.push(
      `தந்தை:\n${fatherLine || '-'}`,
      `தாயார்:\n${motherLine || '-'}`,
      `உடன் பிறந்தோர்:\n${siblingsSummary}`,
      `வீடு:\n${getHouseStatusLabel(data.houseStatus, 'ta')}`
    );

    if (data.familyOtherDetails.trim()) {
      blocks.push(`குடும்ப விவரம்:\n${data.familyOtherDetails.trim()}`);
    }

    blocks.push(
      `மதம்:\n${data.religion.trim() || '-'}`,
      `சமூகம்:\n${data.community.trim() || '-'}`
    );

    if (data.religionOtherDetails.trim()) {
      blocks.push(`மதம்/சமூகம் கூடுதல் விவரம்:\n${data.religionOtherDetails.trim()}`);
    }

    blocks.push(
      `பூர்விகம்:\n${data.nativePlace.trim() || '-'}`,
      `வசிக்கும் ஊர்:\n${currentResidenceLine || '-'}`,
      `எதிர்பார்ப்பு:\n${expectationsSummary}`,
      `தொடர்பு:\n${contactLine || '-'}`
    );

    return blocks.join('\n\n');
  }

  // English Format
  const blocksEn: string[] = [
    'SAMAD THIRUMANA THAGAVAL MAIYAM',
    'சமது திருமண தகவல் மையம்',
    'MATRIMONIAL REGISTRATION DETAILS',
    `Registration Type:\n${getProfileTypeLabel(data.profileType, 'en')}`,
    `Full Name:\n${data.fullName.trim() || '-'}`,
    `Date of Birth:\n${dobFormatted}`,
    `Age:\n${data.age.trim() || '-'}`,
    `Height:\n${data.height.trim() || '-'}`,
    `Marital Status:\n${getMaritalStatusLabel(data.maritalStatus, 'en')}`,
    `Education:\n${educationSummary}`,
    `Occupation:\n${occupationLine || '-'}`,
    `Income:\n${data.income.trim() || '-'}`,
  ];

  if (data.careerOtherDetails.trim()) {
    blocksEn.push(`Additional Career Details:\n${data.careerOtherDetails.trim()}`);
  }

  blocksEn.push(
    `Father:\n${fatherLine || '-'}`,
    `Mother:\n${motherLine || '-'}`,
    `Siblings:\n${siblingsSummary}`,
    `House Status:\n${getHouseStatusLabel(data.houseStatus, 'en')}`
  );

  if (data.familyOtherDetails.trim()) {
    blocksEn.push(`Family Details:\n${data.familyOtherDetails.trim()}`);
  }

  blocksEn.push(
    `Religion:\n${data.religion.trim() || '-'}`,
    `Community:\n${data.community.trim() || '-'}`
  );

  if (data.religionOtherDetails.trim()) {
    blocksEn.push(`Other Community Details:\n${data.religionOtherDetails.trim()}`);
  }

  blocksEn.push(
    `Native Place:\n${data.nativePlace.trim() || '-'}`,
    `Current Residence:\n${currentResidenceLine || '-'}`,
    `Expectations:\n${expectationsSummary}`,
    `Contact:\n${contactLine || '-'}`
  );

  return blocksEn.join('\n\n');
}

/**
 * Safely encodes a WhatsApp click-to-chat URL.
 */
export function buildWhatsAppClickToChatUrl(
  destinationPhoneNumber: string,
  message: string
): string {
  const sanitizedPhone = destinationPhoneNumber.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${sanitizedPhone}?text=${encodedText}`;
}
