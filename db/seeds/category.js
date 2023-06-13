const axios = require('axios')

exports.seed = async function (knex) {
    return knex.schema.hasTable('category').then(async (exists) => {
        if (exists) {
            const response = await axios.post('https://api.chainverse.org/', {
                operationName: 'ApplicationCategories',
                variables: {},
                query: 'query ApplicationCategories{\nquery:applicationCategories{\ntotal\ndata{\nid\nname\napplications{\nid\nname\ncoin\nlogo\nurl\ndescription\nis_verify\n__typename\n}\n__typename\n}\n__typename\n}\n}\n',
            })

            const { data } = response.data.data.query

            let index = 1
            for (const categoryData of data) {
                const existingCategory = await knex('category').where('name', categoryData.name).first()
                if (!existingCategory) {
                    delete categoryData.id
                    delete categoryData['__typename']
                    const [categoryId] = await knex('category').insert({
                        name: categoryData.name,
                        position: index,
                    })

                    for (const applicationData of categoryData.applications) {
                        const existingApp = await knex('application')
                            .select('id')
                            .where('url', applicationData.url)
                            .first()

                        if (!existingApp) {
                            delete applicationData.id
                            delete applicationData['__typename']
                            const [applicationId] = await knex('application').insert(applicationData)
                            await knex('category_application').insert({
                                category_id: categoryId,
                                application_id: applicationId,
                            })
                        } else {
                            await knex('category_application').insert({
                                category_id: categoryId,
                                application_id: existingApp.id,
                            })
                        }
                    }
                }
                index++
            }
        }
    })
}
