'use strict'
const Helpers = use('Helpers')
const Image = use('App/Models/Image')
const User = use('App/Models/User')

class ImageController {
    async show ({ params, response }) {
        return response.download(Helpers.tmpPath(`uploads/${params.path}`))
    }

    async store ({ params, request }){
        const usuario = await User.findOrFail(params.id)

        const images = request.file('image', {
          types: ['image'],
          size: '2mb'
        })
      
        await images.moveAll(Helpers.tmpPath('uploads'), file => ({
          name: `${Date.now()}-${file.clientName}`
        }))
      
        if (!images.movedAll()) {
          return images.errors()
        }
      
        await Promise.all(
          images
            .movedList()
            .map(image => usuario.images().create({ path: image.fileName }))
        )
    }

    async destroy ({ params, request, response, auth }) {
        // console.log(params.id)
        const image = await Image.findOrFail(params.id)
    
        if (image.user_id !== auth.user.id) {
          // console.log('Não autorizado')
          return response.status(401).send({ error: 'Not authorized' })
        }
    
        await image.delete()
      }
}

module.exports = ImageController
