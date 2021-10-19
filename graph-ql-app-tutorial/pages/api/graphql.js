import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro';

require('dotenv').config();
const postgres = require('postgres');
const sql = postgres();

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(username: String): User

    # the one we created in course

    # todos: [Todo]

    todos(filterChecked: Boolean): [Todo]

    # Returns single todo
    todo(id: ID!): Todo
  }

  type Mutation {
    createTodo(title: String!): Todo
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

/* const todos = [
  { id: '1', title: 'Buy Banana', checked: false },
  { id: '2', title: 'Buy Milk', checked: true },
  { id: '3', title: 'Buy orange', checked: true },
]; */

const users = [
  { name: 'Leeroy Jenkins', username: 'leeroy' },
  { name: 'Foo Bar', username: 'foobar' },
];

// Getting all todos using postgres in GraphQL
const getTodos = async () => {
  return await sql` SELECT * FROM todos`;
};

// Getting single todo using postgres in GraphQL

const getTodo = async (id) => {
  const result = await sql`
  SELECT *
  FROM todos
  WHERE id = ${id};
  `;

  return result[0];
};

// Getting filtered todos using postgres in GraphQL

const getFilteredTodos = async (checked) => {
  return await sql`

  SELECT * FROM todos WHERE checked = ${checked}


  `;
};

// Creating users or todos using postgres in GraphQL

const createTodo = async (title) => {
  const result = await sql`
  INSERT INTO todos
  (title, checked)
  VALUES
  (${title}, ${false})
  RETURNING
  id,
  title,
  checked

  `;

  return result[0];
};

const resolvers = {
  // returns all the todos!
  Query: {
    todos: (parent, arg) => {
      if (arg.filterChecked === true) {
        // return todos.filter((todo) => todo.checked === true);
        return getFilteredTodos(true);
      } else if (arg.filterChecked === false) {
        // return todos.filter((todo) => todo.checked === false);
        return getFilteredTodos(false);
      }
      return getTodos();
    },

    // return a single todo
    todo: (parent, arg) => {
      // console.log(arg.id);
      // return todos.find((todo) => todo.id === arg.id);

      console.log(arg.id);
      return getTodo(arg.id);
    },

    users() {
      return users;
    },
    user(parent, { username }) {
      return users.find((user) => user.username === username);
    },
  },

  Mutation: {
    createTodo: (parent, arg) => {
      return createTodo(arg.title);
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

// ####################################
// ####################################
// ####################################
// Quries from the playground

/*


# Write your query or mutation here
query {
  todos {
    id
    title
  }
}



query {
  todo(id: "8") {
    id
    title
  }
}


query {
  todos(filterChecked: false) {
    id
    title
  }
}



mutation {
  createTodo(title: "Call my Brother") {
    id
    title
    checked
  }
}


*/
