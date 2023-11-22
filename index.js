const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')
const conn = require('./db/conn')
const Cliente = require('./models/Cliente')
const Camisa = require('./models/Camisa')
const PORT = 3000
const hostname = 'localhost'

let log = false
let usuario = ''
let tipoUsuario = ''
  
/* ------------ Configuração express --------------- */
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
/* ------------ Configuração express-handlebars ---- */
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
/* ------------------------------------------------- */

// ================== Produtos à venda =======================

app.post('/comprar', async (req, res) => {
    const dados_carrinho = req.body;
    console.log(dados_carrinho);

    const atualiza_promise = [];

    for (const item of dados_carrinho) {
        const camisa = await Camisa.findByPk(item.cod_prod, { raw: true });
        console.log(camisa);

        if (!camisa || camisa.quantidadeEstoque < item.qtde) {
            return res.status(400).json({ message: "Produto insuficiente ou não disponível" });
        }

        const novaQuantidadeEstoque = camisa.quantidadeEstoque - item.qtde;

        // Atualize o estoque no banco de dados
        const atualiza_promessa = await Camisa.update(
            { quantidadeEstoque: novaQuantidadeEstoque },
            { where: { id: item.cod_prod } }
        );

        atualiza_promise.push(atualiza_promessa);
    }

    try {
        await Promise.all(atualiza_promise);
        res.status(200).json({ message: "Compra realizada com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar os dados" + error);
        res.status(500).json({ message: "Erro ao processar a compra" });
    }
});


app.get('/carrinho', (req,res)=>{
    res.render('carrinho', {log, usuario, tipoUsuario})
})

app.get('/feminino', (req,res)=>{
    res.render('feminino', {log, usuario, tipoUsuario})
})
app.get('/masculino', (req,res)=>{
    res.render('masculino', {log, usuario, tipoUsuario})
})


// ===================== gerenciamento interno ===============
app.get('/listarCamisa', async (req,res)=>{
    const dados = await Camisa.findAll({raw:true})
    console.log(dados)
    res.render('listarCamisa', {log, usuario, tipoUsuario, valores:dados})
})

app.post('/cadastrarCamisa', async (req,res)=>{
    const nome = req.body.nome
    const tamanho = req.body.tamanho
    const tipo = req.body.tipo
    const quantidadeEstoque = req.body.quantidadeEstoque
    const precoUnitario = req.body.precoUnitario
    const descricao = req.body.descricao
    console.log(nome,tamanho, tipo, quantidadeEstoque, precoUnitario, descricao)
    await Camisa.create({nome:nome, tamanho:tamanho, tipo: tipo, quantidadeEstoque: quantidadeEstoque, precoUnitario: precoUnitario, descricao: descricao})
    let msg = 'Dados Cadastrados'
    res.render('cadastrarCamisa', {log, usuario, tipoUsuario})
})


app.get('/cadastrarCamisa', (req,res)=>{
    res.render('cadastrarCamisa', {log, usuario, tipoUsuario})
})
app.post("/cadastrarCliente", async (req, res) => {
    const usuario = req.body.usuario;
    const email = req.body.email;
    const telefone = req.body.telefone;
    const cpf = req.body.cpf;
    const senha = req.body.senha;
    const tipo = req.body.tipo;
    const msg = "Preencha todos os dados!!"

    if(!nome  || !email  || !senha  || !cpf  || !telefone || !tipo){
        res.render("cadastro",{log,msg,usuario,tipoUsuario})
    }else{
    bcrypt.hash(senha, 10, async (err, hash) => {
        if (err) {
            console.error("Erro ao criar o hash da senha" + err);
            res.render("home", { log });
            return;
        }
        try {
            await Usuarios.create({usuario: usuario,email: email, telefone: telefone,cpf: cpf,senha: hash,tipo: tipo,});
            log = true;
            usuario = usuario
            tipoUsuario = tipo
            res.render('home', { log,usuario,tipoUsuario });
        } catch (error) {
            console.error("Erro ao criar a senha" + error);
            res.render('home', { log ,usuario,tipoUsuario});
        }
    }); 
    }


});


app.get('/cadastrarCliente', (req,res)=>{
    res.render('cadastrarCliente', {log, usuario, tipoUsuario})
})
app.post('/editarCamisa', async (req, res) => {
    const nome = req.body.nome;
    const tamanho = Number(req.body.tamanho);
    const tipo = req.body.tipo;
    const quantidadeEstoque = Number(req.body.quantidadeEstoque);
    const precoUnitario = Number(req.body.precoUnitario);
    const descricao = req.body.descricao;

    try {
        const [numRowsUpdated, updatedRows] = await Camisa.update(
            {
                tamanho: tamanho,
                tipo: tipo,
                quantidadeEstoque: quantidadeEstoque,
                precoUnitario: precoUnitario,
                descricao: descricao
            },
            {
                where: { nome: nome },
                returning: true
            }
        );

        if (numRowsUpdated > 0) {
            const updatedCamisa = updatedRows[0].get();
            console.log("Camisa atualizada com sucesso:", updatedCamisa);
            res.redirect('/editarCamisa');
        } else {
            console.log("Camisa não encontrada para atualizar.");
            res.status(404).send("Camisa não encontrada para atualizar.");
        }
    } catch (error) {
        console.error("Erro ao atualizar os dados", error);
        res.status(500).send("Erro ao processar a atualização da camisa.");
    }
})
app.post('/consultaCamisa', async (req, res)=>{
    const nome_camisa = req.body.nome
    console.log(nome_camisa)
    const dados = await Camisa.findOne({raw:true, where: {nome:nome_camisa}})
    console.log(dados)
    res.render('editarCamisa',{log, usuario, tipoUsuario, valor:dados} )
})

app.get('/editarCamisa', (req,res)=>{
    res.render('editarCamisa', {log, usuario, tipoUsuario})
})
app.post('/excluirCamisa', async (req,res)=>{
    const nome = req.body.nome
    const pesq = await Camisa.findOne({where: {nome: nome}})
    console.log(pesq)
    let msg = 'Camisa excluída'
    let msg2 = 'Camisa não encontrada'
    if(pesq == null){
        res.render('excluirCamisa', {log,usuario,msg2})
    }else if(pesq.nome == nome){
        await Camisa.destroy({where: {nome: pesq.nome}})
        res.render('excluirCamisa', {log,usuario,tipoUsuario,msg})
    }else{
        res.render('excluirCamisa', {log,usuario,tipoUsuario,msg2})
    }
})

app.get('/excluirCamisa', (req,res)=>{
    res.render('excluirCamisa', {log,usuario,tipoUsuario })
})

// =================== login no sistema ======================

app.post('/login', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    console.log(email,senha)
    const pesq = await Cliente.findOne({raw:true, where:{email:email,senha:senha}})
    console.log(pesq)
    let msg = 'Usuário não Cadastrado'
    if(pesq == null){
        res.render('home', {msg})
    }else if(email == pesq.email && senha == pesq.senha && pesq.tipo === 'admin'){
        log = true
        usuario = pesq.usuario
        tipoUsuario = pesq.tipo
        console.log(tipoUsuario)
        res.render('gerenciador', {log, usuario, tipoUsuario})        
    }else if(email == pesq.email && senha == pesq.senha && pesq.tipo === 'cliente'){
        log = true
        usuario = pesq.usuario
        tipoUsuario = pesq.tipo
        console.log(usuario)
        res.render('home', {log, usuario, tipoUsuario})
        
    }else{
        res.render('home', {msg})
    }
    // res.redirect('/')
})

app.get('/login', (req,res)=>{
    log = false
    usuario = ''
    res.render('login', {log, usuario})
})

app.get('/logout', (req,res)=>{
    log = false
    usuario = ''
    res.render('home', {log, usuario, tipoUsuario})
})

app.get('/', (req,res)=>{
    usuario = ''
    res.render('home', {log, usuario, tipoUsuario})
})
/* ------------------------------------------------- */
conn.sync().then(()=>{
    app.listen(PORT,hostname, ()=>{
        console.log(`Servidor Rodando em ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('Erro de conexão com o banco de dados!'+error)
})
