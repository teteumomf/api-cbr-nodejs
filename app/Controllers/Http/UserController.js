"use strict"

const User = use("App/Models/User")
const Mail = use('Mail')

class UserController {
  async create({ request, response }) {
    try {
      const usuario = request.input('tipo_usuario')

      var data;
      var template;
      //1 é usuario (produtor rural)
      if (usuario == 1) {
        data = request.only([
          "username",
          "email",
          "password",
          "tipo_usuario",
        ])

        template = "emails.welcome_usuario"
        //0 é cliente (frigorificos)    
      } else {
        console.log('aqui')
        data = request.only([
          "username",
          "email",
          "password",
          "tipo_usuario",
          "nome_fantasia",
          "cnpj",
          "razao_social",
          "telefone",
          "cep",
          "endereco",
          "cidade",
          "estado",
          "latitude",
          "longitude"
        ])

        template = "emails.welcome_cliente"
      }

      const user = await User.create(data)
      console.log(user)
      await Mail.send(
        [template],
        { nome: user.username },
        message => {
          message
            .to(user.email)
            .from('matheusmm3@hotmail.com', 'Matheus | CBR')
            .subject('Bem vindo à CBR')
        }
      )

      return user

    } catch (err) {
      console.log(err)
      return response.status(err.status)
        .send({ error: { message: "Erro ao criar usuário." } })
    }
  }

  async index({ request }) {
    const { latitude, longitude } = request.all()

    const users = User.query()
      .with('cotacoes')
      .with('images')
      .nearBy(latitude, longitude, 100)
      .fetch()

    return users
  }

  async show({ params, request, response, view }) {
    const user = await User.findOrFail(params.id)

    await user.load('cotacoes')
    await user.load('images')

    return user
  }

  async setId({ request }) {
    try {
      const email = request.input('email')

      const user = await User.findByOrFail('email', email)

      if (!user) {
        return response.status(err.status)
          .send({ error: { message: "Usuario não encontrado" } })
      }

      return user
    } catch (err) {
      return response.status(err.status)
        .send({ error: { message: "Ocorreu um erro ao procurar usuario" } })
    }
  }

  async update({ params, request, response }) {
    const user = await User.findOrFail(params.id)
    const tipo_usuario = user.tipo_usuario

    var data;

    if (tipo_usuario == 1) {
      data = request.only([
        "username",
        "email",
        "password",
        "tipo_usuario",
      ])
    } else {
      data = request.only([
        "username",
        "email",
        "password",
        "tipo_usuario",
        "nome_fantasia",
        "cnpj",
        "razao_social",
        "telefone",
        "plano",
        "cep",
        "endereco",
        "cidade",
        "estado",
        "latitude",
        "longitude"
      ])
    }

    user.merge(data)

    await user.save()

    return user
  }

  async destroy({ params, request, response, auth }) {
    const user = await User.findOrFail(params.id)

    if (user.id !== auth.user.id) {
      return response.status(401).send({ error: 'Not authorized' })
    }

    await user.delete()
  }
}

module.exports = UserController