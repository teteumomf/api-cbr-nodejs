'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Cotacao = use('App/Models/Cotacao')
/**
 * Resourceful controller for interacting with cotacaos
 */
class CotacaoController {
  /**
   * Show a list of all cotacaos.
   * GET cotacaos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const cotacoes = Cotacao.all()

    return cotacoes
  }

  /**
   * Create/save a new cotacao.
   * POST cotacaos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const { id } = auth.user
    const data = request.only([
      "boi_aprazo",
      "boi_avista",
      "vaca_aprazo",
      "vaca_avista",
      "capacidade_cbs",
      "frete_gratis"
    ])

    const cotacao = await Cotacao.create({ ...data, user_id: id })

    return cotacao
  }

  /**
   * Display a single cotacao.
   * GET cotacaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    console.log(params.id)
    const cotacao = await Cotacao.findByOrFail("user_id", params.id)

    await cotacao.load('user')

    return cotacao
  }

  /**
   * Update cotacao details.
   * PUT or PATCH cotacaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const cotacao = await Cotacao.findByOrFail("user_id", params.id)

    const data = request.only([
      "boi_aprazo",
      "boi_avista",
      "vaca_aprazo",
      "vaca_avista",
      "capacidade_cbs",
      "frete_gratis"
    ])
    //console.log('boi a vista_ol: ' +cotacao.boi_avista_old + ' | boi a vista vindo: ' + data.boi_avista )
    if (cotacao.boi_avista !== data.boi_avista) {
      cotacao.boi_avista_old = cotacao.boi_avista
    }
    if (cotacao.boi_aprazo !== data.boi_aprazo){
      cotacao.boi_aprazo_old = cotacao.boi_aprazo
    }
    if(cotacao.vaca_avista !== data.vaca_avista){
      cotacao.vaca_avista_old = cotacao.vaca_avista
    }
    if(cotacao.vaca_aprazo !== data.vaca_aprazo){
      cotacao.vaca_aprazo_old = cotacao.vaca_aprazo
    }
    if(cotacao.capacidade_cbs !== data.capacidade_cbs){
      cotacao.capacidade_cbs_old = cotacao.capacidade_cbs
    }
    if(cotacao.frete_gratis !== data.frete_gratis){
      cotacao.frete_gratis_old = cotacao.frete_gratis
    }


    cotacao.merge(data)

    await cotacao.save()

    return cotacao
  }

  /**
   * Delete a cotacao with id.
   * DELETE cotacaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth }) {
    const cotacao = await Cotacao.findOrFail(params.id)

    if (cotacao.user_id !== auth.user.id) {
      return response.status(401).send({ error: 'Not authorized' })
    }

    await cotacao.delete()
  }
}

module.exports = CotacaoController
