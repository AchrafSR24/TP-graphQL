const Task = require('./models/Task');

const taskResolver = {
  Query: {
    tasks: async () => {
      try {
        return await Task.find();
      } catch (err) {
        console.error('Erreur lors de la récupération des tâches:', err);
        return [];
      }
    },
  },
  Mutation: {
    addTask: async (parent, { title, description }) => {
      try {
        const task = new Task({ title, description });
        return await task.save();
      } catch (err) {
        console.error('Erreur lors de l\'ajout de la tâche:', err);
        return null;
      }
    },
  },
};

module.exports = taskResolver;
