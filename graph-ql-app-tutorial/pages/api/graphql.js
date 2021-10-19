import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro';

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(username: String): User

    # the one we created in course

    todos: [Todo]

    todos(filterChecked: Boolean): [Todo]

    # Returns single todo
    todo(id: ID!): Todo
  }

  type User {
    name: String
    username: String
  }

  # the one we created in course

  type Todo {
    id: ID
    title: String
    checked: Boolean
  }
`;

const todos = [
  { id: '1', title: 'Buy Banana', checked: false },
  { id: '2', title: 'Buy Milk', checked: true },
  { id: '3', title: 'Buy orange', checked: true },
];

const users = [
  { name: 'Leeroy Jenkins', username: 'leeroy' },
  { name: 'Foo Bar', username: 'foobar' },
];

const resolvers = {
  // returns all the todos!
  Query: {
    todos: (parent, arg) => {
      if (arg.filterChecked === true) {
        return todos.filter((todo) => todo.checked === true);
      } else if (arg.filterChecked === false) {
        return todos.filter((todo) => todo.checked === false);
      }
      return todos;
    },

    // return a single todo
    todo: (parent, arg) => {
      return todos.find((todo) => todo.id === arg.id);
    },

    users() {
      return users;
    },
    user(parent, { username }) {
      return users.find((user) => user.username === username);
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({ schema }).createHandler({
  path: '/api/graphql',
});
