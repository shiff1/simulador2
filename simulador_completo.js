
  let clientes = [];
  let creditos = [];

  let tasaInteres = 15;
  let clienteSeleccionado = null;
  let cuotaCalculada = 0;
  let montoCalculado = 0;
  let plazoCalculado = 0;
  let creditoAprobado = false;

  let componente = document.getElementById("parametros");
  let listaClass = componente.classList;
  listaClass.add("activa");
  listaClass.remove("activa");

  function ocultarSecciones (){
     let secciones = document.querySelectorAll("section");
    for (let i = 0; i < secciones.length; i++) {
        secciones[i].classList.remove("activa");
    }
  }

  function mostrarSeccion (id){
    ocultarSecciones();
    document.getElementById(id).classList.add("activa");
  }

  function guardarTasa (){
    let valor = document.getElementById("tasaInteres").value;
    tasaInteres = Number(valor);
    let mensaje = document.getElementById("mensajeTasa");
    if(tasaInteres >= 10 && tasaInteres <= 20){
      mensaje.innerHTML = "taza configurada correctamente:"+ tasaInteres +"%";
    }else{
       mensaje.innerHTML = "La tasa debe estar entre 10% y 20%";
    }
    
  }

 function limpiarFormulario(){
    document.getElementById("cedulaCliente").value = "";
    document.getElementById("nombreCliente").value = "";
    document.getElementById("apellidoCliente").value = "";
    document.getElementById("ingresosCliente").value = "";
    document.getElementById("egresosCliente").value = "";
 }

function pintarClientes(){
    let tbody = document.getElementById("tablaClientes");
    tbody.innerHTML = ""; // limpiar para no duplicar filas

    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i];

        let fila = document.createElement("tr");

        let tdCedula = document.createElement("td");
        tdCedula.textContent = cliente.cedula;

        let tdNombre = document.createElement("td");
        tdNombre.textContent = cliente.nombre;

        let tdApellido = document.createElement("td");
        tdApellido.textContent = cliente.apellido;

        let tdIngresos = document.createElement("td");
        tdIngresos.textContent = cliente.ingresos;

        let tdEgresos = document.createElement("td");
        tdEgresos.textContent = cliente.egresos;

        let tdCorreos = document.createElement("td");
        tdCorreos.textContent = cliente.correos;

        // Celda de acciones con botón Actualizar
        let tdAcciones = document.createElement("td");
        let btnActualizar = document.createElement("button");
        btnActualizar.textContent = "Actualizar";
        btnActualizar.onclick = function(){
            seleccionarCliente(cliente.cedula);
        };
        tdAcciones.appendChild(btnActualizar);

        fila.appendChild(tdCedula);
        fila.appendChild(tdNombre);
        fila.appendChild(tdApellido);
        fila.appendChild(tdIngresos);
        fila.appendChild(tdEgresos);
        fila.appendChild(tdAcciones);
        fila.appendChild(tdCorreos);


        tbody.appendChild(fila);
    }
}

function buscarCliente(cedula){
    // Recorrer el arreglo buscando por cédula
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            return clientes[i];  // ✅ existe: devuelve el cliente
        }
    }
    return null;  // ❌ no existe
}

function seleccionarCliente(cedula){
    // 1. Buscar el cliente
    let cliente = buscarCliente(cedula);

    // Si no existe, salimos
    if (cliente === null) {
        alert("Cliente no encontrado");
        return;
    }

    // 2. Guardarlo en clienteSeleccionado
    clienteSeleccionado = cliente;

    // 3. Mostrar sus datos en los inputs
    document.getElementById("cedulaCliente").value = cliente.cedula;
    document.getElementById("nombreCliente").value = cliente.nombre;
    document.getElementById("apellidoCliente").value = cliente.apellido;
    document.getElementById("ingresosCliente").value = cliente.ingresos;
    document.getElementById("egresosCliente").value = cliente.egresos;
    document.getElementById("correoCliente").value = cliente.correos;
}

function guardarCliente(){
    let cedula = document.getElementById("cedulaCliente").value;
    let nombre = document.getElementById("nombreCliente").value;
    let apellido = document.getElementById("apellidoCliente").value;
    let correos = document.getElementById("correoCliente").value;
    let ingresos = Number(document.getElementById("ingresosCliente").value);
    let egresos = Number(document.getElementById("egresosCliente").value);
   
    // Buscar si ya existe por cédula
    let cliente = buscarCliente(cedula);

    if (cliente === null) {
        // ✅ NO existe → crear
        let nuevoCliente = {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            ingresos: ingresos,
            egresos: egresos,
            correos: correos
        };
        clientes.push(nuevoCliente);
    } else {
        // ✅ SÍ existe → actualizar (excepto cédula)
        cliente.nombre = nombre;
        cliente.apellido = apellido;
        cliente.ingresos = ingresos;
        cliente.egresos = egresos;
        cliente.correos = correos;
    }

    pintarClientes();
    limpiar();
}

function limpiar(){
    document.getElementById("cedulaCliente").value = "";
    document.getElementById("nombreCliente").value = "";
    document.getElementById("apellidoCliente").value = "";
    document.getElementById("ingresosCliente").value = "";
    document.getElementById("egresosCliente").value = "";
    document.getElementById("correoCliente").value = "";
}

function buscarClienteCredito(){
    // 1. Tomar el valor del campo de cédula
    let cedula = document.getElementById("cedulaCredito").value;

    // 2. Buscar el cliente en el arreglo
    let cliente = buscarCliente(cedula);

    // 4. Si no existe → mensaje
    if (cliente === null) {
        document.getElementById("mensajeCredito").innerHTML = "Cliente no encontrado";
        document.getElementById("datosClienteCredito").innerHTML = "";
        return;
    }

    // 3. Si existe → mostrar sus datos dinámicamente
    document.getElementById("mensajeCredito").innerHTML = "Cliente encontrado";

    document.getElementById("datosClienteCredito").innerHTML = `
        <h3>Datos del Cliente</h3>
        <p><strong>Cédula:</strong>${cliente.cedula}</p>
        <p><strong>Nombre:</strong>${cliente.nombre}</p>
        <p><strong>Apellido:</strong>${cliente.apellido}</p>
        <p><strong>Ingresos:</strong>${cliente.ingresos}</p>
        <p><strong>Egresos:</strong>${cliente.egresos}</p>
        <p><strong>Correos:</strong>${cliente.correos}</p>
    `;
}

function calcularCredito(){
    // Datos del cliente
    let cedula = document.getElementById("cedulaCredito").value;
    let cliente = buscarCliente(cedula);

    if (cliente === null) {
        alert("Primero busca un cliente válido");
        return;
    }

    // Datos del crédito (inputs de la sección de créditos)
    let monto = Number(document.getElementById("montoCredito").value);
    let plazo = Number(document.getElementById("plazoCredito").value);

    // Capacidad de pago: ingresos - egresos
    let capacidadPago = cliente.ingresos - cliente.egresos;

    // Total a pagar: monto + interés (tasaInteres es global, ej. 15)
    let totalPagar = monto + (monto * tasaInteres / 100);

    // Cuota mensual
    let cuotaMensual = totalPagar / plazo;

    // Resultado: aprobado si la cuota cabe en la capacidad de pago
    let aprobado = cuotaMensual <= capacidadPago;

    // Guardar para mostrar después
    creditoAprobado = aprobado;
    cuotaCalculada = cuotaMensual;
    montoCalculado = monto;
    plazoCalculado = plazo;

    // Mostrar resultado
    mostrarResultadoCredito(capacidadPago, totalPagar, cuotaMensual, aprobado);
        // Habilitar o deshabilitar el botón según el resultado
     let btnAsignar = document.getElementById("btnAsignarCredito");
     btnAsignar.disabled = !aprobado;

}

function mostrarResultadoCredito(capacidadPago, totalPagar, cuotaMensual, aprobado){
    let resultado = document.getElementById("resultadoCredito");

    resultado.innerHTML = `
        Capacidad de pago: ${capacidadPago}<br>
        Total a pagar: ${totalPagar}<br>
        Cuota mensual: ${cuotaMensual.toFixed(2)}<br>
        RESULTADO: ${aprobado ? "APROBADO" : "RECHAZADO"}
    `;

    // Aplicar estilo según el resultado
    if (aprobado) {
        resultado.className = "aprobado";
    } else {
        resultado.className = "rechazado";
    }
}


function asignarCredito (){
    if( clienteSeleccionado === null || !creditoAprobado){
        alert("el credito no esta aprobado o no hay cliente seleccionado");
        return;
    }
    let credito = {
        cedula: clienteSeleccionado.cedula,
        nombre: clienteSeleccionado.nombre,
        apellido: clienteSeleccionado.apellido,
        monto: montoCalculado,
        tasa: tasaInteres,
        plazo: plazoCalculado,
        cuota: cuotaCalculada
    };
    creditos.push(credito);
    pintarCreditos(creditos);
    alert("Crédito asignado correctamente a " + credito.nombre + " " + credito.apellido);
    document.getElementById("btnAsignarCredito").disabled = true;
}

function buscarCredito(cedula){
    let encontrados = [];
    let buscada = String(cedula).trim();

    for (let i = 0; i < creditos.length; i++) {
        if (String(creditos[i].cedula).trim() === buscada) {
            encontrados.push(creditos[i]);
        }
    }

    return encontrados; // arreglo (vacío si no hay créditos)
}

function pintarCreditos(creditos){
    let tbody = document.getElementById("tablaCreditos");
    tbody.innerHTML = ""; // limpiar para no duplicar filas

    if (creditos.length === 0) {
        let fila = document.createElement("tr");
        let celda = document.createElement("td");
        celda.colSpan = 8;
        celda.textContent = "No hay créditos registrados para esta cédula.";
        fila.appendChild(celda);
        tbody.appendChild(fila);
        return;
    }

    for (let i = 0; i < creditos.length; i++) {
        let credito = creditos[i];

        let fila = document.createElement("tr");

        let tdCedula = document.createElement("td");
        tdCedula.textContent = credito.cedula;

        let tdNombre = document.createElement("td");
        tdNombre.textContent = credito.nombre;

        let tdApellido = document.createElement("td");
        tdApellido.textContent = credito.apellido;

        let tdMonto = document.createElement("td");
        tdMonto.textContent = credito.monto;

        let tdTasa = document.createElement("td");
        tdTasa.textContent = credito.tasa + "%";

        let tdPlazo = document.createElement("td");
        tdPlazo.textContent = credito.plazo + " meses";

        let tdCuota = document.createElement("td");
        tdCuota.textContent = credito.cuota.toFixed(2);

        // Botón Eliminar
        let tdAcciones = document.createElement("td");
        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = function(){
            eliminarCredito(credito.cedula, credito.monto);
        };
        tdAcciones.appendChild(btnEliminar);

        fila.appendChild(tdCedula);
        fila.appendChild(tdNombre);
        fila.appendChild(tdApellido);
        fila.appendChild(tdMonto);
        fila.appendChild(tdTasa);
        fila.appendChild(tdPlazo);
        fila.appendChild(tdCuota);
        fila.appendChild(tdAcciones);

        tbody.appendChild(fila);
    }
}

function buscarCreditosCliente(){
    // 1. Tomar el valor de la cédula desde la caja de texto
    let cedula = document.getElementById("buscarCedulaListado").value;

    // 2. Invocar buscarCreditos
    let encontrados = buscarCredito(cedula);

    // 3. Enviar el resultado a pintarCreditos
    pintarCreditos(encontrados);
}

function verTodosLosCreditos(){
    pintarCreditos(creditos);
}

function eliminarCredito(cedula, monto){
    if (!confirm("¿Eliminar este crédito?")) return;

    for (let i = 0; i < creditos.length; i++) {
        if (creditos[i].cedula === cedula && creditos[i].monto === monto) {
            creditos.splice(i, 1);
            break;
        }
    }

    pintarCreditos(creditos);
}











