[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupl&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupl)
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupl/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct13-dsikea-api-groupl?branch=main)

# Práctica 13 - DSIkea: API REST con Node/Express #

## Miembros del grupo ##
> Idaira Reina González

> Lorenzo Román Luca de Tena

> Mariam Laaroussi Ramos

## Introducción ##
En esta práctica, utilizamos Node.js y Express para implementar operaciones CRUD (Crear, Leer, Actualizar, Borrar) en clientes, proveedores, muebles y transacciones.

Nuestro API permite:
Gestión completa de clientes y proveedores, incluyendo consultas por NIF/CIF.
Manejo de inventario de muebles con opciones de búsqueda detalladas.
Gestión de transacciones, calculando automáticamente los importes y manejando las relaciones entre entidades.
Nos aseguramos de programar defensivamente, considerando posibles errores y situaciones inesperadas, y documentamos exhaustivamente nuestro trabajo.

## Objetivo ##

El objetivo de la práctica es desarrollar un API REST con Node.js y Express para gestionar una tienda de muebles, implementando operaciones CRUD en clientes, proveedores, muebles y transacciones, documentando nuestras decisiones de diseño y realizando pruebas.

### Models ###
#### Customer ####

Validador de NIF con expresiones regulares:
Se define una función validarNIF que toma un NIF como argumento y devuelve un valor booleano indicando si el NIF es válido o no. Utiliza una expresión regular para validar el formato del NIF, que consiste en 8 dígitos seguidos de una letra.
```
function validarNIF(nif: string): boolean {
    const regex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    return regex.test(nif);
}
```
Definición de la interfaz ICustomer:
Se define una interfaz ICustomer que extiende la interfaz Document de Mongoose. Esta interfaz describe la estructura de los documentos que serán almacenados en la colección de clientes en la base de datos. Incluye propiedades como nombre, apellido, NIF, dirección y teléfono.
```
interface ICustomer extends Document {
    nombre: string;
    apellido: string;
    nif: string;
    direccion: string;
    telefono: string;
}
```
Definición del esquema del modelo Customer:
Se crea un esquema de Mongoose llamado customerSchema que especifica la estructura y las restricciones de los documentos en la colección de clientes. Cada campo del esquema define el tipo de datos esperado y si es requerido o no. El campo NIF también incluye una validación personalizada utilizando la función validarNIF.
```
export const customerSchema: Schema = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    nif: { 
      type: String, 
      required: true, 
      unique: true, 
        validate: {
            validator: validarNIF,
            message: 'NIF no válido'
        }
    },
    direccion: { type: String, required: true },
    telefono: { type: String, required: true }
});
```
Creación y Exportación del modelo Customer:
Se utiliza la función model de Mongoose para crear el modelo Customer a partir del esquema definido anteriormente. Este modelo se utilizará para interactuar con la colección de clientes en la base de datos.
Finalmente, el modelo Customer se exporta para que pueda ser utilizado en otros archivos de nuestro proyecto.
```
const Customer = model<ICustomer>("Customer", customerSchema);
```
```
export default Customer;
```
#### Provider ####
Interfaz IProvider:
Se define una interfaz IProvider que extiende la interfaz Document de Mongoose. Esta interfaz describe la estructura de los documentos que serán almacenados en la colección de proveedores en la base de datos. Incluye propiedades como nombre, contacto, dirección, CIF, email (opcional) y móvil (opcional).
```
interface IProvider extends Document {
  name: string;
  contact: string;
  address: string;
  cif: string;
  email?: string;
  mobilePhone?: number;
}
```
Esquema providerSchema:
Se crea un esquema de Mongoose llamado providerSchema que define la estructura y las restricciones de los documentos en la colección de proveedores. Cada campo del esquema especifica el tipo de datos esperado, si es requerido o no, y en algunos casos, se aplican transformaciones o validaciones personalizadas.
```
export const providerSchema = new Schema({
  name: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  cif: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isLength(value, { min: 9, max: 9 }),
      message: 'El CIF debe tener 9 carácteres.'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Email es inválido.'
    }
  },
  mobilePhone: {
    type: Number,
    validate: {
      validator: (value: number) => validator.isMobilePhone(value.toString()),
      message: 'Telefono es inválido.'
    }
  },
});
```
En el código anterior podemos ver los validadores.
Validación del CIF:
El campo CIF del esquema incluye una validación personalizada utilizando la función isLength del módulo validator. Se asegura de que el CIF tenga exactamente 9 caracteres.
Validación del email:
El campo email del esquema incluye una validación personalizada utilizando la función isEmail del módulo validator. Se asegura de que el email tenga un formato válido.
Validación del número de teléfono móvil:
El campo mobilePhone del esquema incluye una validación personalizada utilizando la función isMobilePhone del módulo validator. Se asegura de que el número de teléfono móvil tenga un formato válido.
Creación del modelo Provider:
Se utiliza la función model de Mongoose para crear el modelo Provider a partir del esquema providerSchema. Este modelo se utilizará para interactuar con la colección de proveedores en la base de datos.
```
const Provider = model<IProvider>('Provider', providerSchema);
```
Exportación del modelo Provider:
Finalmente, el modelo Provider se exporta para que pueda ser utilizado en otros archivos de nuestro proyecto.
```
export default Provider;
```
#### Furniture ####
Definición del esquema de muebles:
Se define una interfaz IFurniture que extiende la interfaz Document de Mongoose. Esta interfaz describe la estructura de los documentos que serán almacenados en la colección de muebles en la base de datos. Incluye propiedades como nombre, descripción, material, dimensiones, precio, stock y color.
```
interface IFurniture extends Document {
  name: string;
  description: string;
  material: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  price: number;
  stock: number;
  color: string;
}
```
Creación del esquema de la base de datos:
Se crea un esquema de Mongoose llamado furnitureSchema que define la estructura y las restricciones de los documentos en la colección de muebles. Cada campo del esquema especifica el tipo de datos esperado, si es requerido o no, y en algunos casos, se aplican validaciones adicionales.
```
export const furnitureSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  material: {
    type: String,
    required: true,
    enum: ["plastic", "fabric", "metal", "wood", "glass",  "leather"],
  },
  dimensions: {
    type: {
      length: Number,
      width: Number,
      height: Number,
    },
    required: true,
  },
  price: { type: Number, required: true, validate: {
      validator: (value: number) => value >= 0,
      message: 'Price must be a positive number'
    }
  },
  stock: { type: Number,
    required: true,
   },
  color: {
    type: String,
    required: true,
    enum: ["red", "purple", "blue", "green", "orange", "brown", "yellow", "black", "white", "pink"],
  },
});
```
Las validaciones que usamos son las siguientes:
Validación del material:
El campo material del esquema incluye una validación utilizando la propiedad enum de Mongoose. Se asegura de que el material especificado sea uno de los valores permitidos: plastic, fabric, metal, wood, glass, leather.

Validación de las dimensiones:
El campo dimensions del esquema incluye un objeto anidado que especifica las dimensiones del mueble (longitud, anchura y altura). Este campo es requerido y debe contener valores numéricos.

Validación del precio:
El campo price del esquema incluye una validación personalizada utilizando una función que verifica que el valor sea un número positivo.

Validación del stock:
El campo stock del esquema indica la cantidad disponible del mueble en el inventario y es requerido.

Validación del color:
El campo color del esquema incluye una validación utilizando la propiedad enum de Mongoose. Se asegura de que el color especificado sea uno de los valores permitidos: red, purple, blue, green, orange, brown, yellow, black, white, pink.

Creación del modelo Furniture:
Se utiliza la función model de Mongoose para crear el modelo Furniture a partir del esquema furnitureSchema. Este modelo se utilizará para interactuar con la colección de muebles en la base de datos.
```
const Furniture = model<IFurniture>("Furniture", furnitureSchema);
```

#### Transaction ####
Definición de la interfaz ITransaction:
Se define una interfaz ITransaction que extiende la interfaz Document de Mongoose. Esta interfaz describe la estructura de los documentos que serán almacenados en la colección de transacciones en la base de datos. Incluye propiedades como tipo (Compra o Venta), muebles involucrados, cliente, proveedor, precio y marca de tiempo.
```
interface ITransaction extends Document {
  type: "Compra" | "Venta";
  furniture: Array<{
    furniture: typeof furnitureSchema,
    quantity: Number,
  }>,
  customer: typeof customerSchema;
  provider: typeof providerSchema;
  price: Number;
  timestamp: Date;
}
```
Definición del esquema de transacción:
Se crea un esquema de Mongoose llamado transactionSchema que define la estructura y las restricciones de los documentos en la colección de transacciones. Cada campo del esquema especifica el tipo de datos esperado y, en algunos casos, se aplican validaciones adicionales.
```
export const transactionSchema = new Schema({
  type: {
    type: String,
    enum: ["Compra", "Venta"],
    required: true,
  },
```
El campo type del esquema incluye una validación utilizando la propiedad enum de Mongoose. Se asegura de que el tipo de transacción especificado sea uno de los valores permitidos: Compra o Venta.
```
  furniture: [{
    furnitureId: {
      type: Schema.Types.ObjectId,
      ref: 'Furniture',
    },
    quantity: {
      type: Number,
    }
  }],
```
El campo furniture del esquema es un array de objetos que contiene los IDs de los muebles involucrados en la transacción y la cantidad de cada uno.
```
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: "Provider",
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required:true,
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => value >= 0,
      message: "Price must be a positive number",
    },
  },
});
```
El campo timestamp del esquema es la marca de tiempo de la transacción y tiene un valor predeterminado de la fecha y hora actual. El campo price es el precio total de la transacción y debe ser un número positivo.

Creación del modelo Transaction:
Se utiliza la función model de Mongoose para crear el modelo Transaction a partir del esquema transactionSchema. Este modelo se utilizará para interactuar con la colección de transacciones en la base de datos.
```
const Transaction = model<ITransaction>("Transaction", transactionSchema);
```

### Routers ###
#### CustomerRouter ####

#### ProviderRouter ####

#### FurnitureRouter ####

#### TransactionRouter ####


## Conclusión ##

En conclusión, la práctica nos brindó la oportunidad de aplicar nuestros conocimientos en el desarrollo de sistemas informáticos mediante la implementación de un API REST para una tienda de muebles. Utilizando Node.js y Express, logramos diseñar un sistema completo que permite la gestión eficiente de clientes, proveedores, inventario de muebles y transacciones. A lo largo del proceso, aprendimos a programar defensivamente, documentar nuestras decisiones de diseño y realizar pruebas exhaustivas para garantizar la calidad del código. Esta experiencia nos ha preparado para enfrentar desafíos similares en proyectos futuros y nos ha brindado una comprensión más profunda del desarrollo de sistemas informáticos en el mundo real.

## Bibliografía ##
> Cloud application hosting for developers | Render. (n.d.). Cloud Application Hosting for Developers | Render. https://dashboard.render.com/

> Projects | Cloud: MongoDB Cloud. (n.d.). https://cloud.mongodb.com/v2#/org/663b4e5f66e117266a136106/projects

> How do I use SuperTest in my Node.js TypeScript project? (n.d.). Stack Overflow. https://stackoverflow.com/questions/76596884/how-do-i-use-supertest-in-my-node-js-typescript-project
