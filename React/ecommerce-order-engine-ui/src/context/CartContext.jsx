import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


const CartContext = createContext();


export function CartProvider({ children }) {

  const [cartItems, setCartItems] =
    useState(() => {

      const storedCart =
        localStorage.getItem("cart");

      return storedCart
        ? JSON.parse(storedCart)
        : [];
    });


  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);


  function addToCart(product) {

    setCartItems((previousItems) => {

      const existingItem =
        previousItems.find(
          (item) =>
            item.id === product.id
        );


      if (existingItem) {

        if (
          existingItem.cartQuantity >=
          product.quantity
        ) {

          return previousItems;
        }


        return previousItems.map(
          (item) =>

            item.id === product.id

              ? {
                  ...item,
                  cartQuantity:
                    item.cartQuantity + 1,
                }

              : item

        );
      }


      return [
        ...previousItems,
        {
          ...product,
          cartQuantity: 1,
        },
      ];
    });
  }


  function increaseQuantity(productId) {

    setCartItems((previousItems) =>

      previousItems.map((item) => {

        if (item.id !== productId) {
          return item;
        }


        if (
          item.cartQuantity >=
          item.quantity
        ) {

          return item;
        }


        return {
          ...item,
          cartQuantity:
            item.cartQuantity + 1,
        };

      })

    );
  }


  function decreaseQuantity(productId) {

    setCartItems((previousItems) =>

      previousItems.map((item) => {

        if (item.id !== productId) {
          return item;
        }


        if (item.cartQuantity <= 1) {
          return item;
        }


        return {
          ...item,
          cartQuantity:
            item.cartQuantity - 1,
        };

      })

    );
  }


  function removeFromCart(productId) {

    setCartItems((previousItems) =>

      previousItems.filter(
        (item) =>
          item.id !== productId
      )

    );
  }


  function clearCart() {

    setCartItems([]);
  }


  return (

    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >

      {children}

    </CartContext.Provider>
  );
}


export function useCart() {

  return useContext(CartContext);
}