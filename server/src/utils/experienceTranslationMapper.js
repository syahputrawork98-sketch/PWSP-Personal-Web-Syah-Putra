const SUPPORTED_LOCALES = ['EN', 'ID', 'JA'];

/**
 * Normalizes the locale query parameter.
 * Case-insensitive, defaults to 'EN' if missing or invalid.
 * @param {string} locale 
 * @returns {string}
 */
const normalizeLocale = (locale) => {
  if (!locale || typeof locale !== 'string') {
    return 'EN';
  }
  const normalized = locale.toUpperCase();
  return SUPPORTED_LOCALES.includes(normalized) ? normalized : 'EN';
};

/**
 * Maps an Experience model with its translations to a flat, backward-compatible object.
 * Fallbacks: Requested locale -> EN -> Legacy Experience fields
 * @param {object} experience 
 * @param {string} requestedLocale 
 * @returns {object}
 */
const mapExperienceWithTranslation = (experience, requestedLocale) => {
  if (!experience) return null;

  const targetLocale = normalizeLocale(requestedLocale);
  const translations = experience.translations || [];

  // Find translation matching target locale
  let translation = translations.find(t => t.locale === targetLocale);

  // If requested locale is not found, fallback to EN
  if (!translation && targetLocale !== 'EN') {
    translation = translations.find(t => t.locale === 'EN');
  }

  // Get translation values, with fallback to legacy fields on the main Experience object
  const role = (translation && translation.role) || experience.role;
  const description = (translation && translation.description) || experience.description;
  const highlights = (translation && translation.highlights) || experience.highlights || [];

  // Available locales based on translations that exist in the database
  const availableLocales = translations.map(t => t.locale);

  // Return a flat, backward-compatible object
  return {
    id: experience.id,
    role,
    company: experience.company,
    location: experience.location,
    type: experience.type,
    startDate: experience.startDate,
    endDate: experience.endDate,
    isCurrent: experience.isCurrent,
    description,
    highlights,
    techStack: experience.techStack || [],
    status: experience.status,
    experienceKind: experience.experienceKind,
    order: experience.order,
    locale: translation ? translation.locale : 'EN', // The effective locale used
    availableLocales,
    createdAt: experience.createdAt,
    updatedAt: experience.updatedAt
  };
};

module.exports = {
  normalizeLocale,
  mapExperienceWithTranslation
};
