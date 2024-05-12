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

Crear un nuevo cliente:

Se define una ruta POST en /customers para crear un nuevo cliente.
Se utiliza un bloque try-catch para manejar cualquier error que ocurra durante la creación del cliente. Si la creación es exitosa, se envía una respuesta con estado 201 (Creado) y se envía el cliente creado como respuesta. Si hay un error, se envía una respuesta con estado 400 (Solicitud incorrecta) con el error.
```
CustomerRouter.post('/customers', async (req: Request, res: Response) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
});
```

Leer todos los clientes:

Se define una ruta GET en /customers para leer todos los clientes.
Si se proporciona el parámetro de consulta nif, se busca un cliente por ese número de identificación fiscal.
Si no se proporciona el parámetro nif, se devuelven todos los clientes.
Se manejan los posibles errores con bloques try-catch.
```
CustomerRouter.get('/customers', async (req: Request, res: Response) => {
  // si en el query string se encuentra el parámetro nif se busca por nif
  if (req.query.nif) {
    const nif = req.query.nif;
    try {
      const customer = await Customer.findOne({ nif });
      if (!customer) {
        return res.status(404).send({ message: 'Cliente no encontrado' });
      }
      return res.send(customer);
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    //si el parámetro nif no se encuentra se listan todos los clientes
    try {
      const customers = await Customer.find();
      return res.send(customers);
    } catch (error) {
      return  res.status(500).send(error);
  }
}

});
```

Leer un cliente por ID:

Se define una ruta GET en /customers/id/:id para leer un cliente por su ID.
Se busca el cliente por su ID y se manejan los posibles errores con bloques try-catch.
```
CustomerRouter.get('/customers/id/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const customer = await Customer.findById(id);
      if (!customer) {
        return res.status(404).send({ message: 'Cliente no encontrado' });
      }
      return res.send(customer); // Agregar 'return' aquí
    } catch (error) {
      return res.status(500).send(error);
    }
});
```

Actualizar un cliente por NIF:

Se define una ruta PATCH en /customers para actualizar un cliente por su NIF.
Se valida que las actualizaciones proporcionadas en el cuerpo de la solicitud sean permitidas.
Se busca el cliente por su NIF y se actualiza con los datos proporcionados en el cuerpo de la solicitud.
Se manejan los posibles errores con bloques try-catch.
```
CustomerRouter.patch('/customers/', async (req: Request, res: Response) => {
   // si en el query string se encuentra el parámetro nif se busca por nif y se actualiza con el cliente nuevo
  if (req.query.nif) {
    const nif = req.query.nif;
    // comprobar que el cliente del body es válido 
    
    try {
      const customer = await Customer.findOneAndUpdate({ nif }, req.body, { new: true });
      if (!customer) {
        return res.status(404).send({ message: 'Cliente no encontrado' });
      }
      return res.send(customer);
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    //si el parámetro nif no se encuentra se devuelve un error
    return res.status(400).send({ message: 'No se ha proporcionado un NIF' });
  }

});
```

Actualizar un cliente por ID:

Se define otra ruta PATCH en /customers para actualizar un cliente por su ID. La implementación es similar a la anterior.
```
CustomerRouter.patch('/customers/', async (req: Request, res: Response) => {
  // Si en el query string se encuentra el parámetro nif, se busca por nif y se actualiza con el cliente nuevo
  if (req.query.nif) {
      const nif = req.query.nif as string;
      // Comprobar que el cliente del body es válido
      const allowedUpdates = ['nombre', 'apellido', 'direccion', 'telefono'];
      const actualUpdates = Object.keys(req.body);
      const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

      if (!isValidUpdate) {
          return res.status(400).send({
              error: 'Actualización no permitida',
          });
      }

      try {
          const customer = await Customer.findOneAndUpdate({ nif }, req.body, { new: true });
          if (!customer) {
              return res.status(404).send({ message: 'Cliente no encontrado' });
          }
          return res.send(customer);
      } catch (error) {
          return res.status(500).send(error);
      }
  } else {
      // Si el parámetro nif no se encuentra se devuelve un error
      return res.status(400).send({ message: 'No se ha proporcionado un NIF' });
  }
});
```
Borrar un cliente por NIF:

Se define una ruta DELETE en /customers/nif/:nif para borrar un cliente por su NIF.
Se busca el cliente por su NIF y se borra de la base de datos.
```
CustomerRouter.delete('/customers/nif/:nif', async (req: Request, res: Response) => {
  const nif = req.params.nif;
  try {
    const customer = await Customer.findOneAndDelete({ nif });
    if (!customer) {
      return res.status(404).send({ message: 'Cliente no encontrado' });
    }
    return res.send(customer);
  } catch (error) {
    return res.status(500).send(error);
  }
});
```
Borrar un cliente por ID:

Se define otra ruta DELETE en /customers/id/:id para borrar un cliente por su ID. La implementación es similar a la anterior.
```
CustomerRouter.delete('/customers/id/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).send({ message: 'Cliente no encontrado' });
    }
    return res.send(customer);
  } catch (error) {
    return res.status(500).send(error);
  }
});
```

#### ProviderRouter ####

Crear un nuevo proveedor:

Se define una ruta POST en /providers para crear un nuevo proveedor.
Se crea una instancia del modelo Provider con los datos proporcionados en el cuerpo de la solicitud.
Se utiliza un bloque try-catch para manejar cualquier error que ocurra durante la creación del proveedor. Si la creación es exitosa, se envía una respuesta con estado 201 (Creado) y se envía el proveedor creado como respuesta. Si hay un error, se envía una respuesta con estado 400 (Solicitud incorrecta) con el error.
```
ProvidersRouter.post('/providers', async (req: Request, res: Response) => {
  const provider = new Provider(req.body);
  try {
    await provider.save();
    res.status(201).send(provider);
  } catch (error) {
    res.status(400).send(error);
  }
});
```

Leer todos los proveedores:

Se define una ruta GET en /providers para leer todos los proveedores.
Se busca y devuelve todos los proveedores en la base de datos.
Se manejan los posibles errores con bloques try-catch.
```
ProvidersRouter.get('/providers', async (req: Request, res: Response) => {
  try {
    const providers = await Provider.find();
    res.send(providers);
  } catch (error) {
    res.status(500).send(error);
  }
});
```

Leer un proveedor por CIF:

Se define una ruta GET en /providers/:cif para leer un proveedor por su CIF (Código de Identificación Fiscal).
Se busca el proveedor por su CIF y se manejan los posibles errores con bloques try-catch.
```
ProvidersRouter.get('/providers/:cif', async (req: Request, res: Response) => {
    const cif = req.params.cif;
    try {
      const provider = await Provider.findOne({ cif });
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(500).send(error);
    }
  });
```

Leer un proveedor por ID:

Se define una ruta GET en /providers/id/:id para leer un proveedor por su ID.
Se busca el proveedor por su ID y se manejan los posibles errores con bloques try-catch.
```
ProvidersRouter.get('/providers/id/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const provider = await Provider.findById(id);
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(500).send(error);
    }
  });
```

Actualizar un proveedor por CIF:

Se define una ruta PATCH en /providers para actualizar un proveedor por su CIF.
Se valida que las actualizaciones proporcionadas en el cuerpo de la solicitud sean permitidas.
Se busca el proveedor por su CIF y se actualiza con los datos proporcionados en el cuerpo de la solicitud.
Se manejan los posibles errores con bloques try-catch.
```
ProvidersRouter.patch('/providers', async (req: Request, res: Response) => {
  if (!req.query.cif) {
    return res.status(400).send({
      error: 'Se debe proporcionar un CIF',});
  }

  const Updates = ['name', 'contact', 'address', 'email', 'mobilePhone'];
  const UpdateExistente = Object.keys(req.body);
  const isValidUpdate = UpdateExistente.every((update) => Updates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
        error: 'Actualización no permitida',
    });
  }

  try {
    const provider = await Provider.findOneAndUpdate(
        { cif: req.query.cif.toString() },
        req.body,
        { new: true, runValidators: true }
    );

    if (provider) {
      return res.send(provider);
    }
    return res.status(404).send();
  } catch (error) {
      return res.status(500).send(error);
  }
});
```

Borrar un proveedor por CIF:

Se define una ruta DELETE en /providers/:cif para borrar un proveedor por su CIF.
Se busca y borra el proveedor por su CIF en la base de datos.
Se manejan los posibles errores con bloques try-catch.
```
ProvidersRouter.delete('/providers/:cif', async (req: Request, res: Response) => {
  if (!req.query.cif) {
    return res.status(400).send({
      error: 'Se debe proporcionar un CIF',});
  }
    const cif = req.params.cif;
    try {
      const provider = await Provider.findOneAndDelete({ cif });
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(500).send(error);
    }
});
```

Borrar un proveedor por ID:

Se define una ruta DELETE en /providers/:id para borrar un proveedor por su ID. La implementación es similar a la anterior.
```
ProvidersRouter.delete('/providers/:id', async (req: Request, res: Response) => {
  if (!req.query.id) {
    return res.status(400).send({
      error: 'Se debe proporcionar un ID',});
  }
    const id = req.params.id;
    try {
      const provider = await Provider.findByIdAndDelete(id);
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      return res.send(provider);
    } catch (error) {
      return res.status(500).send(error);
    }
  });
```

#### FurnitureRouter ####
Crear un nuevo mueble:

Se define una ruta POST en /furnitures para crear un nuevo mueble.
Se crea una instancia del modelo Furniture con los datos proporcionados en el cuerpo de la solicitud.
Se utiliza un bloque try-catch para manejar cualquier error que ocurra durante la creación del mueble. Si la creación es exitosa, se envía una respuesta con estado 201 (Creado) y se envía el mueble creado como respuesta. Si hay un error, se envía una respuesta con estado 400 (Solicitud incorrecta) con el error.
```
FurnitureRouter.post('/furnitures', async (req: Request, res: Response) => {
  try {
    const furniture = new Furniture(req.body);
    await furniture.save();
    res.status(201).send(furniture);
  } catch (error) {
    res.status(400).send(error);
  }
});
```

Leer todos los muebles:

Se define una ruta GET en /furnitures para leer todos los muebles.
Se filtran los muebles según los parámetros proporcionados en el query string, como material, nombre o descripción.
Se manejan los posibles errores con bloques try-catch.
```
FurnitureRouter.get('/furnitures', async (req: Request, res: Response) => {
   //si en el query se encuentra el parámetro material o nombre o descripcion se busca por esos campos
    if (req.query.material || req.query.nombre || req.query.descripcion) {
      const material = req.query.material;
      const nombre = req.query.nombre;
      const descripcion = req.query.descripcion;
      try {
        const furniture = await Furniture.find({ material, nombre, descripcion });
        if (!furniture) {
          return res.status(404).send({ message: 'Mueble no encontrado' });
        }
        return res.send(furniture);
      } catch (error) {
        return res.status(500).send(error);
      }
    } //si se incluye el parametro id se busca por id de la base de datos
    else if (req.query.id) {
      const id = req.query.id;
      try {
        const furniture = await Furniture.findById({ id });
        if (!furniture) {
          return res.status(404).send({ message: 'Mueble no encontrado' });
        }
        return res.send(furniture);
      }
      catch (error) {
        return res.status(500).send({message: 'Error en la busqueda por id'}); 
      }
  } else {
      //si no se encuentra ningun parametro se listan todos los muebles
      try {
        const furnitures = await Furniture.find();
        return res.send(furnitures);
      } catch (error) {
        return  res.status(500).send(error);
    }
  }

});
```

Leer un mueble por ID:

Se define una ruta GET en /furnitures/:id para leer un mueble por su ID.
Se busca el mueble por su ID y se manejan los posibles errores con bloques try-catch.
```
FurnitureRouter.get('/furnitures/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const furniture = await Furniture.findById(id);
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
}); 
```

Actualizar un mueble por ID:

Se define una ruta PATCH en /furnitures/id/:id para actualizar un mueble por su ID.
Se busca y actualiza el mueble por su ID con los datos proporcionados en el cuerpo de la solicitud.
Se manejan los posibles errores con bloques try-catch.
```
FurnitureRouter.patch('/furnitures/id/:id', async (req: Request, res: Response) => {
   // Se actualiza el mueble por id, el mueble se encuentra en el body
    const id = req.params.id;
    try {
      const furniture = await Furniture.findByIdAndUpdate({id}, req.body, { new: true });
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(404).send({ message: 'fallo en la busqueda del id' });
    }
});
```

Borrar un mueble por ID:

Se define una ruta DELETE en /furnitures/id/:id para borrar un mueble por su ID.
Se busca y borra el mueble por su ID en la base de datos.
Se manejan los posibles errores con bloques try-catch.
```
FurnitureRouter.delete('/furnitures/id/:id', async (req: Request, res: Response) => {
// buscar un mueble por id y si existe eliminarlo
    const id = req.params.id;
    try {
      const furniture = await Furniture.findByIdAndDelete(id);
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
});
```
  
Actualizar un mueble por query string (campos flexibles):

Se define una ruta PATCH en /furnitures/ para actualizar un mueble según los parámetros proporcionados en el query string, como ID, nombre o material.
Se valida la presencia de los parámetros necesarios y se actualiza el mueble con los datos proporcionados.
Se manejan los posibles errores con bloques try-catch.
```
FurnitureRouter.patch('/furnitures/', async (req: Request, res: Response) => {
  //si en el query string se encuentra el parámetro id se busca por id y se actualiza con el mueble nuevo
  if (req.query.id) {
    const id = req.query.id;
    try {
      const furniture = await Furniture.findByIdAndUpdate({id}, req.body, { new: true });
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(404).send({message: 'fallo en la busqueda del id'});
    }
  } // si se encuentra el parámetro nombre se busca por nombre y se actualiza con el mueble nuevo
  else if (req.query.nombre) {
    const nombre = req.query.nombre;
    try {
      const furniture = await Furniture.findOneAndUpdate({ nombre }, req.body, { new: true });
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
  } // si se encuentra el parámetro material se busca por material y se actualiza con el mueble nuevo
  else if (req.query.material) {
    const material = req.query.material;
    try {
      const furniture = await Furniture.findOneAndUpdate({ material }, req.body, { new: true });
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
  } // si no se encuentra ningun parametro se devuelve un error
  else {
    return res.status(404).send({message: 'No se ha encontrado el mueble'});
  }
});
```

Borrar un mueble por query string (campos flexibles):

Se define una ruta DELETE en /furnitures/query para borrar un mueble según los parámetros proporcionados en el query string, como ID, nombre o material.
Se valida la presencia de los parámetros necesarios y se borra el mueble correspondiente.
Se manejan los posibles errores con bloques try-catch.
```
FurnitureRouter.delete('/furnitures/query', async (req: Request, res: Response) => {
  //si en el query string se encuentra el parámetro id se busca por id y se actualiza con el mueble nuevo
  if (req.query.id) {
    const id = req.query.id;
    try {
      const furniture = await Furniture.findByIdAndDelete({id});
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(404).send({message: 'fallo en la busqueda del id'});
    }
  } // si se encuentra el parámetro nombre se busca por nombre y se actualiza con el mueble nuevo
  else if (req.query.nombre) {
    const nombre = req.query.nombre;
    try {
      const furniture = await Furniture.findOneAndDelete({ nombre });
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
  } // si se encuentra el parámetro material se busca por material y se actualiza con el mueble nuevo
  else if (req.query.material) {
    const material = req.query.material;
    try {
      const furniture = await Furniture.findOneAndDelete({ material });
      if (!furniture) {
        return res.status(404).send({ message: 'Mueble no encontrado' });
      }
      return res.send(furniture);
    } catch (error) {
      return res.status(500).send(error);
    }
  } // si no se encuentra ningun parametro se devuelve un error
  else {
    return res.status(404).send({message: 'No se ha encontrado el mueble'});
  }
});
```

#### TransactionRouter ####
Leer todas las transacciones:

Se define una ruta GET en /transactions para leer todas las transacciones.
Se filtran las transacciones según los parámetros proporcionados en el query string, como nif, date, type o id.
Se manejan los posibles errores con bloques try-catch.
```
TransactionRouter.get('/transactions', async(req: Request, res: Response) => {

// si se incluye un query string en el que aparezca el parámetro nif se pusca por ese nif, si aparece el parámetro date este tendrá dos fechas y deberá buscar las transacciones entre esas dos fechas 
if (req.query.nif) {
    const nif = req.query.nif;
    try {
      const customer = await Customer.findOne({ nif });
      if (!customer) {
        return res.status(404).send({ message: 'Cliente no encontrado' });
      }
      const transactions = await Transaction.find({customer: customer._id});
      return res.send(transactions);
    } catch (error) {
      return res.status(404).send({ message: 'No existen transacciones'});
    } // debe buscar tambien en la base de datos de providers
  } else if (req.query.nif) {
    const nif = req.query.nif;
    try {
      const provider = await Provider.findOne({ nif });
      if (!provider) {
        return res.status(404).send({ message: 'Proveedor no encontrado' });
      }
      const transactions = await Transaction.find({provider: provider._id});
      return res.send(transactions);
    } catch (error) {
      return res.status(404).send({ message: 'No existen transacciones'});
    }
  } else if (req.query.date){
    const date = req.query.date;
    try {
      const transactions = await Transaction.find({date});
      return res.send(transactions);
    } catch (error) {
      return res.status(404).send({ message: 'No existen transacciones'});
    }
  } // si en el query se incluye un parámetro tipo se buscará por ese tipo
  else if(req.query.type){
    const type = req.query.type;
    try {
      const transactions = await Transaction.find({ type });
      return res.send(transactions);
    } catch ( error ){
      return res.status(404).send({ message: 'No existen transacciones de ese tipo'});
    }
  } // si se incluye el parámetro id se buscará por el id de la base de datos
  else if(req.query.id){
    const id = req.query.id;
    try {
      const transactions = await Transaction.findById({ id })
      return res.send(transactions);

  } catch (error){
    return res.status(404).send({ message: 'No existen transacciones con ese id' });
  } 
  } else {
    try {
      const transactions = await Transaction.find();
      return res.send(transactions);
    } catch (error) {
      return res.status(404).send({ message: 'No existen transacciones'});
    }
  }
});
```
Crear una nueva transacción:

Se define una ruta POST en /transactions para crear una nueva transacción.
Se valida que el cliente, el proveedor y los muebles asociados existan en la base de datos y que haya suficiente stock de los muebles.
Se manejan los posibles errores con bloques try-catch.
```
TransactionRouter.post('/transactions', async(req: Request, res: Response) => {
//para crear una transaccion se debe comprobar que el nif existe en la base de datos de clientes y proveedores, se debe de comprobar que el id de los muebles existen en la base de datos de muebles además de que hay stock de los mismos
  try {
    const transaction = new Transaction(req.body);
    const customer = new Customer(req.body.customer);
    const provider = new Provider(req.body.provider);
    const furniture = new Furniture(req.body.furniture);
    await customer.save();
    await provider.save();
    await furniture.save();
    if (furniture.stock < req.body.furniture.quantity) {
      return res.status(404).send({ message: 'No hay suficiente stock' });
    }
    await transaction.save();
    return res.status(201).send(transaction);
  } catch (error) {
    return res.status(404).send({message: 'No se ha podido crear la transacción'});
  }
} 
);
```
Actualizar una transacción por ID:

Se define una ruta PATCH en /transactions/:id para actualizar una transacción por su ID.
Se valida que las actualizaciones sean permitidas y se aplican al documento de transacción.
Se manejan los posibles errores con bloques try-catch.
```
TransactionRouter.patch('/transactions/:id', async (req: Request, res: Response) => {
  try {
    // Validar las actualizaciones permitidas
    const updates = Object.keys(req.body);
    const allowedFields = ['type', 'furniture', 'customer', 'provider', 'price', 'timestamp'];
    const isUpdateAllowed = updates.every((update) => allowedFields.includes(update));
    if (!isUpdateAllowed) {
      return res.status(400).send({ error: 'No se pudo realizar la actualización' });
    }

    // Obtener el ID de la transacción y los campos de actualización
    const id = req.params.id;
    const updatedFields: { [key: string]: any } = {};
    for (const key of updates) {
      updatedFields[key] = req.body[key];
    }

    // Actualizar la transacción
    const transaction = await Transaction.findOne({ _id: id });
    if (!transaction) {
      return res.status(404).send({ error: 'La transacción no existe' });
    }

    for (const key in updatedFields) {
      // Asegurar que la clave es válida y hacer una aserción de tipo
      if (Object.prototype.hasOwnProperty.call(updatedFields, key)) {
        (transaction as any)[key] = updatedFields[key];
      }
    }
    await transaction.save();

    // Manejar la respuesta
    return res.status(200).send(transaction);
  } catch (error) {
    // Manejar errores
    return res.status(500).send({ error: 'Hubo un error tratando de modificar la transacción' });
  }
});
```
Borrar una transacción por ID:

Se define una ruta DELETE en /transactions/:id para borrar una transacción por su ID.
Se busca la transacción por su ID y se verifican los participantes asociados (cliente o proveedor).
Se manipula el stock de los muebles dependiendo del tipo de transacción.
Se manejan los posibles errores con bloques try-catch.
```
TransactionRouter.delete('/transactions/:id', async (req: Request, res: Response) => {
  try {
    // Filtrado de la transacción
    const id = req.params.id;
    const filter = { _id: id };

    // Búsqueda de la transacción
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).send({ error: 'La transacción no existe' });
    }

    // Verificación de existencia del participante
    const customer = await Customer.findById(transaction.customer);
    const provider = await Provider.findById(transaction.provider);
    if (!customer && !provider) {
      return res.status(404).send({ error: 'El cliente o proveedor asociado a la transacción no existe' });
    }

    // Verificación del tipo de transacción y manipulación de stock
    if (transaction.type === 'Venta' && customer) {
      // Se aumenta el stock para los muebles vendidos al cliente
      for (const furnitureData of transaction.furniture) {
        const furniture = await Furniture.findById(furnitureData.furniture);
        if (!furniture) {
          return res.status(404).send({ error: 'Uno de los muebles asociados a la transacción no existe' });
        }
        furniture.stock += furnitureData.quantity.valueOf();
        await furniture.save();
      }
    } else if (transaction.type === 'Compra' && provider) {
      // Se disminuye el stock para los muebles comprados al proveedor
      for (const furnitureData of transaction.furniture) {
        const furniture = await Furniture.findById(furnitureData.furniture);
        if (!furniture) {
          return res.status(404).send({ error: 'Uno de los muebles asociados a la transacción no existe' });
        }
        if (furniture.stock < furnitureData.quantity.valueOf()) {
          return res.status(400).send({ error: 'No hay suficiente stock para realizar la eliminación' });
        }
        furniture.stock -= furnitureData.quantity.valueOf();
        await furniture.save();
      }
    }

    // Eliminación de la transacción
    await Transaction.findByIdAndDelete(id);

    // Respuesta HTTP en caso de éxito
    return res.status(200).send({ message: 'Transacción eliminada exitosamente' });
  } catch (error) {
    // Respuesta HTTP en caso de error
    return res.status(500).send({ error: 'Hubo un error tratando de eliminar la transacción' });
  }
});
```

## Conclusión ##

En conclusión, la práctica nos brindó la oportunidad de aplicar nuestros conocimientos en el desarrollo de sistemas informáticos mediante la implementación de un API REST para una tienda de muebles. Utilizando Node.js y Express, logramos diseñar un sistema completo que permite la gestión eficiente de clientes, proveedores, inventario de muebles y transacciones. A lo largo del proceso, aprendimos a programar defensivamente, documentar nuestras decisiones de diseño y realizar pruebas exhaustivas para garantizar la calidad del código. Esta experiencia nos ha preparado para enfrentar desafíos similares en proyectos futuros y nos ha brindado una comprensión más profunda del desarrollo de sistemas informáticos en el mundo real.

## Dificultades ##
Durante el desarrollo de nuestro proyecto, nos enfrentamos a varias dificultades que pusieron a prueba nuestra capacidad para resolver problemas y adaptarnos a situaciones imprevistas. Una de las principales dificultades fue el problema con la VPN al ejecutar nuestras pruebas. En un principio, no nos dimos cuenta de cómo esta conexión externa podía afectar el rendimiento de nuestras pruebas, lo que resultó en retrasos y desconexiones inesperadas. Fue un recordatorio importante de la necesidad de entender completamente nuestro entorno de trabajo y anticipar posibles obstáculos.

Otro desafío significativo fue el error del servidor interno, que nos dejó perplejos durante varias horas. No pudimos determinar la causa exacta del problema, lo que nos llevó a revisar meticulosamente nuestro código y configuración en busca de posibles errores. Finalmente, el servidor volvió a funcionar sin explicación aparente, lo que nos dejó con una sensación de alivio y una lección aprendida sobre la importancia de la paciencia y la persistencia en el desarrollo de software.

## Bibliografía ##
> Práctica 13 - DSIkea: API REST con Node/Express. (n.d.). Desarrollo De Sistemas Informáticos - Grado En Ingeniería Informática - ULL. https://ull-esit-inf-dsi-2324.github.io/prct13-DSIkea-api/

> Cloud application hosting for developers | Render. (n.d.). Cloud Application Hosting for Developers | Render. https://dashboard.render.com/

> Projects | Cloud: MongoDB Cloud. (n.d.). https://cloud.mongodb.com/v2#/org/663b4e5f66e117266a136106/projects

> How do I use SuperTest in my Node.js TypeScript project? (n.d.). Stack Overflow. https://stackoverflow.com/questions/76596884/how-do-i-use-supertest-in-my-node-js-typescript-project
