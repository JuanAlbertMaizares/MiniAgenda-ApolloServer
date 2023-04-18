// gql es una función que se utiliza para crear un objeto de tipo GraphQLSchema
import {ApolloServer, UserInputError, gql} from 'apollo-server';
// importamos uuid v1
import { v1 as uuid } from 'uuid';
// importamos axios
import axios from 'axios';
// un mock de bbdd
const persons = [
    {
        "name": "Federico",
        "age": 18,
        "phone": "1234567890",
        "street": "123 Main St",
        "city": "Anytown",
        "id": "3d59f0b0-5d38-11e9-8647-d663bd873d93"
      },
      {
        "name": "Carolina",
        "age": 21,
        "phone": "0987654321",
        "street": "456 Main St",
        "city": "Anytown",
        "id": "3d59f050-5d38-11e9-8647-d663bd873d93"
      },
      {
        "name": "Lucas",
        "age": 17,
        "phone": "1234567890",
        "street": "789 Main St",
        "city": "Anytown",
        "id": "3d59f0b0-5d38-80e9-8647-d663bd873d93"
      }
];

// mtd - Describe la data graph in terms of the types - MAPEO DE OBJETOS
const typeDefinitions = gql`

    enum YesNo {
        YES
        NO
    }

    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        age: Int!
        phone: String
        street: String!
        address: Address!
        canDrink: Boolean
        id: ID!
    }
    
    type Query {
        personCount: Int!
        allPersons( phone: YesNo ): [Person]!
        findPerson(name: String!): Person
    }
    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person

        editNumber(
            name: String!
            phone: String!
        ): Person

    }
`
// mtd - provee funciones resolvers para cada campo de cada tipo
const resolvers = {
    Query: {
        personCount: () => persons.length,
        // allPersons: (root, args) => {
        //     if (!args.phone) {
        //         return persons;
        //     }
        //     const byPhone = (person) => args.phone === 'YES' ? person.phone : !person.phone;
        //     return persons.filter(byPhone);
        // },
        allPersons: async(root, args) => {
            // consumimos de la rest api
            // const {data: personsFromRestApi} = await axios.get('http://localhost:3000/persons');
            // del resultado operamos los datos que nos interesan
            if (!args.phone) {
                return persons;
            }
            const byPhone = (person) => args.phone === 'YES' ? person.phone : !person.phone;
            return persons.filter(byPhone);
        },
        // root - the object that contains the result returned from the resolver on the parent field
        findPerson: (root, args) => persons.find(p => p.name === args.name)
    },
    // Mutaciones
    Mutation: {
        // args contiene las propiedades en Person Type Mutation.
        addPerson: (root, args) => {
            // validar valor unico
            if (persons.find(p => p.name === args.name)) {
                throw new UserInputError('Nombre tiene que ser unico', {
                    invalidArgs: args.name,
                });
            }
            const person = { ...args, id: uuid() };
            // nte : El chiste es que con esto modificamos la BBDD, Api, other source. Aqui es persons
            persons.push(person);
            return person;
        },
        editNumber: (root, args) => {
            // const person = persons.find(p => p.name === args.name);
            // if (!person) {
            //     return null;
            // }
            // person.phone = args.phone;
            // return person;
            const personIndex = persons.findIndex(p => p.name === args.name);
            if (personIndex === -1) {
                return null;
            }
            const person = persons[personIndex];
            const updatedPerson = { ...person, phone: args.phone };
            persons[personIndex] = updatedPerson;
            return updatedPerson;

        }
    },
    // Resolver de Person - "sERIALIZADOR"
    // Existe un resolver para Person por defecto, pero se puede sobreescribir
    // es el encargado de machear el tipo Person con el objeto que se le pasa. 
    Person: {
        // para esto usa root, o mejor dicho 'prev' que representa el objeto ultimo que se ha resuelto
        canDrink: (root) => root.age >= 18,
        address: (root) => `${root.street}, ${root.city}`,
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    }   
};
// nte - create a server ApolloServer
const server = new ApolloServer({
    typeDefs: typeDefinitions,
    resolvers
});
// mtd - start the server
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
