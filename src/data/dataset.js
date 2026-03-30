import dataset from '../../skillgap_ai_dataset.json';

// Export the full dataset
export const fullDataset = dataset;

// Get all domains
export const getDomains = () => dataset.domains;

// Get domain by ID
export const getDomainById = (domainId) => {
  return dataset.domains.find(d => d.id === domainId);
};

// Get technologies for a specific domain
export const getTechnologiesByDomain = (domainId) => {
  if (!domainId) return [];
  
  // Normalize domainId to handle cases where it might be passed as 'pl' instead of 'domain_pl'
  const normalizedId = domainId.startsWith('domain_') ? domainId : `domain_${domainId}`;
  
  const techs = dataset.technologies.filter(t => 
    t.domain_id === domainId || t.domain_id === normalizedId
  );

  // If no technologies found, check if the domain exists but has no techs yet
  if (techs.length === 0) {
    console.warn(`No technologies found for domain: ${domainId}`);
  }
  
  return techs;
};

// Get technology by ID
export const getTechnologyById = (techId) => {
  return dataset.technologies.find(t => t.id === techId);
};

// Get all technologies
export const getAllTechnologies = () => dataset.technologies;

// Get questions for specific technologies
export const getQuestionsByTechnologies = (techIds, maxQuestionsPerTech = 3) => {
  if (!techIds || techIds.length === 0) return [];
  
  let selectedQuestions = [];
  
  techIds.forEach(techId => {
    // Normalize techId for comparison
    const normalizedTechId = techId.startsWith('tech_') ? techId : `tech_${techId}`;
    
    const techQuestions = dataset.questions.filter(
      q => q.technology_id === techId || q.technology_id === normalizedTechId
    );
    
    if (techQuestions.length > 0) {
      // Shuffle and take maxQuestionsPerTech per technology
      const shuffled = [...techQuestions].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, maxQuestionsPerTech);
      selectedQuestions = [...selectedQuestions, ...selected];
    }
  });
  
  // Shuffle all selected questions
  return selectedQuestions.sort(() => 0.5 - Math.random());
};

// Get questions by domain
export const getQuestionsByDomain = (domainId, maxQuestions = 10) => {
  const domainQuestions = dataset.questions.filter(
    q => q.domain_id === domainId
  );
  
  // Shuffle and return maxQuestions
  return domainQuestions
    .sort(() => 0.5 - Math.random())
    .slice(0, maxQuestions);
};

// Get concepts for specific technology
export const getConceptsByTechnology = (techId) => {
  if (!techId) return [];
  
  // Normalize techId
  const normalizedTechId = techId.startsWith('tech_') ? techId : `tech_${techId}`;
  
  return dataset.concepts.filter(
    c => c.technology_id === techId || c.technology_id === normalizedTechId
  );
};

// Get all concepts
export const getAllConcepts = () => dataset.concepts;

// Get roadmap for specific technology
export const getRoadmapByTechnology = (techId) => {
  return dataset.roadmaps.find(r => r.technology_id === techId);
};

// Format questions for the QuestionEngine
export const formatQuestionsForEngine = (questions) => {
  return questions.map(q => {
    // Find correct answer index with normalized comparison
    const options = q.options || [];
    const correctAnswerIndex = options.findIndex(opt => 
      opt?.toString().trim().toLowerCase() === q.correct_answer?.toString().trim().toLowerCase()
    );

    return {
      id: q.id,
      text: q.question,
      options: options,
      correctAnswer: correctAnswerIndex !== -1 ? correctAnswerIndex : 0,
      explanation: q.explanation,
      difficulty: q.difficulty,
      concept: q.concept,
      tags: q.tags,
      weight: q.weight,
      technologyId: q.technology_id,
      domainId: q.domain_id
    };
  });
};

// Calculate difficulty distribution
export const getDifficultyDistribution = (questions) => {
  const distribution = { easy: 0, medium: 0, hard: 0 };
  questions.forEach(q => {
    if (q.difficulty in distribution) {
      distribution[q.difficulty]++;
    }
  });
  return distribution;
};

// Get tech name by ID
export const getTechNameById = (techId) => {
  const tech = dataset.technologies.find(t => t.id === techId);
  return tech ? tech.name : techId;
};

// Get all tech IDs for a domain
export const getTechIdsByDomain = (domainId) => {
  return dataset.technologies
    .filter(t => t.domain_id === domainId)
    .map(t => t.id);
};
