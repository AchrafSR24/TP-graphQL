const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { json } = require('body-parser');
const { addResolversToSchema } = require('@graphql-tools/schema');
const mongoose = require('mongoose');
const taskSchemaPromise = require('./taskSchema');
const taskResolver = require('./taskResolver');
const app = express();

async function setupServer() {
  try {
    // Connexion à MongoDB
    const mongoURI = 'mongodb://localhost:27017/taskdb'; // Remplace par ton URI MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connexion réussie à MongoDB !');

    // Charger le schéma de GraphQL
    const taskSchema = await taskSchemaPromise;
    const schemaWithResolvers = addResolversToSchema({
      schema: taskSchema,
      resolvers: taskResolver,
    });

    const server = new ApolloServer({
      schema: schemaWithResolvers,
    });

    await server.start();

    // Middleware GraphQL
    app.use('/graphql', json(), expressMiddleware(server));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error('Erreur de connexion à MongoDB ou échec du démarrage du serveur Apollo:', error);
  }
}

setupServer();
