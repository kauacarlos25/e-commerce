const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Camisa = db.define('camisa',{
    num_camisa:{
        type: DataTypes.STRING(10)
    },
    nome: {
        type: DataTypes.STRING(100)  // nome da camisa
    },
    tamanho:{
        type: DataTypes.STRING(30)  // M
    },
    tipo:{
        type: DataTypes.STRING(30)  // masculino ou feminino
    },
    quantidadeEstoque: {
        type: DataTypes.INTEGER
    },
    precoUnitario: {
        type: DataTypes.FLOAT  // 123.45
    },
    descricao: {
        type: DataTypes.STRING(30)
    }
},{
    createdAt: false,
    updatedAt: false
})

// Camisa.sync({force:true})

module.exports = Camisa