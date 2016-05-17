
var async = require('async')

var partialApply = require('./partial-apply')

function rdfToJson(adapter, schema, callback) {

    var a = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'

    var objects = []

    schema.types.forEach(forEachType)

    function forEachType(type) {

        adapter.match({

            predicate: a,
            object: type.uri

        }, partialApply(onTypeTriples, type))

    }

    function onTypeTriples(type, err, typeTriples) {

        if(err)
            return callback(err)

        async.eachSeries(typeTriples, (triple, next) => {

            getObject(type, triple.subject, (err, object) => {

                if(err)
                    return next(err)

                objects.push(object)

                next()

            })

        }, function done(err) {

            if(err)
                return callback(err) 

            callback(null, objects)
                  
        })

    }

    function getObject(type, uri, callback) {

        adapter.match({

            subject: uri

        }, (err, triples) => {

            if(err)
                return callback(err)

            var object = {
                uri: uri
            }

            async.eachSeries(triples, (triple, next) => {

                if(triple.predicate === a)
                    return next()

                var property = type.predicateToProperty(triple.predicate)

                if(property === undefined) {

                    object[triple.predicate] = triple.object
                    return next()
                }

                var typeInfo = lookupType(property.type),
                    propertyType = typeInfo.type,
                    arrayType = typeInfo.arrayType

                function addValue(value, next) {

                    if(arrayType) {

                        if(object[property.name] === undefined)
                            object[property.name] = []

                        object[property.name].push(value)
                        next()

                    } else {

                        if(object[property.name] !== undefined) {

                            next(new Error('Property has multiple values: ' + property.name))
                            return false

                        }

                        object[property.name] = value
                        next()
                    }

                }

                if(property.composition === 'aggregate') {

                    return addValue(triple.object, next)

                }

                if(typeof(propertyType) === 'string') {

                    switch(propertyType) {

                        case 'string':
                            return addValue(triple.object, next)

                        default:

                            next(new Error('unknown property type: ' + propertyType))
                            return
                    }


                } else {

                    getObject(propertyType.uri, triple.object, (err, propertyObject) => {

                        if(err)
                            return next(err)

                        return addValue(propertyObject, next)
                    })

                }

            }, function done(err) {

                if(err)
                    callback(err)
                else
                    callback(null, object)
            })

        })
    }


    function lookupType(typeName) {

        var arrayType = false

        if(typeName.indexOf('[]') !== -1) {

            typeName = typeName.split('[]').join('')
            arrayType = true

        }

        var type = schema.uriToType(typeName)

        return {
            type: type || typeName,
            arrayType: arrayType
        }
    }
}

module.exports = rdfToJson



