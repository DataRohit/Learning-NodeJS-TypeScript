import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
  }

  type Todo {
    _id: ID!
    task: String!
    completed: Boolean!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getTodos: [Todo!]!
    getTodo(id: ID!): Todo
    me: User
  }

  type Mutation {
    addTodo(task: String!): Todo!
    toggleTodo(id: ID!): Todo!
    deleteTodo(id: ID!): Boolean!
  }
`;
