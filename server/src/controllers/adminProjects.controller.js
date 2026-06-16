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

const createProject = async (req, res, next) => {
  const {
    title, slug, shortDescription, description, imageUrl,
    techStack, githubUrl, liveUrl, figmaUrl, featured, status, order,
    role
  } = req.body || {};

  // Basic Validation
  if (!title || !slug || !shortDescription) {
    return res.status(400).json({
      status: 'error',
      message: 'Title, slug, and short description are required',
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

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        shortDescription,
        description,
        imageUrl,
        techStack: techStack || [],
        githubUrl,
        liveUrl,
        figmaUrl,
        featured: featured || false,
        status: status || 'DRAFT',
        order: order || 0,
        translations: {
          create: {
            locale: 'EN',
            title,
            shortDescription,
            description: description || null,
            role: role || null,
            keyFeatures: [],
            responsibilities: [],
            outcomes: []
          }
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
    role
  } = req.body || {};

  // Partial Validation
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

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingProject.title,
        slug: slug !== undefined ? slug : existingProject.slug,
        shortDescription: shortDescription !== undefined ? shortDescription : existingProject.shortDescription,
        description: description !== undefined ? description : existingProject.description,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProject.imageUrl,
        techStack: techStack !== undefined ? techStack : existingProject.techStack,
        githubUrl: githubUrl !== undefined ? githubUrl : existingProject.githubUrl,
        liveUrl: liveUrl !== undefined ? liveUrl : existingProject.liveUrl,
        figmaUrl: figmaUrl !== undefined ? figmaUrl : existingProject.figmaUrl,
        featured: featured !== undefined ? featured : existingProject.featured,
        status: status !== undefined ? status : existingProject.status,
        order: order !== undefined ? order : existingProject.order,
      },
      include: {
        translations: true
      }
    });

    // Synchronize English (EN) translation record
    const transTitle = title !== undefined ? title : updatedProject.title;
    const transShortDesc = shortDescription !== undefined ? shortDescription : updatedProject.shortDescription;
    const transDesc = description !== undefined ? description : updatedProject.description;

    let transRole = null;
    if (role !== undefined) {
      transRole = role;
    } else {
      const existingTranslation = updatedProject.translations.find(t => t.locale === 'EN');
      if (existingTranslation) {
        transRole = existingTranslation.role;
      }
    }

    await prisma.projectTranslation.upsert({
      where: {
        projectId_locale: {
          projectId: id,
          locale: 'EN'
        }
      },
      update: {
        title: transTitle,
        shortDescription: transShortDesc,
        description: transDesc || null,
        role: transRole
      },
      create: {
        projectId: id,
        locale: 'EN',
        title: transTitle,
        shortDescription: transShortDesc,
        description: transDesc || null,
        role: transRole,
        keyFeatures: [],
        responsibilities: [],
        outcomes: []
      }
    });

    res.json({
      project: updatedProject,
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
