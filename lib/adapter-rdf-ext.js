

function RDFExtAdapter(graph) {

    this.graph = graph

}

RDFExtAdapter.prototype.match = function match(triple, callback) {

    callback(null, this.graph.match(
        triple.subject, triple.predicate, triple.object).toArray().map(mapTriple))

    function mapTriple(triple)
    {
        return {
            subject: triple.subject.toString(),
            predicate: triple.predicate.toString(),
            object: triple.object.toString()
        }
    }


}

module.exports = RDFExtAdapter



