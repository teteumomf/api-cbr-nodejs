'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.integer('tipo_usuario').notNullable()
      table.string('nome_fantasia', 240)
      table.string('cnpj', 14).unique()
      table.string('razao_social', 240)
      table.string('telefone', 14)
      table.string('cep', 8)
      table.string('endereco', 240)
      table.string('cidade',100)
      table.string('estado', 100)
      table.integer('patrocinado').defaultTo(0)
      table.integer('plano').defaultTo(0)
      table.datetime('vencimento_plano').defaultTo(this.fn.now())
      table.decimal('latitude', 9, 6)
      table.decimal('longitude', 9, 6)
      table.string('token')
      table.timestamp('token_created_at')            
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
