'use strict'

const Database = use('Database');
const User = use('App/Models/User');

class SessionController {
  async create ({ request, auth, response }) { 
    const { email, password } = request.all()

    const tipo_usuario =  await Database.select('tipo_usuario').from('users').where('email', email).where('tipo_usuario', 0)
    
    if ( tipo_usuario){
        const token = await auth.attempt(email, password)
        return token
    } else {
      return response.status(401).send({ error: 'Not authorized' })
    }
    
    
  }

  async createUsuario ({ request, auth, response }) { 
    const { email, password } = request.all()
    
    const tipo_usuario =  await Database.select('tipo_usuario').from('users').where('email', email).where('tipo_usuario', 1)
    
    if ( tipo_usuario){
        const token = await auth.attempt(email, password)
        return token
        
    } else {
      return response.status(401).send({ error: 'Not authorized' })
    }
    
    
  }

}


// Exemplo de como fazer uma consulta com mais de uma condição
// const user =  await Database.from('users').where(function () {
//   this.where('email', email)
//   this.where('tipo_usuario', 1)
//   this.where('razao_social', 'MM Tecnologia')
// });

module.exports = SessionController