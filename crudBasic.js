'use strict'


const openModal = () => document.getElementById('novo-cadastro')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('novo-cadastro').classList.remove('active')
}

const limpar = () => {
    clearFields()
}

    const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] 
    const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))
    //CRUD
    
    const deleteClient = (index) => {
        const dbClient = readClient()
        dbClient.splice(index, 1)
        setLocalStorage(dbClient)
    }
    
    const updateClient = (index, client) => {
        const dbClient = readClient()
        dbClient[index] = client
        setLocalStorage(dbClient)
    }
    
    const readClient = () => getLocalStorage()
    
    const createClient = (client) => {
        const dbClient = getLocalStorage()
        dbClient.push(client)
        setLocalStorage(dbClient)
    }
    
    const isValidFields = () => {
        return document.getElementById('form').reportValidity()
    }
    
    //Interação com o layout
    const clearFields = () => {
        const fields = document.querySelectorAll('.modal-field')
        fields.forEach(field => field.value = "")
    }
    
    const saveClient = () => {
        if (isValidFields()) {
            const client = {
                nome: document.getElementById('nome').value,
                server: document.getElementById('server').value,
                lane: document.getElementById('lane').value,
                email: document.getElementById('email').value
            }
            const index = document.getElementById('nome').dataset.index
            if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
            } else {
                updateClient(index, client)
                updateTable()
                closeModal()
            }
        }
    }
    
    const createRow = (client, index) => {
        const newRow = document.createElement('tr')
        newRow.innerHTML = `
            <td>${client.nome}</td>
            <td>${client.server}</td>
            <td>${client.lane}</td>
            <td>${client.email}</td>
            <td>
                <button type="button" class="button green" id="edit-${index}">Editar</button>
                <button type="button" class="button red" id="delete-${index}">Excluir</button>
            </td>
        `
        document.querySelector('#tableClient>tbody').appendChild(newRow)
    }
    
    const clearTable = () => {
        const rows = document.querySelectorAll('#tableClient>tbody tr')
        rows.forEach(row => row.parentNode.removeChild(row))
    }
    
    const updateTable = () => {
        const dbClient = readClient()
        clearTable()
        dbClient.forEach(createRow)
    }
    
    const fillFields = (client) => {
        document.getElementById('nome').value = client.nome
        document.getElementById('server').value = client.server
        document.getElementById('lane').value = client.lane
        document.getElementById('email').value = client.email
        document.getElementById('nome').dataset.index = client.index
    }
    
    const editClient = (index) => {
        const client = readClient()[index]
        client.index = index
        fillFields(client)
        openModal()
    }
    
    const editDelete = (event) => {
        if (event.target.type == 'button'){
    
            const [action, index] = event.target.id.split('-')
    
        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm (`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
                }
            }
        }
    }
    
    updateTable()

//CRUD    
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('limpar')
    .addEventListener('click', limpar)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)