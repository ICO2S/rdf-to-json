
function partialApply(fn) {

    var context = this

    var args = [].slice.call(arguments, 1)

    return function() {

        var otherArgs = [].slice.call(arguments, 0)

        fn.apply(context, args.concat(otherArgs))
    }
}

module.exports = partialApply

