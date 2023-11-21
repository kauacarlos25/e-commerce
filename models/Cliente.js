const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Cliente = db.define('cliente',{
    usuario: {
        type: DataTypes.STRING(50) // nome do usuário
        // allowNull: false,  // não permite que o campo seja nulo
    },
    email: {
        type: DataTypes.STRING(50),  // nome.sobrenome@gmail.com,
        // allowNull: false,  // não permite que o campo seja nulo
        // unique: true  // Certifique-se de que os emails sejam únicos
    },    
    telefone: {
        type: DataTypes.STRING(20)  // (047) 9 8877 6655
    },
    cpf: {
        type: DataTypes.STRING(50),  // 999 888 777 66
        // allowNull: false,  // não permite que o campo seja nulo
        // unique: true  // Certifique-se de que o CPF seja único
    },
    senha: {
        type: DataTypes.STRING(100)  // sem regras, definida pelo usuário
        // allowNull: false,  // não permite que o campo seja nulo
    },
    tipo:{
        type: DataTypes.STRING(30) // cliente e admin
    },
    // rua: {
    //     type: DataTypes.STRING(50)
    // },
    // numero: {
    //     type: DataTypes.INTEGER
    // },
    // bairro: {
    //     type: DataTypes.STRING(50)
    // },
    // complemento: {
    //     type: DataTypes.STRING(50)
    // },
    // cep:{
    //     type: DataTypes.STRING(12)
    // },
    // cidade:{
    //     type: DataTypes.STRING(50)
    // },
    // estado: {
    //     type: DataTypes.STRING(50)
    // }
},{
    createdAt: false,
    updatedAt: false
})

// Cliente.sync({force:true})

module.exports = Cliente