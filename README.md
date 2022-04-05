# Secure Socket Webapp

This project consists of an angular client app and a nest server app

## Building and running the application

To build and run the application refer to the subfolder README files. Start with the nest application!

## Limitations

The application was developed to work with Chrome, version 100+. Proper operation is only guaranteed on the aforementioned browser and version.

## Libraries

- Socket.io : I use this lib to handle socket connections, because it is the default in nestjs and I also have prior experience with this library.
- ngx-socket-io : I use this lib to handle the socket client-side, I have prior knowledge of Socket.io and using this lib provides an easy-to-use abstraction on top of it.
- crypto : I use this lib to generater the private keys, this is a default node lib to handle such tasks.
- crypto-js :  I use this lib to handle any encoding, decoding and hashing, this is the most widely used js library to handle such tasks.
- cypher :  I use this lib to e2e testing, it is a widely used and well documented testing library.

## Development opportunities

- mock out socket connection in e2e tests instead of calling the triggered functions.
- create rooms for socket.io to be able to run multiple sessions simultaniously.
- use a reliable alternative to the custom solution of the integrity protection used in the application.
