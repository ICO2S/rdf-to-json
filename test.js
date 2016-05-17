
var RDFExtAdapter = require('./lib/adapter-rdf-ext')
var Schema = require('./lib/schema')

var rdfToJson = require('./lib/rdf-to-json')

var rdf = require('rdf-ext')

var RdfXmlParser = require('rdf-parser-rdfxml')

var fs = require('fs')


var schema = new Schema(JSON.parse(fs.readFileSync('./schema/sbol.json') + ''))

var parser = new RdfXmlParser();                                            

parser.parse(fs.readFileSync('sbol2.xml') + '', function(err, graph) {                                 

    try
    {
        rdfToJson(new RDFExtAdapter(graph), schema, (err, json) => {

            console.log('callback')
            console.log(err)
            console.log(json)

        })

    } catch(e) {

        console.error(e)

    }


});                                                                   






