'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CotacaoSchema extends Schema {
  up() {
    this.create('cotacaos', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.float('boi_avista').notNullable()
      table.float('boi_aprazo').notNullable()
      table.float('vaca_avista').notNullable()
      table.float('vaca_aprazo').notNullable()
      table.float('boi_avista_old').defaultTo(0)
      table.float('boi_aprazo_old').defaultTo(0)
      table.float('vaca_avista_old').defaultTo(0)
      table.float('vaca_aprazo_old').defaultTo(0)
      table.integer('capacidade_cbs').defaultTo(0)
      table.integer('frete_gratis').defaultTo(0)
      table.integer('capacidade_cbs_old').defaultTo(0)
      table.integer('frete_gratis_old').defaultTo(0)
      table.timestamps()
    })
  }

  down() {
    this.drop('cotacaos')
  }
}

module.exports = CotacaoSchema
