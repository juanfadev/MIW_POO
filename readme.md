# Server NodeJS

Desplegado en: https://miwpoonode.herokuapp.com/

Caracteristicas a tener en cuenta:
* Transformación métodos asincronos de I/O en promesas usando Promisify.
* Utilización de promesas usando ASYNC/AWAIT.
* Implementado todo usando NodeJS, sin frameworks.
* Negociación de contenido.
* Separación modular del código (modulos NodeJS).
* Factoría de JSON (objetos). Separación en servicios, controlador y servidor.
* Añadido JSONLD en la etiqueta script en el head de los documentos HTML de las entidades.
* Validación de entidades usando el servicio de validación de schema de Google a través de la API REST en /validate. Hecho por mi mediante analisis de la API Google e ingeniería inversa. (Se utiliza en el cliente para validar todas las entidades)

