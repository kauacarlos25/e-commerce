const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Camisa = db.define('camisa',{
    nome: {
        type: DataTypes.STRING(50)  // nome da camisa
    },
    tamanho:{
        type: DataTypes.INTEGER   // M
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
        type: DataTypes.TEXT
    }
},{
    createdAt: false,
    updatedAt: false
})

// Camisa.sync({force:true})

module.exports = Camisa