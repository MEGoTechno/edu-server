// query.role ? match.role = { $regex: query.role, $options: "i" } : null

const makeMatch = (match, params) => {

    if (params.length === 0) return match

    params?.map(param => {
        
        if (param?.value?.startsWith('!')) {
            param.value ? match[param.key] = { $ne: param.value.split("!")[1] } : null
            return
        }
        if (param.type === "boolean") {
            param.value ? match[param.key] = (param.value === 'true') : null
            return
        }

        if (param.type === "number") {
            param.value ? match[param.key] = Number(param.value) : null
            return
        }


        if (param.operator === "equal") {
            param.value && param.value !== "All" && param.value !== "all"
                ? match[param.key] = param.value : null

        } else {
            param.value && param.value !== "All" && param.value !== "all"
                ? match[param.key] = { $regex: param.value, $options: "i" } : null
        }

    })

    return match
}

const addQuery = (match, param) => {
    return match[param.key] = param.value
}

module.exports = { makeMatch, addQuery }