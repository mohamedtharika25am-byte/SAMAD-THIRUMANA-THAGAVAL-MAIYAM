import { SITE_CONFIG } from '../config/siteConfig';
import { Language, RegistrationFormData } from '../types/registration';

export interface GoogleSheetsSubmissionPayload {
  submittedAtIso: string;
  selectedLanguage: Language;
  formData: RegistrationFormData;
}

export interface GoogleSheetsSubmissionResult {
  configured: boolean;
  submitted: boolean;
  error?: string;
}

/**
 * Future Google Sheets Integration Service
 * ========================================
 * Prepared for future connection to a Google Apps Script Web App endpoint.
 *
 * Security & Architecture Notes:
 * - Never place private Google Service Account keys or API secrets in frontend code.
 * - When ready, deploy a Google Apps Script Web App (`doPost(e)`) attached to the centre's
 *   Google Sheet and set `VITE_GOOGLE_SHEETS_WEB_APP_URL` in `.env` (or `SITE_CONFIG.googleSheetsWebAppUrl`).
 * - Even if Google Sheets is not configured or fails, WhatsApp registration continues uninterrupted.
 */
export async function submitRegistrationToGoogleSheets(
  formData: RegistrationFormData,
  selectedLanguage: Language
): Promise<GoogleSheetsSubmissionResult> {
  const endpointUrl = SITE_CONFIG.googleSheetsWebAppUrl.trim();

  const payload: GoogleSheetsSubmissionPayload = {
    submittedAtIso: new Date().toISOString(),
    selectedLanguage,
    formData,
  };

  // In V1, if no Google Apps Script Web App endpoint is configured, skip network call gracefully
  if (!endpointUrl) {
    return {
      configured: false,
      submitted: false,
    };
  }

  try {
    await fetch(endpointUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      configured: true,
      submitted: true,
    };
  } catch (err) {
    return {
      configured: true,
      submitted: false,
      error: err instanceof Error ? err.message : 'Submission error',
    };
  }
}
