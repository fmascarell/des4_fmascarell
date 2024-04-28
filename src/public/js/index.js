const socket = io();

socket.on('productos', productos => {

    console.log(productos);
    const tbody = document.getElementById('productos-body');
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const row = tbody.insertRow();

        row.innerHTML = `
        <td>${producto.id}</td>
        <td>${producto.title}</td>
        <td>${producto.description}</td>
        <td>${producto.price}</td>
        <td>${producto.code}</td>
        <td>${producto.stock}</td>
        <td>${producto.category}</td>
        <td>${producto.status ? 'Activo': 'Inactivo'}</td>
        <td>${producto.thumbnails.lenght > 0 ? producto.thumbnails[0]:'Sin imágen'}</td>
        `;
    });
});

const formulario = document.getElementById('form-prod'); 

formulario.addEventListener('submit', function (event) {
    event.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const codigo = document.getElementById('codigo').value;
    const stock = document.getElementById('stock').value;
    const categoria = document.getElementById('categoria').value;

    const producto = {
        title: titulo,
        description: descripcion,
        price: precio,
        code: codigo,
        stock: stock,
        category:categoria
    }

    socket.emit('addProduct', producto);
})