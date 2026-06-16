const prisma = require('../lib/prisma');
const { mapExperienceWithTranslation } = require('../utils/experienceTranslationMapper');

// Public
const getAllPublicExperiences = async (req, res, next) => {
  try {
    const experiences = await prisma.experience.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        translations: true,
      },
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' },
      ],
    });

    const { locale } = req.query;
    const mappedExperiences = experiences.map(exp => 
      mapExperienceWithTranslation(exp, locale)
    );

    console.log(`[API] getAllPublicExperiences: Found ${experiences.length} records with status PUBLISHED (locale: ${locale || 'none'})`);
    res.json({ success: true, data: { experiences: mappedExperiences } });
  } catch (error) {
    next(error);
  }
};

// Admin
const getAllAdminExperiences = async (req, res, next) => {
  try {
    const experiences = await prisma.experience.findMany({
      include: {
        translations: true,
      },
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' },
      ],
    });

    res.json({ experiences });
  } catch (error) {
    next(error);
  }
};

const getExperienceById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!experience) {
      return res.status(404).json({
        status: 'error',
        message: 'Experience not found',
      });
    }

    res.json({ experience });
  } catch (error) {
    next(error);
  }
};

const isExperienceTranslationValid = (trans) => {
  return !!(trans && trans.role && trans.role.trim());
};

const createExperience = async (req, res, next) => {
  const { role, company, location, type, startDate, endDate, isCurrent, description, highlights, techStack, status, order, experienceKind, translations } = req.body;

  if (!company) {
    return res.status(400).json({
      status: 'error',
      message: 'Company is required',
    });
  }

  // Fallback to flat fields if translations is not sent
  let activeTranslations = translations;
  if (!activeTranslations) {
    activeTranslations = {
      EN: {
        role: role || '',
        description: description || null,
        highlights: highlights || []
      }
    };
  }

  // EN is mandatory
  if (!activeTranslations.EN || !activeTranslations.EN.role || !activeTranslations.EN.role.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'English Role is required',
    });
  }

  const validKinds = ['FORMAL_WORK', 'IT_FREELANCE', 'GENERAL_FREELANCE'];
  const resolvedKind = validKinds.includes(experienceKind) ? experienceKind : 'FORMAL_WORK';

  try {
    const enRole = activeTranslations.EN.role.trim();
    const enDescription = activeTranslations.EN.description || null;
    const enHighlights = activeTranslations.EN.highlights || [];

    const translationCreates = [];
    translationCreates.push({
      locale: 'EN',
      role: enRole,
      description: enDescription,
      highlights: enHighlights
    });

    if (isExperienceTranslationValid(activeTranslations.ID)) {
      translationCreates.push({
        locale: 'ID',
        role: activeTranslations.ID.role.trim(),
        description: activeTranslations.ID.description || null,
        highlights: activeTranslations.ID.highlights || []
      });
    }

    if (isExperienceTranslationValid(activeTranslations.JA)) {
      translationCreates.push({
        locale: 'JA',
        role: activeTranslations.JA.role.trim(),
        description: activeTranslations.JA.description || null,
        highlights: activeTranslations.JA.highlights || []
      });
    }

    const experience = await prisma.experience.create({
      data: {
        role: enRole,
        company,
        location,
        type,
        startDate: startDate ? new Date(startDate) : null,
        endDate: isCurrent ? null : (endDate ? new Date(endDate) : null),
        isCurrent: isCurrent || false,
        description: enDescription,
        highlights: enHighlights,
        techStack: techStack || [],
        status: status || 'DRAFT',
        experienceKind: resolvedKind,
        order: parseInt(order) || 0,
        translations: {
          create: translationCreates
        }
      },
      include: {
        translations: true,
      },
    });

    res.status(201).json({ experience });
  } catch (error) {
    next(error);
  }
};

const updateExperience = async (req, res, next) => {
  const { id } = req.params;
  const { role, company, location, type, startDate, endDate, isCurrent, description, highlights, techStack, status, order, experienceKind, translations } = req.body;

  const validKinds = ['FORMAL_WORK', 'IT_FREELANCE', 'GENERAL_FREELANCE'];

  try {
    const existingExperience = await prisma.experience.findUnique({
      where: { id },
      include: { translations: true }
    });

    if (!existingExperience) {
      return res.status(404).json({
        status: 'error',
        message: 'Experience not found',
      });
    }

    // Fallback if translations not sent
    let activeTranslations = translations;
    if (!activeTranslations) {
      const existingEN = existingExperience.translations?.find(t => t.locale === 'EN');
      activeTranslations = {
        EN: {
          role: role !== undefined ? role : (existingEN?.role || existingExperience.role),
          description: description !== undefined ? description : (existingEN?.description || existingExperience.description),
          highlights: highlights !== undefined ? highlights : (existingEN?.highlights || existingExperience.highlights || [])
        }
      };
    }

    // EN validation
    if (activeTranslations.EN) {
      if (!activeTranslations.EN.role || !activeTranslations.EN.role.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'English Role is required',
        });
      }
    }

    const resolvedKind = experienceKind !== undefined
      ? (validKinds.includes(experienceKind) ? experienceKind : 'FORMAL_WORK')
      : existingExperience.experienceKind;

    const experienceUpdateData = {
      company: company !== undefined ? company : existingExperience.company,
      location: location !== undefined ? location : existingExperience.location,
      type: type !== undefined ? type : existingExperience.type,
      startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : existingExperience.startDate,
      endDate: isCurrent ? null : (endDate !== undefined ? (endDate ? new Date(endDate) : null) : existingExperience.endDate),
      isCurrent: isCurrent !== undefined ? isCurrent : existingExperience.isCurrent,
      techStack: techStack !== undefined ? techStack : existingExperience.techStack,
      status: status !== undefined ? status : existingExperience.status,
      experienceKind: resolvedKind,
      order: order !== undefined ? parseInt(order) : existingExperience.order,
    };

    if (activeTranslations.EN) {
      experienceUpdateData.role = activeTranslations.EN.role.trim();
      experienceUpdateData.description = activeTranslations.EN.description || null;
      experienceUpdateData.highlights = activeTranslations.EN.highlights || [];
    }

    await prisma.experience.update({
      where: { id },
      data: experienceUpdateData
    });

    // 1. EN translation upsert
    if (activeTranslations.EN) {
      await prisma.experienceTranslation.upsert({
        where: { experienceId_locale: { experienceId: id, locale: 'EN' } },
        update: {
          role: activeTranslations.EN.role.trim(),
          description: activeTranslations.EN.description || null,
          highlights: activeTranslations.EN.highlights || []
        },
        create: {
          experienceId: id,
          locale: 'EN',
          role: activeTranslations.EN.role.trim(),
          description: activeTranslations.EN.description || null,
          highlights: activeTranslations.EN.highlights || []
        }
      });
    }

    // 2. ID translation
    if (activeTranslations.ID !== undefined) {
      const idTrans = activeTranslations.ID;
      if (isExperienceTranslationValid(idTrans)) {
        await prisma.experienceTranslation.upsert({
          where: { experienceId_locale: { experienceId: id, locale: 'ID' } },
          update: {
            role: idTrans.role.trim(),
            description: idTrans.description || null,
            highlights: idTrans.highlights || []
          },
          create: {
            experienceId: id,
            locale: 'ID',
            role: idTrans.role.trim(),
            description: idTrans.description || null,
            highlights: idTrans.highlights || []
          }
        });
      } else {
        const exists = await prisma.experienceTranslation.findUnique({
          where: { experienceId_locale: { experienceId: id, locale: 'ID' } }
        });
        if (exists) {
          await prisma.experienceTranslation.delete({
            where: { experienceId_locale: { experienceId: id, locale: 'ID' } }
          });
        }
      }
    }

    // 3. JA translation
    if (activeTranslations.JA !== undefined) {
      const jaTrans = activeTranslations.JA;
      if (isExperienceTranslationValid(jaTrans)) {
        await prisma.experienceTranslation.upsert({
          where: { experienceId_locale: { experienceId: id, locale: 'JA' } },
          update: {
            role: jaTrans.role.trim(),
            description: jaTrans.description || null,
            highlights: jaTrans.highlights || []
          },
          create: {
            experienceId: id,
            locale: 'JA',
            role: jaTrans.role.trim(),
            description: jaTrans.description || null,
            highlights: jaTrans.highlights || []
          }
        });
      } else {
        const exists = await prisma.experienceTranslation.findUnique({
          where: { experienceId_locale: { experienceId: id, locale: 'JA' } }
        });
        if (exists) {
          await prisma.experienceTranslation.delete({
            where: { experienceId_locale: { experienceId: id, locale: 'JA' } }
          });
        }
      }
    }

    const updatedExperience = await prisma.experience.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    res.json({ experience: updatedExperience });
  } catch (error) {
    next(error);
  }
};

const deleteExperience = async (req, res, next) => {
  const { id } = req.params;
  try {
    const existingExperience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!existingExperience) {
      return res.status(404).json({
        status: 'error',
        message: 'Experience not found',
      });
    }

    await prisma.experience.delete({
      where: { id },
    });

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPublicExperiences,
  getAllAdminExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};
