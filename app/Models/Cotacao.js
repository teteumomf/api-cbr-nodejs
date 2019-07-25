'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Cotacao extends Model {
    user () {
        return this.belongsTo('App/Models/User')
    }
}

module.exports = Cotacao
