const express = require("express");
const routerProductos = express.Router();

const DB_PRODUCTOS = [];


routerProductos.get( "/", (req, res) => {
    res.render('vista', {DB_PRODUCTOS});

});


module.exports = routerProductos;