const prisma = require('../lib/prisma');

// F03T Multilingual Configs & Helpers
const SUPPORTED_LOCALES = ["EN", "ID", "JA"];

const HERO_LOCALIZED_FIELDS = [
  'roles',
  'title',
  'subtitle',
  'primaryCtaLabel',
  'secondaryCtaLabel'
];

const HERO_GLOBAL_FIELDS = [
  'name',
  'resumeUrl'
];

const PROFILE_LOCALIZED_FIELDS = [
  'aboutTitle',
  'summaryTitle',
  'summary',
  'professionalSummary',
  'valuePropositionTitle',
  'valuePropositionIntro',
  'valuePropositions',
  'birthPlace',
  'birthDate'
];

const PROFILE_GLOBAL_FIELDS = [
  'avatarUrl',
  'resumeUrl'
];

const CONTACT_LOCALIZED_FIELDS = [
  'title',
  'description',
  'location'
];

const CONTACT_GLOBAL_FIELDS = [
  'email',
  'phone',
  'whatsapp',
  'github',
  'linkedin',
  'instagram',
  'website'
];

const normalizeLocale = (locale) => {
  if (!locale) return "EN";
  const upper = locale.toUpperCase();
  if (SUPPORTED_LOCALES.includes(upper)) return upper;
  return "EN";
};

const isStructuredLocalizedSetting = (value) => {
  return value && typeof value === 'object' && value.hasOwnProperty('translations') && typeof value.translations === 'object';
};

const isEmptyValue = (value) => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
};

const pickLocalizedField = (value, locale, field) => {
  if (isStructuredLocalizedSetting(value)) {
    const translations = value.translations;
    // 1. Try requested locale
    if (translations[locale] && !isEmptyValue(translations[locale][field])) {
      return translations[locale][field];
    }
    // 2. Try default EN locale
    if (translations.EN && !isEmptyValue(translations.EN[field])) {
      return translations.EN[field];
    }
    // 3. Try legacy root field
    if (!isEmptyValue(value[field])) {
      return value[field];
    }
  } else if (value && typeof value === 'object') {
    // legacy flat
    if (!isEmptyValue(value[field])) {
      return value[field];
    }
  }
  return null;
};

const buildLocalizedSetting = (value, locale, localizedFields, globalFields) => {
  if (!value) return null;
  const result = {};

  // Global fields
  globalFields.forEach(field => {
    if (value.hasOwnProperty(field)) {
      result[field] = value[field];
    } else {
      result[field] = null;
    }
  });

  // Localized fields
  localizedFields.forEach(field => {
    result[field] = pickLocalizedField(value, locale, field);
  });

  if (value.hasOwnProperty('defaultLocale')) {
    result.defaultLocale = value.defaultLocale;
  }

  return result;
};

const normalizeStructuredForAdmin = (value, localizedFields, globalFields) => {
  if (!value || typeof value !== 'object') {
    return {
      defaultLocale: "EN",
      translations: { EN: {}, ID: {}, JA: {} }
    };
  }

  if (isStructuredLocalizedSetting(value)) {
    const translations = { EN: {}, ID: {}, JA: {}, ...value.translations };
    return { ...value, translations };
  }

  // Legacy flat settings -> convert to structured settings
  const result = {
    defaultLocale: "EN",
    translations: {
      EN: {},
      ID: {},
      JA: {}
    }
  };

  // Copy global fields to root
  globalFields.forEach(field => {
    if (value.hasOwnProperty(field)) {
      result[field] = value[field];
    }
  });

  // Copy localized fields to EN translation
  localizedFields.forEach(field => {
    if (value.hasOwnProperty(field)) {
      result.translations.EN[field] = value[field];
    }
  });

  return result;
};

const mergeSettingPayload = (existingValue, incomingValue, localizedFields, globalFields) => {
  const normalizedExisting = normalizeStructuredForAdmin(existingValue, localizedFields, globalFields);

  if (!incomingValue || typeof incomingValue !== 'object') {
    return normalizedExisting;
  }

  const isIncomingStructured = isStructuredLocalizedSetting(incomingValue);
  const normalizedIncoming = isIncomingStructured 
    ? incomingValue 
    : normalizeStructuredForAdmin(incomingValue, localizedFields, globalFields);

  const merged = {
    ...normalizedExisting,
    ...normalizedIncoming, // merges top-level global keys (name, avatarUrl, resumeUrl, etc.)
    translations: {
      EN: {
        ...(normalizedExisting.translations?.EN || {}),
        ...(normalizedIncoming.translations?.EN || {})
      },
      ID: {
        ...(normalizedExisting.translations?.ID || {}),
        ...(normalizedIncoming.translations?.ID || {})
      },
      JA: {
        ...(normalizedExisting.translations?.JA || {}),
        ...(normalizedIncoming.translations?.JA || {})
      }
    }
  };

  return merged;
};

// Public
const getContact = async (req, res, next) => {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'contact' },
    });
    const locale = normalizeLocale(req.query.locale);
    const value = setting ? setting.value : null;
    const localized = buildLocalizedSetting(value, locale, CONTACT_LOCALIZED_FIELDS, CONTACT_GLOBAL_FIELDS);

    res.json({
      success: true,
      data: { contact: localized }
    });
  } catch (error) {
    next(error);
  }
};

// Admin
const getAdminContact = async (req, res, next) => {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'contact' },
    });
    const value = setting ? setting.value : null;
    const normalized = normalizeStructuredForAdmin(value, CONTACT_LOCALIZED_FIELDS, CONTACT_GLOBAL_FIELDS);

    res.json({
      contact: normalized,
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    if (typeof req.body !== 'object' || req.body === null) {
      return res.status(400).json({ status: 'error', message: 'Body must be a JSON object' });
    }
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'contact' } });
    const existingValue = setting ? setting.value : null;
    const mergedValue = mergeSettingPayload(existingValue, req.body, CONTACT_LOCALIZED_FIELDS, CONTACT_GLOBAL_FIELDS);

    const updated = await prisma.siteSetting.upsert({
      where: { key: 'contact' },
      update: { value: mergedValue },
      create: { key: 'contact', value: mergedValue },
    });

    res.json({
      message: 'Contact settings updated successfully',
      contact: updated.value,
    });
  } catch (error) {
    next(error);
  }
};

const getHero = async (req, res, next) => {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'hero' } });
    const locale = normalizeLocale(req.query.locale);
    const value = setting ? setting.value : null;
    const localized = buildLocalizedSetting(value, locale, HERO_LOCALIZED_FIELDS, HERO_GLOBAL_FIELDS);
    res.json({ success: true, data: { hero: localized } });
  } catch (error) { next(error); }
};

const getAdminHero = async (req, res, next) => {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'hero' } });
    const value = setting ? setting.value : null;
    const normalized = normalizeStructuredForAdmin(value, HERO_LOCALIZED_FIELDS, HERO_GLOBAL_FIELDS);
    res.json({ hero: normalized });
  } catch (error) { next(error); }
};

const updateHero = async (req, res, next) => {
  try {
    if (typeof req.body !== 'object' || req.body === null) {
      return res.status(400).json({ status: 'error', message: 'Body must be a JSON object' });
    }
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'hero' } });
    const existingValue = setting ? setting.value : null;
    const mergedValue = mergeSettingPayload(existingValue, req.body, HERO_LOCALIZED_FIELDS, HERO_GLOBAL_FIELDS);

    const updated = await prisma.siteSetting.upsert({
      where: { key: 'hero' },
      update: { value: mergedValue },
      create: { key: 'hero', value: mergedValue },
    });
    res.json({ message: 'Hero settings updated successfully', hero: updated.value });
  } catch (error) { next(error); }
};

const getProfile = async (req, res, next) => {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'profile' } });
    const locale = normalizeLocale(req.query.locale);
    const value = setting ? setting.value : null;
    const localized = buildLocalizedSetting(value, locale, PROFILE_LOCALIZED_FIELDS, PROFILE_GLOBAL_FIELDS);
    res.json({ success: true, data: { profile: localized } });
  } catch (error) { next(error); }
};

const getAdminProfile = async (req, res, next) => {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'profile' } });
    const value = setting ? setting.value : null;
    const normalized = normalizeStructuredForAdmin(value, PROFILE_LOCALIZED_FIELDS, PROFILE_GLOBAL_FIELDS);
    res.json({ profile: normalized });
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    if (typeof req.body !== 'object' || req.body === null) {
      return res.status(400).json({ status: 'error', message: 'Body must be a JSON object' });
    }
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'profile' } });
    const existingValue = setting ? setting.value : null;
    const mergedValue = mergeSettingPayload(existingValue, req.body, PROFILE_LOCALIZED_FIELDS, PROFILE_GLOBAL_FIELDS);

    const updated = await prisma.siteSetting.upsert({
      where: { key: 'profile' },
      update: { value: mergedValue },
      create: { key: 'profile', value: mergedValue },
    });
    res.json({ message: 'Profile settings updated successfully', profile: updated.value });
  } catch (error) { next(error); }
};

module.exports = {
  getContact,
  getAdminContact,
  updateContact,
  getHero,
  getAdminHero,
  updateHero,
  getProfile,
  getAdminProfile,
  updateProfile,
};
