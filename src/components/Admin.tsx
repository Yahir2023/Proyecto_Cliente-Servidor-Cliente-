import { useState } from 'react'

function Admin() {
    const [count, setCount] = useState(0)

    return (
        <>
<table>
  <thead>
    <th>Matematicas</th>
    <th>Educacion fisica</th>
    <th>Biologia</th>
    <th>Etica</th>
    <th>Filosofia</th>
  </thead>
  <tbody>
    <td>10</td>
    <td>10</td>
    <td>10</td>
    <td>10</td>
    <td>10</td>
  </tbody>
</table>

<h1>Formulario de inicio de sesion</h1>
<form action="">
  <div>
    <label htmlFor="">Usuario</label>
    <input type="text" />
  </div>
  <div>
    <label htmlFor="">Contraseña</label>
    <input type="text" />
  </div>

  <button type='submit'>
    Enviar
  </button>
</form>
    </>
    )
}
export default Admin;