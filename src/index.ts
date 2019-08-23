import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { TestResolver } from './resolver'

//
;(async function() {
  const typeGraphqlSchema = await buildSchema({
    resolvers: [TestResolver],
    validate: false,
    emitSchemaFile: true
  })
  const server = new ApolloServer({ schema: typeGraphqlSchema })
  await server.listen({ port: 4002 })
  console.log('ok')
})()
