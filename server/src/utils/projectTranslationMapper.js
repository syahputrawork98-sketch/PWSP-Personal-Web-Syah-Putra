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
 * Maps a Project model with its translations to a flat, backward-compatible object.
 * Fallbacks: Requested locale -> EN -> Legacy Project fields
 * @param {object} project 
 * @param {string} requestedLocale 
 * @returns {object}
 */
const mapProjectWithTranslation = (project, requestedLocale) => {
  if (!project) return null;

  const targetLocale = normalizeLocale(requestedLocale);
  const translations = project.translations || [];

  // Find translation matching target locale
  let translation = translations.find(t => t.locale === targetLocale);

  // If requested locale is not found, fallback to EN
  if (!translation && targetLocale !== 'EN') {
    translation = translations.find(t => t.locale === 'EN');
  }

  // Get translation values, with fallback to legacy fields on the main Project object
  const title = (translation && translation.title) || project.title;
  const shortDescription = (translation && translation.shortDescription) || project.shortDescription;
  const description = (translation && translation.description) || project.description || null;
  const role = (translation && translation.role) || null;
  
  // Case Study Fields from translation
  const projectContext = (translation && translation.projectContext) || null;
  const problem = (translation && translation.problem) || null;
  const solution = (translation && translation.solution) || null;
  const keyFeatures = (translation && translation.keyFeatures) || [];
  const responsibilities = (translation && translation.responsibilities) || [];
  const outcomes = (translation && translation.outcomes) || [];

  // Available locales based on translations that exist in the database
  const availableLocales = translations.map(t => t.locale);

  // Return a flat, backward-compatible object
  return {
    id: project.id,
    slug: project.slug,
    title,
    shortDescription,
    description,
    imageUrl: project.imageUrl,
    techStack: project.techStack || [],
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    figmaUrl: project.figmaUrl,
    featured: project.featured,
    status: project.status,
    order: project.order,
    projectType: project.projectType,
    clientName: project.clientName,
    projectStatus: project.projectStatus,
    role,
    projectContext,
    problem,
    solution,
    keyFeatures,
    responsibilities,
    outcomes,
    locale: translation ? translation.locale : 'EN', // The effective locale used
    availableLocales,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
  };
};

module.exports = {
  normalizeLocale,
  mapProjectWithTranslation
};
