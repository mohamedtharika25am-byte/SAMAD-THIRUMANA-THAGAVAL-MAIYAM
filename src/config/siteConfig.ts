/**
 * Central Configuration for Samad Thirumana Thagaval Maiyam
 * =========================================================
 * All configurable placeholders (WhatsApp destination number, centre contact details,
 * and future Google Sheets Web App endpoint) are stored in this single file.
 */

export const SITE_CONFIG = {
  // Brand Names (Do not change the English brand name)
  brandNameEnglish: 'SAMAD THIRUMANA THAGAVAL MAIYAM',
  brandNameTamil: 'சமது திருமண தகவல் மையம்',

  /**
   * DESTINATION WHATSAPP NUMBER
   * Replace '919000000000' with the actual centre's WhatsApp number (country code + 10 digits, no '+' or spaces).
   * Can also be set via VITE_WHATSAPP_NUMBER in .env
   */
  whatsappDestinationNumber:
    import.meta.env.VITE_WHATSAPP_NUMBER || '919000000000',

  /**
   * FUTURE GOOGLE SHEETS WEB APP ENDPOINT
   * Leave empty in V1 until a Google Apps Script Web App URL is deployed.
   * Can also be set via VITE_GOOGLE_SHEETS_WEB_APP_URL in .env
   */
  googleSheetsWebAppUrl:
    import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL || '',

  /**
   * CONFIGURABLE CONTACT SECTION PLACEHOLDERS
   * Update these values when final office details are confirmed.
   */
  contactPlaceholders: {
    phoneDisplay:
      import.meta.env.VITE_CENTRE_PHONE_DISPLAY || '+91 90000 00000 (Placeholder)',
    whatsappDisplay: '+91 90000 00000 (Placeholder)',
    addressEnglish:
      'Main Road, Near Bus Stand, Your Town / District, Tamil Nadu (Configurable Office Address Placeholder)',
    addressTamil:
      'மெயின் ரோடு, பேருந்து நிலையம் அருகில், உங்கள் ஊர் / மாவட்டம், தமிழ்நாடு (முகவரி மாதிரி - மாற்றத்தக்கது)',
    workingHoursEnglish: 'Monday – Saturday: 9:30 AM – 7:30 PM | Sunday: By Appointment (Configurable)',
    workingHoursTamil: 'திங்கள் – சனி: காலை 9:30 – மாலை 7:30 | ஞாயிறு: முன்பதிவுடன் (மாற்றத்தக்கது)',
  },

  /**
   * Generated Visual Assets
   */
  images: {
    heroWedding: '/src/assets/images/hero_wedding_ceremony_1791183320357.jpg',
    aboutRings: '/src/assets/images/about_wedding_rings_1791183373438.jpg',
    traditionFloral: '/src/assets/images/tradition_floral_decor_1791183382675.jpg',
  },
} as const;
