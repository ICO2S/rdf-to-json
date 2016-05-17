
var SchemaType = require('./schema-type')

function Schema(schema) {

    this.types = schema.types.map((type) => new SchemaType(type))

}

Schema.prototype = {
    uriToType: uriToType
}

module.exports = Schema

function uriToType(uri) {

    for(var i = 0; i < this.types.length; ++ i)
        if(this.types[i].uri === uri)
            return this.types[i]

}


