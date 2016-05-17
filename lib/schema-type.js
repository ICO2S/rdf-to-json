
function SchemaType(typeSchema) {

    this.name = typeSchema.name
    this.uri = typeSchema.uri
    this.properties = typeSchema.properties

}

SchemaType.prototype = {
    predicateToProperty: predicateToProperty
}

module.exports = SchemaType

function predicateToProperty(predicate) {

    for(var i = 0; i < this.properties.length; ++ i)
        if(this.properties[i].predicate === predicate)
            return this.properties[i]

}





