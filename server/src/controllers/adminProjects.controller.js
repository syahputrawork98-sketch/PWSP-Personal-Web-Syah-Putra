const prisma = require('../lib/prisma');

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({
      projects,
    });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found',
      });
    }

    res.json({
      project,
    });
  } catch (error) {
    next(error);
  }
};

const isTranslationValid = (trans) => {
  return !!(trans && trans.title && trans.title.trim() && trans.shortDescription && trans.shortDescription.trim());
};

const createProject = async (req, res, next) => {
  const {
    title, slug, shortDescription, description, imageUrl,
    techStack, githubUrl, liveUrl, figmaUrl, featured, status, order,
    projectType, clientName, projectStatus,
    translations
  } = req.body || {};

  // Basic Validation
  if (!slug) {
    return res.status(400).json({
      status: 'error',
      message: 'Slug is required',
    });
  }

  // Fallback to flat fields if translations is not sent
  let activeTranslations = translations;
  if (!activeTranslations) {
    activeTranslations = {
      EN: {
        title: title || '',
        shortDescription: shortDescription || '',
        description: description || null,
        role: req.body.role || null,
        projectContext: req.body.projectContext || null,
        problem: req.body.problem || null,
        solution: req.body.solution || null,
        keyFeatures: req.body.keyFeatures || [],
        responsibilities: req.body.responsibilities || [],
        outcomes: req.body.outcomes || []
      }
    };
  }

  // EN is mandatory
  if (!activeTranslations.EN || !activeTranslations.EN.title || !activeTranslations.EN.shortDescription) {
    return res.status(400).json({
      status: 'error',
      message: 'English Title and Short Description are required',
    });
  }

  if (status && !['DRAFT', 'PUBLISHED'].includes(status)) {
    return res.status(400).json({
      status: 'error',
      message: 'Status must be either DRAFT or PUBLISHED',
    });
  }

  if (techStack && !Array.isArray(techStack)) {
    return res.status(400).json({
      status: 'error',
      message: 'Tech stack must be an array of strings',
    });
  }

  if (projectType && !['CLIENT_WORK', 'FREELANCE', 'CASE_STUDY', 'LEARNING_PROJECT', 'INTERNAL'].includes(projectType)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid projectType value',
    });
  }

  if (projectStatus && !['COMPLETED', 'IN_PROGRESS', 'MAINTENANCE', 'ARCHIVED'].includes(projectStatus)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid projectStatus value',
    });
  }

  try {
    // Check for duplicate slug
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return res.status(409).json({
        status: 'error',
        message: 'Slug is already in use',
      });
    }

    const enTitle = activeTranslations.EN.title.trim();
    const enShortDesc = activeTranslations.EN.shortDescription.trim();
    const enDesc = activeTranslations.EN.description || null;

    const translationCreates = [];

    // EN translation
    translationCreates.push({
      locale: 'EN',
      title: enTitle,
      shortDescription: enShortDesc,
      description: enDesc,
      role: activeTranslations.EN.role || null,
      projectContext: activeTranslations.EN.projectContext || null,
      problem: activeTranslations.EN.problem || null,
      solution: activeTranslations.EN.solution || null,
      keyFeatures: activeTranslations.EN.keyFeatures || [],
      responsibilities: activeTranslations.EN.responsibilities || [],
      outcomes: activeTranslations.EN.outcomes || []
    });

    // Conditionally create ID translation
    if (isTranslationValid(activeTranslations.ID)) {
      translationCreates.push({
        locale: 'ID',
        title: activeTranslations.ID.title.trim(),
        shortDescription: activeTranslations.ID.shortDescription.trim(),
        description: activeTranslations.ID.description || null,
        role: activeTranslations.ID.role || null,
        projectContext: activeTranslations.ID.projectContext || null,
        problem: activeTranslations.ID.problem || null,
        solution: activeTranslations.ID.solution || null,
        keyFeatures: activeTranslations.ID.keyFeatures || [],
        responsibilities: activeTranslations.ID.responsibilities || [],
        outcomes: activeTranslations.ID.outcomes || []
      });
    }

    // Conditionally create JA translation
    if (isTranslationValid(activeTranslations.JA)) {
      translationCreates.push({
        locale: 'JA',
        title: activeTranslations.JA.title.trim(),
        shortDescription: activeTranslations.JA.shortDescription.trim(),
        description: activeTranslations.JA.description || null,
        role: activeTranslations.JA.role || null,
        projectContext: activeTranslations.JA.projectContext || null,
        problem: activeTranslations.JA.problem || null,
        solution: activeTranslations.JA.solution || null,
        keyFeatures: activeTranslations.JA.keyFeatures || [],
        responsibilities: activeTranslations.JA.responsibilities || [],
        outcomes: activeTranslations.JA.outcomes || []
      });
    }

    const project = await prisma.project.create({
      data: {
        title: enTitle,
        slug,
        shortDescription: enShortDesc,
        description: enDesc,
        imageUrl,
        techStack: techStack || [],
        githubUrl,
        liveUrl,
        figmaUrl,
        featured: featured || false,
        status: status || 'DRAFT',
        order: order || 0,
        projectType: projectType || null,
        clientName: clientName || null,
        projectStatus: projectStatus || null,
        translations: {
          create: translationCreates
        }
      },
      include: {
        translations: true
      }
    });

    res.status(201).json({
      project,
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  const { id } = req.params;
  const {
    title, slug, shortDescription, description, imageUrl,
    techStack, githubUrl, liveUrl, figmaUrl, featured, status, order,
    projectType, clientName, projectStatus,
    translations
  } = req.body || {};

  // Validation
  if (status && !['DRAFT', 'PUBLISHED'].includes(status)) {
    return res.status(400).json({
      status: 'error',
      message: 'Status must be either DRAFT or PUBLISHED',
    });
  }

  if (techStack && !Array.isArray(techStack)) {
    return res.status(400).json({
      status: 'error',
      message: 'Tech stack must be an array of strings',
    });
  }

  if (projectType && !['CLIENT_WORK', 'FREELANCE', 'CASE_STUDY', 'LEARNING_PROJECT', 'INTERNAL'].includes(projectType)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid projectType value',
    });
  }

  if (projectStatus && !['COMPLETED', 'IN_PROGRESS', 'MAINTENANCE', 'ARCHIVED'].includes(projectStatus)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid projectStatus value',
    });
  }

  try {
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: { translations: true }
    });

    if (!existingProject) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found',
      });
    }

    // Check for duplicate slug if slug is being updated
    if (slug && slug !== existingProject.slug) {
      const duplicateSlug = await prisma.project.findUnique({
        where: { slug },
      });

      if (duplicateSlug) {
        return res.status(409).json({
          status: 'error',
          message: 'Slug is already in use by another project',
        });
      }
    }

    // Fallback if translations not sent
    let activeTranslations = translations;
    if (!activeTranslations) {
      const existingEN = existingProject.translations?.find(t => t.locale === 'EN');
      activeTranslations = {
        EN: {
          title: title !== undefined ? title : existingProject.title,
          shortDescription: shortDescription !== undefined ? shortDescription : existingProject.shortDescription,
          description: description !== undefined ? description : existingProject.description,
          role: req.body.role !== undefined ? req.body.role : (existingEN?.role || null),
          projectContext: req.body.projectContext !== undefined ? req.body.projectContext : (existingEN?.projectContext || null),
          problem: req.body.problem !== undefined ? req.body.problem : (existingEN?.problem || null),
          solution: req.body.solution !== undefined ? req.body.solution : (existingEN?.solution || null),
          keyFeatures: req.body.keyFeatures !== undefined ? req.body.keyFeatures : (existingEN?.keyFeatures || []),
          responsibilities: req.body.responsibilities !== undefined ? req.body.responsibilities : (existingEN?.responsibilities || []),
          outcomes: req.body.outcomes !== undefined ? req.body.outcomes : (existingEN?.outcomes || [])
        }
      };
    }

    // EN validation
    if (activeTranslations.EN) {
      if (!activeTranslations.EN.title || !activeTranslations.EN.shortDescription) {
        return res.status(400).json({
          status: 'error',
          message: 'English Title and Short Description are required',
        });
      }
    }

    const projectUpdateData = {
      slug: slug !== undefined ? slug : existingProject.slug,
      imageUrl: imageUrl !== undefined ? imageUrl : existingProject.imageUrl,
      techStack: techStack !== undefined ? techStack : existingProject.techStack,
      githubUrl: githubUrl !== undefined ? githubUrl : existingProject.githubUrl,
      liveUrl: liveUrl !== undefined ? liveUrl : existingProject.liveUrl,
      figmaUrl: figmaUrl !== undefined ? figmaUrl : existingProject.figmaUrl,
      featured: featured !== undefined ? featured : existingProject.featured,
      status: status !== undefined ? status : existingProject.status,
      order: order !== undefined ? order : existingProject.order,
      projectType: projectType !== undefined ? projectType : existingProject.projectType,
      clientName: clientName !== undefined ? clientName : existingProject.clientName,
      projectStatus: projectStatus !== undefined ? projectStatus : existingProject.projectStatus,
    };

    if (activeTranslations.EN) {
      projectUpdateData.title = activeTranslations.EN.title.trim();
      projectUpdateData.shortDescription = activeTranslations.EN.shortDescription.trim();
      projectUpdateData.description = activeTranslations.EN.description || null;
    }

    await prisma.project.update({
      where: { id },
      data: projectUpdateData
    });

    // 1. EN is mandatory, always upserted
    if (activeTranslations.EN) {
      await prisma.projectTranslation.upsert({
        where: { projectId_locale: { projectId: id, locale: 'EN' } },
        update: {
          title: activeTranslations.EN.title.trim(),
          shortDescription: activeTranslations.EN.shortDescription.trim(),
          description: activeTranslations.EN.description || null,
          role: activeTranslations.EN.role || null,
          projectContext: activeTranslations.EN.projectContext || null,
          problem: activeTranslations.EN.problem || null,
          solution: activeTranslations.EN.solution || null,
          keyFeatures: activeTranslations.EN.keyFeatures || [],
          responsibilities: activeTranslations.EN.responsibilities || [],
          outcomes: activeTranslations.EN.outcomes || []
        },
        create: {
          projectId: id,
          locale: 'EN',
          title: activeTranslations.EN.title.trim(),
          shortDescription: activeTranslations.EN.shortDescription.trim(),
          description: activeTranslations.EN.description || null,
          role: activeTranslations.EN.role || null,
          projectContext: activeTranslations.EN.projectContext || null,
          problem: activeTranslations.EN.problem || null,
          solution: activeTranslations.EN.solution || null,
          keyFeatures: activeTranslations.EN.keyFeatures || [],
          responsibilities: activeTranslations.EN.responsibilities || [],
          outcomes: activeTranslations.EN.outcomes || []
        }
      });
    }

    // 2. ID locale
    if (activeTranslations.ID !== undefined) {
      const idTrans = activeTranslations.ID;
      if (isTranslationValid(idTrans)) {
        await prisma.projectTranslation.upsert({
          where: { projectId_locale: { projectId: id, locale: 'ID' } },
          update: {
            title: idTrans.title.trim(),
            shortDescription: idTrans.shortDescription.trim(),
            description: idTrans.description || null,
            role: idTrans.role || null,
            projectContext: idTrans.projectContext || null,
            problem: idTrans.problem || null,
            solution: idTrans.solution || null,
            keyFeatures: idTrans.keyFeatures || [],
            responsibilities: idTrans.responsibilities || [],
            outcomes: idTrans.outcomes || []
          },
          create: {
            projectId: id,
            locale: 'ID',
            title: idTrans.title.trim(),
            shortDescription: idTrans.shortDescription.trim(),
            description: idTrans.description || null,
            role: idTrans.role || null,
            projectContext: idTrans.projectContext || null,
            problem: idTrans.problem || null,
            solution: idTrans.solution || null,
            keyFeatures: idTrans.keyFeatures || [],
            responsibilities: idTrans.responsibilities || [],
            outcomes: idTrans.outcomes || []
          }
        });
      } else {
        // Clear/delete if already exists and is empty
        const exists = await prisma.projectTranslation.findUnique({
          where: { projectId_locale: { projectId: id, locale: 'ID' } }
        });
        if (exists) {
          await prisma.projectTranslation.delete({
            where: { projectId_locale: { projectId: id, locale: 'ID' } }
          });
        }
      }
    }

    // 3. JA locale
    if (activeTranslations.JA !== undefined) {
      const jaTrans = activeTranslations.JA;
      if (isTranslationValid(jaTrans)) {
        await prisma.projectTranslation.upsert({
          where: { projectId_locale: { projectId: id, locale: 'JA' } },
          update: {
            title: jaTrans.title.trim(),
            shortDescription: jaTrans.shortDescription.trim(),
            description: jaTrans.description || null,
            role: jaTrans.role || null,
            projectContext: jaTrans.projectContext || null,
            problem: jaTrans.problem || null,
            solution: jaTrans.solution || null,
            keyFeatures: jaTrans.keyFeatures || [],
            responsibilities: jaTrans.responsibilities || [],
            outcomes: jaTrans.outcomes || []
          },
          create: {
            projectId: id,
            locale: 'JA',
            title: jaTrans.title.trim(),
            shortDescription: jaTrans.shortDescription.trim(),
            description: jaTrans.description || null,
            role: jaTrans.role || null,
            projectContext: jaTrans.projectContext || null,
            problem: jaTrans.problem || null,
            solution: jaTrans.solution || null,
            keyFeatures: jaTrans.keyFeatures || [],
            responsibilities: jaTrans.responsibilities || [],
            outcomes: jaTrans.outcomes || []
          }
        });
      } else {
        // Clear/delete if already exists and is empty
        const exists = await prisma.projectTranslation.findUnique({
          where: { projectId_locale: { projectId: id, locale: 'JA' } }
        });
        if (exists) {
          await prisma.projectTranslation.delete({
            where: { projectId_locale: { projectId: id, locale: 'JA' } }
          });
        }
      }
    }

    const finalProject = await prisma.project.findUnique({
      where: { id },
      include: {
        translations: true
      }
    });

    res.json({
      project: finalProject,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found',
      });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
