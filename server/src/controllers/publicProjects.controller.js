const prisma = require('../lib/prisma');
const { mapProjectWithTranslation } = require('../utils/projectTranslationMapper');

const getAllProjects = async (req, res, next) => {
  try {
    const { locale } = req.query;

    const projects = await prisma.project.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        translations: true,
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    const mappedProjects = projects.map(project =>
      mapProjectWithTranslation(project, locale)
    );

    res.json({
      success: true,
      data: { projects: mappedProjects },
    });
  } catch (error) {
    next(error);
  }
};

const getProjectBySlug = async (req, res, next) => {
  const { slug } = req.params;
  const { locale } = req.query;

  try {
    const project = await prisma.project.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        translations: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const mappedProject = mapProjectWithTranslation(project, locale);

    res.json({
      success: true,
      data: { project: mappedProject },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProjectBySlug,
};

