import React, { useRef, useState } from 'react';
import { Check, Copy, ExternalLink, AlertCircle, RotateCcw } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { getTranslation } from '../i18n/translations';
import { submitRegistrationToGoogleSheets } from '../services/googleSheetsService';
import {
  HouseStatusType,
  INITIAL_REGISTRATION_DATA,
  Language,
  MaritalStatusType,
  ProfileSeekingType,
  RegistrationFormData,
  ValidationErrors,
} from '../types/registration';
import {
  calculateAgeFromDob,
  validateRegistrationForm,
} from '../utils/validation';
import {
  buildWhatsAppClickToChatUrl,
  formatWhatsAppRegistrationMessage,
} from '../utils/whatsappFormatter';

interface RegistrationFormProps {
  lang: Language;
}

const HEIGHT_SUGGESTIONS = [
  '4.10 (147 cm)',
  '5.0 (152 cm)',
  '5.1 (155 cm)',
  '5.2 (157 cm)',
  '5.3 (160 cm)',
  '5.4 (162 cm)',
  '5.5 (165 cm)',
  '5.6 (168 cm)',
  '5.7 (170 cm)',
  '5.8 (173 cm)',
  '5.9 (175 cm)',
  '5.10 (178 cm)',
  '5.11 (180 cm)',
  '6.0 (183 cm)',
  '6.1+ (185+ cm)',
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ lang }) => {
  const [formData, setFormData] = useState<RegistrationFormData>(
    INITIAL_REGISTRATION_DATA
  );
  const [sameAsMobile, setSameAsMobile] = useState<boolean>(true);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [preparedWhatsAppMessage, setPreparedWhatsAppMessage] =
    useState<string>('');
  const [preparedWhatsAppUrl, setPreparedWhatsAppUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const previewRef = useRef<HTMLDivElement | null>(null);
  const hiddenWhatsAppLinkRef = useRef<HTMLAnchorElement | null>(null);

  const t = getTranslation(lang).registration;

  const updateField = <K extends keyof RegistrationFormData>(
    field: K,
    value: RegistrationFormData[K]
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      // Automatically calculate age when Date of Birth changes
      if (field === 'dateOfBirth') {
        const autoAge = calculateAgeFromDob(String(value));
        if (autoAge) {
          next.age = autoAge;
        }
      }

      // Sync WhatsApp number if "Same as Mobile" is enabled
      if (field === 'mobileNumber' && sameAsMobile) {
        next.whatsappNumber = String(value);
      }

      return next;
    });

    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSameAsMobileToggle = (checked: boolean) => {
    setSameAsMobile(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: prev.mobileNumber,
      }));
      if (errors.whatsappNumber) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.whatsappNumber;
          return copy;
        });
      }
    }
  };

  const handleAppendExpectationSentence = (sentence: string) => {
    setFormData((prev) => {
      const current = prev.otherExpectations.trim();
      const updated = current ? `${current} ${sentence}` : sentence;
      return { ...prev, otherExpectations: updated };
    });
    if (errors.otherExpectations) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.otherExpectations;
        return copy;
      });
    }
  };

  const handleResetForm = () => {
    setFormData(INITIAL_REGISTRATION_DATA);
    setErrors({});
    setHasAttemptedSubmit(false);
    setPreparedWhatsAppMessage('');
    setPreparedWhatsAppUrl('');
    setCopied(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent accidental duplicate clicks

    setHasAttemptedSubmit(true);
    const validationErrors = validateRegistrationForm(formData, lang);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Scroll smoothly to first invalid field
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus({ preventScroll: true });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Dynamically format WhatsApp message in selected language
      const message = formatWhatsAppRegistrationMessage(formData, lang);
      const whatsappUrl = buildWhatsAppClickToChatUrl(
        SITE_CONFIG.whatsappDestinationNumber,
        message
      );

      setPreparedWhatsAppMessage(message);
      setPreparedWhatsAppUrl(whatsappUrl);

      // 2. Non-blocking future Google Sheets submission placeholder
      void submitRegistrationToGoogleSheets(formData, lang);

      // 3. Scroll to confirmation preview & trigger WhatsApp link in new tab
      setTimeout(() => {
        if (previewRef.current) {
          previewRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
        if (hiddenWhatsAppLinkRef.current) {
          hiddenWhatsAppLinkRef.current.click();
        }
      }, 120);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 800);
    }
  };

  const handleCopyMessage = async () => {
    if (!preparedWhatsAppMessage) return;
    try {
      await navigator.clipboard.writeText(preparedWhatsAppMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard permission denied
      setCopied(false);
    }
  };

  const inputBaseClass = (hasError?: boolean) =>
    `w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#23181A] bg-white placeholder:text-[#968379] transition-colors focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]/20'
        : 'border-[#D8CBB8] focus:border-[#7A1C2E] focus:ring-[#7A1C2E]/20'
    }`;

  return (
    <section
      id="registration"
      className="border-b border-[#E6DDD2] bg-[#F4EFE6] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="border-b border-[#DFD3C3] pb-8">
          <p className="text-xs font-semibold tracking-wider text-[#7A1C2E]">
            {t.eyebrow}
          </p>
          <h2
            className="mt-2 font-serif-display text-3xl font-semibold text-[#23181A] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {t.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5A484B] sm:text-base">
            {t.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-medium text-[#6B5A5D]">
              <span>{t.noFeeNote}</span>
              <span className="mx-2 text-[#B5A192]">·</span>
              <span className="font-semibold text-[#7A1C2E]">
                {t.requiredNote}
              </span>
            </div>

            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#D8CBB8] bg-[#FAF7F2] px-3 py-1.5 text-xs font-medium text-[#524144] transition-colors hover:bg-[#EFE7DC] hover:text-[#23181A]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t.clearFormBtn}</span>
            </button>
          </div>
        </div>

        {/* Global Validation Alert Banner */}
        {hasAttemptedSubmit && Object.keys(errors).length > 0 && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-[#DC2626]/40 bg-[#FEF2F2] p-4 text-sm text-[#991B1B]"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#DC2626]" />
            <div>
              <p className="font-semibold">{t.validationBanner}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
          {/* =========================================================
              SECTION A — PERSONAL DETAILS
          ========================================================= */}
          <div className="rounded-2xl border border-[#E0D5C7] bg-[#FAF7F2] p-6 sm:p-8">
            <div className="border-b border-[#EAE0D3] pb-4">
              <span className="text-xs font-semibold text-[#9B7418]">
                {t.sections.a.step}
              </span>
              <h3 className="mt-1 font-serif-display text-2xl font-semibold text-[#23181A]">
                {t.sections.a.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#6B5A5D]">
                {t.sections.a.desc}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Bride / Groom Radio Toggle */}
              <div className="sm:col-span-2" id="field-profileType" tabIndex={-1}>
                <label className="block text-sm font-semibold text-[#23181A]">
                  {t.fields.profileType} <span className="text-[#B91C1C]">*</span>
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:max-w-md">
                  {(
                    [
                      { value: 'groom', label: t.fields.profileTypeGroom },
                      { value: 'bride', label: t.fields.profileTypeBride },
                    ] as { value: ProfileSeekingType; label: string }[]
                  ).map((option) => {
                    const selected = formData.profileType === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('profileType', option.value)}
                        aria-pressed={selected}
                        className={`flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                          selected
                            ? 'border-[#7A1C2E] bg-[#7A1C2E] text-white'
                            : 'border-[#D8CBB8] bg-white text-[#38272A] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                {errors.profileType && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.profileType}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="field-fullName"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.fullName} <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder={t.fields.fullNamePlaceholder}
                  className={`mt-1.5 ${inputBaseClass(Boolean(errors.fullName))}`}
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="field-dateOfBirth"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.dateOfBirth}
                </label>
                <input
                  id="field-dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Age (Auto-calculated from DOB, editable) */}
              <div>
                <label
                  htmlFor="field-age"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.age} <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-age"
                  type="number"
                  min={18}
                  max={75}
                  value={formData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  placeholder={t.fields.agePlaceholder}
                  className={`mt-1.5 tabular-nums ${inputBaseClass(Boolean(errors.age))}`}
                />
                <p className="mt-1 text-xs text-[#6B5A5D]">
                  {t.fields.ageHelper}
                </p>
                {errors.age && (
                  <p className="mt-1 text-xs font-medium text-[#B91C1C]">
                    {errors.age}
                  </p>
                )}
              </div>

              {/* Height */}
              <div>
                <label
                  htmlFor="field-height"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.height} <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-height"
                  type="text"
                  list="height-options-list"
                  value={formData.height}
                  onChange={(e) => updateField('height', e.target.value)}
                  placeholder={t.fields.heightPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(Boolean(errors.height))}`}
                />
                <datalist id="height-options-list">
                  {HEIGHT_SUGGESTIONS.map((h) => (
                    <option key={h} value={h} />
                  ))}
                </datalist>
                {errors.height && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.height}
                  </p>
                )}
              </div>

              {/* Marital Status */}
              <div>
                <label
                  htmlFor="field-maritalStatus"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.maritalStatus}
                </label>
                <select
                  id="field-maritalStatus"
                  value={formData.maritalStatus}
                  onChange={(e) =>
                    updateField(
                      'maritalStatus',
                      e.target.value as MaritalStatusType
                    )
                  }
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                >
                  <option value="unmarried">
                    {t.fields.maritalOptions.unmarried}
                  </option>
                  <option value="divorced">
                    {t.fields.maritalOptions.divorced}
                  </option>
                  <option value="widowed">
                    {t.fields.maritalOptions.widowed}
                  </option>
                  <option value="separated">
                    {t.fields.maritalOptions.separated}
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* =========================================================
              SECTION B — FAMILY DETAILS
          ========================================================= */}
          <div className="rounded-2xl border border-[#E0D5C7] bg-[#FAF7F2] p-6 sm:p-8">
            <div className="border-b border-[#EAE0D3] pb-4">
              <span className="text-xs font-semibold text-[#9B7418]">
                {t.sections.b.step}
              </span>
              <h3 className="mt-1 font-serif-display text-2xl font-semibold text-[#23181A]">
                {t.sections.b.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#6B5A5D]">
                {t.sections.b.desc}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Father's Name */}
              <div>
                <label
                  htmlFor="field-fatherName"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.fatherName} <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-fatherName"
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => updateField('fatherName', e.target.value)}
                  placeholder={t.fields.fatherNamePlaceholder}
                  className={`mt-1.5 ${inputBaseClass(Boolean(errors.fatherName))}`}
                />
                {errors.fatherName && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.fatherName}
                  </p>
                )}
              </div>

              {/* Father's Occupation */}
              <div>
                <label
                  htmlFor="field-fatherOccupation"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.fatherOccupation}
                </label>
                <input
                  id="field-fatherOccupation"
                  type="text"
                  value={formData.fatherOccupation}
                  onChange={(e) =>
                    updateField('fatherOccupation', e.target.value)
                  }
                  placeholder={t.fields.fatherOccupationPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Mother's Name */}
              <div>
                <label
                  htmlFor="field-motherName"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.motherName} <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-motherName"
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => updateField('motherName', e.target.value)}
                  placeholder={t.fields.motherNamePlaceholder}
                  className={`mt-1.5 ${inputBaseClass(Boolean(errors.motherName))}`}
                />
                {errors.motherName && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.motherName}
                  </p>
                )}
              </div>

              {/* Mother's Occupation */}
              <div>
                <label
                  htmlFor="field-motherOccupation"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.motherOccupation}
                </label>
                <input
                  id="field-motherOccupation"
                  type="text"
                  value={formData.motherOccupation}
                  onChange={(e) =>
                    updateField('motherOccupation', e.target.value)
                  }
                  placeholder={t.fields.motherOccupationPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Number of Brothers */}
              <div>
                <label
                  htmlFor="field-brothersCount"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.brothersCount}
                </label>
                <select
                  id="field-brothersCount"
                  value={formData.brothersCount}
                  onChange={(e) => updateField('brothersCount', e.target.value)}
                  className={`mt-1.5 tabular-nums ${inputBaseClass(false)}`}
                >
                  {['0', '1', '2', '3', '4', '5+'].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Sisters */}
              <div>
                <label
                  htmlFor="field-sistersCount"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.sistersCount}
                </label>
                <select
                  id="field-sistersCount"
                  value={formData.sistersCount}
                  onChange={(e) => updateField('sistersCount', e.target.value)}
                  className={`mt-1.5 tabular-nums ${inputBaseClass(false)}`}
                >
                  {['0', '1', '2', '3', '4', '5+'].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Married / Unmarried Sibling Details */}
              <div>
                <label
                  htmlFor="field-siblingMaritalDetails"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.siblingMaritalDetails}
                </label>
                <input
                  id="field-siblingMaritalDetails"
                  type="text"
                  value={formData.siblingMaritalDetails}
                  onChange={(e) =>
                    updateField('siblingMaritalDetails', e.target.value)
                  }
                  placeholder={t.fields.siblingMaritalPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* House Status */}
              <div>
                <label
                  htmlFor="field-houseStatus"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.houseStatus}
                </label>
                <select
                  id="field-houseStatus"
                  value={formData.houseStatus}
                  onChange={(e) =>
                    updateField('houseStatus', e.target.value as HouseStatusType)
                  }
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                >
                  <option value="">{t.fields.houseOptions.select}</option>
                  <option value="own">{t.fields.houseOptions.own}</option>
                  <option value="rental">{t.fields.houseOptions.rental}</option>
                  <option value="lease">{t.fields.houseOptions.lease}</option>
                  <option value="other">{t.fields.houseOptions.other}</option>
                </select>
              </div>

              {/* Family / Other Relevant Details */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="field-familyOtherDetails"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.familyOtherDetails}
                </label>
                <textarea
                  id="field-familyOtherDetails"
                  rows={2}
                  value={formData.familyOtherDetails}
                  onChange={(e) =>
                    updateField('familyOtherDetails', e.target.value)
                  }
                  placeholder={t.fields.familyOtherPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>
            </div>
          </div>

          {/* =========================================================
              SECTION C — EDUCATION & CAREER
          ========================================================= */}
          <div className="rounded-2xl border border-[#E0D5C7] bg-[#FAF7F2] p-6 sm:p-8">
            <div className="border-b border-[#EAE0D3] pb-4">
              <span className="text-xs font-semibold text-[#9B7418]">
                {t.sections.c.step}
              </span>
              <h3 className="mt-1 font-serif-display text-2xl font-semibold text-[#23181A]">
                {t.sections.c.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#6B5A5D]">
                {t.sections.c.desc}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Education Level */}
              <div>
                <label
                  htmlFor="field-educationLevel"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.educationLevel}{' '}
                  <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-educationLevel"
                  type="text"
                  value={formData.educationLevel}
                  onChange={(e) =>
                    updateField('educationLevel', e.target.value)
                  }
                  placeholder={t.fields.educationLevelPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(Boolean(errors.educationLevel))}`}
                />
                {errors.educationLevel && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.educationLevel}
                  </p>
                )}
              </div>

              {/* Course / Degree */}
              <div>
                <label
                  htmlFor="field-courseOrDegree"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.courseOrDegree}
                </label>
                <input
                  id="field-courseOrDegree"
                  type="text"
                  value={formData.courseOrDegree}
                  onChange={(e) =>
                    updateField('courseOrDegree', e.target.value)
                  }
                  placeholder={t.fields.courseOrDegreePlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Occupation */}
              <div>
                <label
                  htmlFor="field-occupation"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.occupation} <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => updateField('occupation', e.target.value)}
                  placeholder={t.fields.occupationPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(Boolean(errors.occupation))}`}
                />
                {errors.occupation && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.occupation}
                  </p>
                )}
              </div>

              {/* Work Location */}
              <div>
                <label
                  htmlFor="field-workLocation"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.workLocation}
                </label>
                <input
                  id="field-workLocation"
                  type="text"
                  value={formData.workLocation}
                  onChange={(e) => updateField('workLocation', e.target.value)}
                  placeholder={t.fields.workLocationPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Income */}
              <div>
                <label
                  htmlFor="field-income"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.income}
                </label>
                <input
                  id="field-income"
                  type="text"
                  value={formData.income}
                  onChange={(e) => updateField('income', e.target.value)}
                  placeholder={t.fields.incomePlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Additional Career Details */}
              <div>
                <label
                  htmlFor="field-careerOtherDetails"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.careerOtherDetails}
                </label>
                <input
                  id="field-careerOtherDetails"
                  type="text"
                  value={formData.careerOtherDetails}
                  onChange={(e) =>
                    updateField('careerOtherDetails', e.target.value)
                  }
                  placeholder={t.fields.careerOtherPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>
            </div>
          </div>

          {/* =========================================================
              SECTION D — RELIGION & COMMUNITY
          ========================================================= */}
          <div className="rounded-2xl border border-[#E0D5C7] bg-[#FAF7F2] p-6 sm:p-8">
            <div className="border-b border-[#EAE0D3] pb-4">
              <span className="text-xs font-semibold text-[#9B7418]">
                {t.sections.d.step}
              </span>
              <h3 className="mt-1 font-serif-display text-2xl font-semibold text-[#23181A]">
                {t.sections.d.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#6B5A5D]">
                {t.sections.d.desc}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Religion (Configurable text + quick select buttons) */}
              <div>
                <label
                  htmlFor="field-religion"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.religion} <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-religion"
                  type="text"
                  value={formData.religion}
                  onChange={(e) => updateField('religion', e.target.value)}
                  placeholder={t.fields.religionPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(Boolean(errors.religion))}`}
                />
                {/* Interactive Quick-Select Buttons */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-[#6B5A5D]">
                    {t.fields.religionQuickPick}
                  </span>
                  {t.fields.religionSuggestions.map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => updateField('religion', rel)}
                      className={`whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                        formData.religion === rel
                          ? 'border-[#7A1C2E] bg-[#7A1C2E] text-white'
                          : 'border-[#D8CBB8] bg-white text-[#524144] hover:bg-[#F2EBE1]'
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
                {errors.religion && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.religion}
                  </p>
                )}
              </div>

              {/* Community */}
              <div>
                <label
                  htmlFor="field-community"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.community}
                </label>
                <input
                  id="field-community"
                  type="text"
                  value={formData.community}
                  onChange={(e) => updateField('community', e.target.value)}
                  placeholder={t.fields.communityPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Religion / Community Other Details */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="field-religionOtherDetails"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.religionOtherDetails}
                </label>
                <input
                  id="field-religionOtherDetails"
                  type="text"
                  value={formData.religionOtherDetails}
                  onChange={(e) =>
                    updateField('religionOtherDetails', e.target.value)
                  }
                  placeholder={t.fields.religionOtherPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>
            </div>
          </div>

          {/* =========================================================
              SECTION E — LOCATION
          ========================================================= */}
          <div className="rounded-2xl border border-[#E0D5C7] bg-[#FAF7F2] p-6 sm:p-8">
            <div className="border-b border-[#EAE0D3] pb-4">
              <span className="text-xs font-semibold text-[#9B7418]">
                {t.sections.e.step}
              </span>
              <h3 className="mt-1 font-serif-display text-2xl font-semibold text-[#23181A]">
                {t.sections.e.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#6B5A5D]">
                {t.sections.e.desc}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Native Place */}
              <div>
                <label
                  htmlFor="field-nativePlace"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.nativePlace}
                </label>
                <input
                  id="field-nativePlace"
                  type="text"
                  value={formData.nativePlace}
                  onChange={(e) => updateField('nativePlace', e.target.value)}
                  placeholder={t.fields.nativePlacePlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Current Residential Town/City */}
              <div>
                <label
                  htmlFor="field-currentTownCity"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.currentTownCity}{' '}
                  <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-currentTownCity"
                  type="text"
                  value={formData.currentTownCity}
                  onChange={(e) =>
                    updateField('currentTownCity', e.target.value)
                  }
                  placeholder={t.fields.currentTownCityPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(Boolean(errors.currentTownCity))}`}
                />
                {errors.currentTownCity && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.currentTownCity}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label
                  htmlFor="field-district"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.district} <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-district"
                  type="text"
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  placeholder={t.fields.districtPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(Boolean(errors.district))}`}
                />
                {errors.district && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.district}
                  </p>
                )}
              </div>

              {/* State & Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="field-state"
                    className="block text-sm font-semibold text-[#23181A]"
                  >
                    {t.fields.state}
                  </label>
                  <input
                    id="field-state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    placeholder={t.fields.statePlaceholder}
                    className={`mt-1.5 ${inputBaseClass(false)}`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="field-country"
                    className="block text-sm font-semibold text-[#23181A]"
                  >
                    {t.fields.country}
                  </label>
                  <input
                    id="field-country"
                    type="text"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    placeholder={t.fields.countryPlaceholder}
                    className={`mt-1.5 ${inputBaseClass(false)}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              SECTION F — EXPECTATIONS
          ========================================================= */}
          <div className="rounded-2xl border border-[#E0D5C7] bg-[#FAF7F2] p-6 sm:p-8">
            <div className="border-b border-[#EAE0D3] pb-4">
              <span className="text-xs font-semibold text-[#9B7418]">
                {t.sections.f.step}
              </span>
              <h3 className="mt-1 font-serif-display text-2xl font-semibold text-[#23181A]">
                {t.sections.f.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#6B5A5D]">
                {t.sections.f.desc}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Preferred Age */}
              <div>
                <label
                  htmlFor="field-preferredAge"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.preferredAge}
                </label>
                <input
                  id="field-preferredAge"
                  type="text"
                  value={formData.preferredAge}
                  onChange={(e) => updateField('preferredAge', e.target.value)}
                  placeholder={t.fields.preferredAgePlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Preferred Location */}
              <div>
                <label
                  htmlFor="field-preferredLocation"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.preferredLocation}
                </label>
                <input
                  id="field-preferredLocation"
                  type="text"
                  value={formData.preferredLocation}
                  onChange={(e) =>
                    updateField('preferredLocation', e.target.value)
                  }
                  placeholder={t.fields.preferredLocationPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Preferred Education */}
              <div>
                <label
                  htmlFor="field-preferredEducation"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.preferredEducation}
                </label>
                <input
                  id="field-preferredEducation"
                  type="text"
                  value={formData.preferredEducation}
                  onChange={(e) =>
                    updateField('preferredEducation', e.target.value)
                  }
                  placeholder={t.fields.preferredEducationPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Preferred Occupation */}
              <div>
                <label
                  htmlFor="field-preferredOccupation"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.preferredOccupation}
                </label>
                <input
                  id="field-preferredOccupation"
                  type="text"
                  value={formData.preferredOccupation}
                  onChange={(e) =>
                    updateField('preferredOccupation', e.target.value)
                  }
                  placeholder={t.fields.preferredOccupationPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Preferred Religion / Community */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="field-preferredReligionCommunity"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.preferredReligionCommunity}
                </label>
                <input
                  id="field-preferredReligionCommunity"
                  type="text"
                  value={formData.preferredReligionCommunity}
                  onChange={(e) =>
                    updateField('preferredReligionCommunity', e.target.value)
                  }
                  placeholder={t.fields.preferredReligionPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(false)}`}
                />
              </div>

              {/* Large Natural-Language Textarea: "Other Expectations / எதிர்பார்ப்பு" */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="field-otherExpectations"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.otherExpectations}{' '}
                  <span className="text-[#B91C1C]">*</span>
                </label>
                <textarea
                  id="field-otherExpectations"
                  rows={4}
                  value={formData.otherExpectations}
                  onChange={(e) =>
                    updateField('otherExpectations', e.target.value)
                  }
                  placeholder={t.fields.otherExpectationsPlaceholder}
                  className={`mt-1.5 ${inputBaseClass(Boolean(errors.otherExpectations))}`}
                />
                {errors.otherExpectations && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.otherExpectations}
                  </p>
                )}

                {/* Helpful Natural-Sentence Quick-Insert Buttons */}
                <div className="mt-3">
                  <p className="text-xs font-medium text-[#6B5A5D]">
                    {t.fields.expectationExamplesLabel}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {t.fields.expectationExamples.map((sentence) => (
                      <button
                        key={sentence}
                        type="button"
                        onClick={() =>
                          handleAppendExpectationSentence(sentence)
                        }
                        className="rounded-lg border border-[#D8CBB8] bg-white px-3 py-1.5 text-left text-xs text-[#4B3B3E] transition-colors hover:border-[#7A1C2E] hover:bg-[#F4EFE6]"
                      >
                        + {sentence}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              SECTION G — CONTACT DETAILS
          ========================================================= */}
          <div className="rounded-2xl border border-[#E0D5C7] bg-[#FAF7F2] p-6 sm:p-8">
            <div className="border-b border-[#EAE0D3] pb-4">
              <span className="text-xs font-semibold text-[#9B7418]">
                {t.sections.g.step}
              </span>
              <h3 className="mt-1 font-serif-display text-2xl font-semibold text-[#23181A]">
                {t.sections.g.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#6B5A5D]">
                {t.sections.g.desc}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Mobile Number */}
              <div>
                <label
                  htmlFor="field-mobileNumber"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.mobileNumber}{' '}
                  <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-mobileNumber"
                  type="tel"
                  inputMode="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => updateField('mobileNumber', e.target.value)}
                  placeholder={t.fields.mobileNumberPlaceholder}
                  className={`mt-1.5 tabular-nums ${inputBaseClass(Boolean(errors.mobileNumber))}`}
                />
                {errors.mobileNumber && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label
                  htmlFor="field-whatsappNumber"
                  className="block text-sm font-semibold text-[#23181A]"
                >
                  {t.fields.whatsappNumber}{' '}
                  <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-whatsappNumber"
                  type="tel"
                  inputMode="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => {
                    setSameAsMobile(false);
                    updateField('whatsappNumber', e.target.value);
                  }}
                  placeholder={t.fields.whatsappNumberPlaceholder}
                  className={`mt-1.5 tabular-nums ${inputBaseClass(Boolean(errors.whatsappNumber))}`}
                />
                {errors.whatsappNumber && (
                  <p className="mt-1.5 text-xs font-medium text-[#B91C1C]">
                    {errors.whatsappNumber}
                  </p>
                )}
              </div>

              {/* Same as Mobile Checkbox */}
              <div className="sm:col-span-2">
                <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-[#38272A]">
                  <input
                    type="checkbox"
                    checked={sameAsMobile}
                    onChange={(e) =>
                      handleSameAsMobileToggle(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-[#C2B19C] text-[#7A1C2E] focus:ring-[#7A1C2E]"
                  />
                  <span>{t.fields.sameAsMobile}</span>
                </label>
              </div>

              {/* Privacy & Sensitive Data Notice */}
              <div className="sm:col-span-2 border-t border-[#EAE0D3] pt-4">
                <p className="text-xs leading-relaxed text-[#5A484B]">
                  {t.fields.privacyReassurance}
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================
              MAIN WHATSAPP SUBMISSION BUTTON
          ========================================================= */}
          <div className="rounded-2xl border border-[#C59B27]/50 bg-[#231216] p-6 text-center sm:p-8">
            <p className="text-xs font-medium text-[#E7C888]">
              {SITE_CONFIG.brandNameTamil} · {SITE_CONFIG.brandNameEnglish}
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#15803D] px-6 py-4 text-base font-bold text-white shadow-sm transition-colors duration-150 hover:bg-[#166534] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[340px] sm:px-10"
            >
              <span>{isSubmitting ? t.submittingBtn : t.submitBtn}</span>
            </button>
            <p className="mt-3 text-xs text-[#D8C8B8]">
              {lang === 'ta'
                ? 'WhatsApp திறந்தவுடன் விவரங்களைச் சரிபார்த்து "Send" பொத்தானை அழுத்தவும்.'
                : 'WhatsApp will open with your formatted details pre-filled so you can review and press Send manually.'}
            </p>
          </div>
        </form>

        {/* Hidden anchor for triggering WhatsApp click-to-chat cleanly in a new tab */}
        <a
          ref={hiddenWhatsAppLinkRef}
          href={preparedWhatsAppUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        >
          Open WhatsApp
        </a>

        {/* =========================================================
            SUCCESS & FORMATTED WHATSAPP MESSAGE PREVIEW STATE
        ========================================================= */}
        {preparedWhatsAppMessage && (
          <div
            ref={previewRef}
            className="mt-8 rounded-2xl border-2 border-[#15803D] bg-[#FAF7F2] p-6 sm:p-8"
          >
            <div className="flex flex-col justify-between gap-4 border-b border-[#E6DDD2] pb-5 sm:flex-row sm:items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#15803D]">
                  <Check className="h-4 w-4" />
                  <span>
                    {lang === 'ta'
                      ? 'படிவம் சரிபார்க்கப்பட்டது'
                      : 'Form Validated Successfully'}
                  </span>
                </div>
                <h3 className="mt-1 font-serif-display text-2xl font-semibold text-[#23181A]">
                  {t.previewTitle}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#5A484B]">
                  {t.previewSubtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={preparedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#15803D] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#166534] sm:text-sm"
                >
                  <span>{t.openWhatsAppNowBtn}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-[#D8CBB8] bg-white px-4 py-3 text-xs font-semibold text-[#23181A] transition-colors hover:bg-[#F2EBE1] sm:text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-[#15803D]" />
                      <span>{t.copiedBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-[#6B5A5D]" />
                      <span>{t.copyMessageBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Formatted Message Preview Box */}
            <div className="mt-5 rounded-xl border border-[#E2D6C8] bg-white p-4 sm:p-6">
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-[#23181A]">
                {preparedWhatsAppMessage}
              </pre>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
