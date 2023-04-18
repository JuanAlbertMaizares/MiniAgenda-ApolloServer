# Código del servidor GraphQL

### Este código implementa un servidor GraphQL básico utilizando Apollo Server, que incluye la definición de tipos y resolvers para una API que maneja una lista de personas con sus nombres, edades, direcciones, teléfonos y otros detalles.

### El servidor utiliza uuid para asignar un id único a cada persona y axios para consumir una REST API que proporciona los datos de personas.

La API expone tres consultas:

- `personCount` devuelve el número de personas en la lista.
- `allPersons` devuelve una lista de todas las personas en la lista, opcionalmente filtrada por teléfono.
- `findPerson` busca y devuelve una persona con el nombre especificado.

La API también proporciona dos mutaciones:

- `addPerson` agrega una nueva persona a la lista.
- `editNumber` actualiza el número de teléfono de una persona existente en la lista.

Los tipos definidos en la API incluyen:

- `Person`: representa una persona con un nombre, una edad, un teléfono, una dirección y un id único.
- `Address`: representa la dirección de una persona con una calle y una ciudad.
- `Query`: define las consultas que se pueden realizar en la API.
- `Mutation`: define las mutaciones que se pueden realizar en la API.
- `YesNo`: define un enum que se utiliza para filtrar personas por teléfono.

En los resolvers se especifican las funciones que se encargan de manejar cada campo de cada tipo. Además, se incluye un resolver personalizado para el campo `canDrink` en el tipo `Person`.

Para iniciar el servidor, se crea una instancia de `ApolloServer` con los type definitions y resolvers definidos, y se llama al método `listen` para escuchar las solicitudes entrantes.


### Instalar dependencias:
`
npm install
`
### El comando usado para iniciar el servidor es:
`
node index.js
`


 