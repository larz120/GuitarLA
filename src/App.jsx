import { useState, useEffect } from "react"
import Header from "./components/Header"
import Guitar from "./components/Guitar"
import { db } from "./data/db"

//Componente principal de aplicacion
function App() {

    //!State formato
    // const [x, y] = useState(value)

    //!useEffect formato
    //useEffect(()=>{
    // callback o funcion
    // },[])\

    //Si local storage tiene algo lo convierte a un arreglo json
    // sino, pone un valor inicial
    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : [] 
    }
    
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart) //State del carrito

    const MAX_ITEMS = 10
    const MIN_ITEMS = 1

    useEffect(() => { //Cada que cambie el carro ejecuta esto
        localStorage.setItem('cart', JSON.stringify(cart))    //Convierte carro en json
    }, [cart])

    function addToCart(item){
        const itemExists = cart.findIndex( guitar => guitar.id === item.id)//Comprueba existencia
        if(itemExists >= 0){

            if(cart[itemExists].quantity === MAX_ITEMS) return
            const updatedCart = [...cart]
            updatedCart[itemExists].quantity++
            setCart(updatedCart)
        }else{

            item.quantity = 1
            setCart(cart => [...cart, item])    //Agrega objeto al arreglo del carro
        }

    }

    function removeFromCart(id){
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id ))
    }

    function increaseQuantity(id){
        const updatedCart = cart.map( item => {
            if(item.id===id && item.quantity < MAX_ITEMS){   //Encontramos el item seleccionado y lo modificamos
                return{
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item //Regresamos los demas items intactos
        })
        setCart(updatedCart) //Setear carro con valores actuales
    }

    function decreaseQuantity(id){
        const updatedCart = cart.map(item => {
            if(item.id === id && item.quantity > MIN_ITEMS){
                return{
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updatedCart) 
    }

    function deleteCart(){
        setCart([])
    }

  return (
    <> 
    
    <Header 
        //Creamos Props para comunicarlos con otros components
        cart={cart}
        removeFromCart={removeFromCart}
        decreaseQuantity={decreaseQuantity}
        increaseQuantity={increaseQuantity}
        deleteCart={deleteCart}
    />     

    <main className="container-xl mt-5">

        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
            {data.map((guitar)=>{

                return(
                    <Guitar
                        key = {guitar.id}
                        guitar={guitar}
                        setCart={setCart}
                        addToCart={addToCart}
                    />
                )
            })}
            


        </div>

    </main>


    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
    </footer>

    </>
  )
}

export default App
