'use strict'

const crypto = require('crypto')
const moment = require('moment')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
    async store ({ request, response}) {
        try {
            const email = request.input('email')
            const url = request.input('redirect_url')
            
            const user = await User.findByOrFail('email', email)
            //vai gerar um token com 10 bytes e converter em string hexadecimal
            user.token = crypto.randomBytes(10).toString('hex')
            user.token_created_at = new Date()
    
            await user.save()
            

            await Mail.send(
                ['emails.forgot_password',],
                {nome: user.nome_fantasia, email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}`},
                message => {
                    message
                       .to(user.email)
                       .from('matheusmm3@hotmail.com', 'Matheus | CBR')
                       .subject('Recuperar senha CBR')
                }
            )
        } catch(err){
            return response.status(err.status)
            .send({ error: { message: "O email inserido não foi encontado na base de dados. Esse email existe?" }})
        } 
    }

    async update({ request, response }){
        try{
            const { token , password } = request.all()

            const user = await User.findByOrFail('token', token)

            //Verifica se o token já não tem mais de 1 dia - foi expirado
            const tokenExpired = moment()
               .subtract('1', 'days')
               .isAfter(user.token_created_at)

            if(tokenExpired){
                return response.status(401)
                .send({ message: "O token de recuperação de senha está expirado." })                
            }

            user.token = null
            user.token_created_at = null
            user.password = password

            await user.save()


        } catch(err){
            return response.status(err.status)
            .send({ error: { message: "Algo deu errado ao resetar sua senha." }})
        } 
    }

    async show ({ params, request, response, view }) {
        try {
            const token = request.all()
            const user = await User.findByOrFail('token', token)
            
            return user
        } catch(err){
            return response.status(err.status)
            .send({ message: "Algo deu erreado ao resetar sua senha." })
        } 
      }
}

module.exports = ForgotPasswordController
