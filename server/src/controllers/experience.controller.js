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

const createExperience = async (req, res, next) => {
  const { role, company, location, type, startDate, endDate, isCurrent, description, highlights, techStack, status, order, experienceKind } = req.body;

  if (!role || !company) {
    return res.status(400).json({
      status: 'error',
      message: 'Role and company are required',
    });
  }

  const validKinds = ['FORMAL_WORK', 'IT_FREELANCE', 'GENERAL_FREELANCE'];
  const resolvedKind = validKinds.includes(experienceKind) ? experienceKind : 'FORMAL_WORK';

  try {
    const experience = await prisma.experience.create({
      data: {
        role,
        company,
        location,
        type,
        startDate: startDate ? new Date(startDate) : null,
        endDate: isCurrent ? null : (endDate ? new Date(endDate) : null),
        isCurrent: isCurrent || false,
        description,
        highlights: highlights || [],
        techStack: techStack || [],
        status: status || 'DRAFT',
        experienceKind: resolvedKind,
        order: parseInt(order) || 0,
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
  const { role, company, location, type, startDate, endDate, isCurrent, description, highlights, techStack, status, order, experienceKind } = req.body;

  const validKinds = ['FORMAL_WORK', 'IT_FREELANCE', 'GENERAL_FREELANCE'];

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

    const resolvedKind = experienceKind !== undefined
      ? (validKinds.includes(experienceKind) ? experienceKind : 'FORMAL_WORK')
      : existingExperience.experienceKind;

    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: {
        role: role !== undefined ? role : existingExperience.role,
        company: company !== undefined ? company : existingExperience.company,
        location: location !== undefined ? location : existingExperience.location,
        type: type !== undefined ? type : existingExperience.type,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : existingExperience.startDate,
        endDate: isCurrent ? null : (endDate !== undefined ? (endDate ? new Date(endDate) : null) : existingExperience.endDate),
        isCurrent: isCurrent !== undefined ? isCurrent : existingExperience.isCurrent,
        description: description !== undefined ? description : existingExperience.description,
        highlights: highlights !== undefined ? highlights : existingExperience.highlights,
        techStack: techStack !== undefined ? techStack : existingExperience.techStack,
        status: status !== undefined ? status : existingExperience.status,
        experienceKind: resolvedKind,
        order: order !== undefined ? parseInt(order) : existingExperience.order,
      },
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
