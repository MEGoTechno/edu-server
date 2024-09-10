const TokenModel = require("../models/TokenModel");
const { getAll } = require("./factoryHandler");

const getTokens = getAll(TokenModel, 'tokens', [], 'user')

module.exports = { getTokens }