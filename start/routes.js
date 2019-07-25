'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.get('/', () => {
//   return { greeting: 'Hello world in JSON' }
// })
//-------------------------------------------LOGIN----------------------------------------------------------------------
Route.post('/login', 'SessionController.create')//LOGIN CLIENTE
Route.post('/entrar', 'SessionController.createUsuario')//LOGIN USUARIO
//-------------------------------------------CLIENTES/USUARIOS----------------------------------------------------------
Route.post('/users', 'UserController.create') //CADASTRAR
Route.get('/users', 'UserController.index').middleware('auth')//MOSTRAR TODOS
Route.get('/users/:id', 'UserController.show').middleware('auth')//MOSTRAR ESPECIFICO
Route.put('/users/:id', 'UserController.update').middleware('auth')//EDITAR
Route.put('/usersplan/:id', 'UserController.update')//EDITAR PLANO
Route.delete('/users/:id', 'UserController.destroy').middleware('auth')//DELETAR
Route.post('/getid', 'UserController.setId')
//-------------------------------------------COTAÇÃO--------------------------------------------------------------------
Route.resource('cotacao', 'CotacaoController')
      .apiOnly()
      .middleware('auth')
//-------------------------------------------IMAGENS--------------------------------------------------------------------
Route.post('users/:id/images', 'ImageController.store').middleware('auth')//CADASTRAR
Route.get('images/:path', 'ImageController.show')// MOSTRAR URL
Route.delete('users/images/:id', 'ImageController.destroy').middleware('auth')//DELETAR
//-------------------------------------------ESQUECEU SENHA--------------------------------------------------------
Route.post('forgotpassword', 'ForgotPasswordController.store')//Solicitar recuperação de senha
Route.put('reset_password', 'ForgotPasswordController.update')