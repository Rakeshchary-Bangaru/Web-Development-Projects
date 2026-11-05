
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

/*
 * =========================================================
 * STORAGE KEYS
 * =========================================================
 *
 * Guest carts:
 * sessionStorage
 *
 * Authenticated carts:
 * localStorage, separated by user ID
 *
 * Never import legacy shared carts.
 */

const GUEST_CART_KEY = "ecommerce:cart:guest:v11";
const USER_CART_PREFIX = "ecommerce:cart:user:";

const LEGACY_CART_KEY = "cart";
const OLD_GUEST_CART_KEY = "ecommerce:cart:guest";

/*
 * =========================================================
 * SANITIZE CART ITEM
 * =========================================================
 *
 * Keep only public product information.
 * Never store exact inventory quantities.
 */

function sanitizeCartItem(item) {
  if (!item || item.id == null) {
    return null;
  }

  const quantity = Number(item.cartQuantity);

  return {
    id: item.id,
    name: item.name,
    category: item.category,
    brand: item.brand,
    price: item.price,
    inStock: item.inStock,
    availability: item.availability,

    cartQuantity:
      Number.isSafeInteger(quantity) && quantity > 0
        ? quantity
        : 1,
  };
}

/*
 * =========================================================
 * READ CART
 * =========================================================
 */

function readCart(key, storage) {
  if (!key || !storage) {
    return [];
  }

  try {
    const stored = storage.getItem(key);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(sanitizeCartItem)
      .filter(Boolean);
  } catch (error) {
    console.error(
      "Unable to restore shopping cart:",
      error
    );

    return [];
  }
}

/*
 * =========================================================
 * SAVE CART
 * =========================================================
 */

function saveCart(key, items, storage) {
  if (!key || !storage) {
    return false;
  }

  try {
    storage.setItem(
      key,
      JSON.stringify(items)
    );

    return true;
  } catch (error) {
    console.error(
      "Unable to save shopping cart:",
      error
    );

    return false;
  }
}

/*
 * =========================================================
 * REMOVE CART
 * =========================================================
 */

function removeCart(key, storage) {
  if (!key || !storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch (error) {
    console.error(
      "Unable to remove shopping cart:",
      error
    );
  }
}

/*
 * =========================================================
 * MERGE GUEST AND USER CARTS
 * =========================================================
 *
 * Applies to every authenticated role:
 *
 * CUSTOMER
 * SELLER_ADMIN
 * IT_SUPPORT
 * ROOT
 *
 * Existing product quantities are combined.
 * No duplicate product entries are created.
 */

function mergeCarts(userCart, guestCart) {
  const merged = userCart.map(
    (item) => ({ ...item })
  );

  for (const guestItem of guestCart) {
    const existing = merged.find(
      (item) =>
        String(item.id) === String(guestItem.id)
    );

    if (existing) {
      existing.cartQuantity +=
        guestItem.cartQuantity;
    } else {
      merged.push({ ...guestItem });
    }
  }

  return merged;
}

/*
 * =========================================================
 * CART PROVIDER
 * =========================================================
 */

export function CartProvider({ children }) {
  const {
    currentUser,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  /*
   * Each authenticated user has a unique cart.
   *
   * Do not use the role as the storage key:
   * two ROOT accounts must not share a cart.
   */

  const userId = currentUser?.userId;

  const cartScope = authLoading
    ? null
    : isAuthenticated
      ? userId != null
        ? `user:${userId}`
        : null
      : "guest";

  /*
   * =======================================================
   * STORAGE CONFIGURATION
   * =======================================================
   */

  const storageKey =
    cartScope === "guest"
      ? GUEST_CART_KEY
      : cartScope?.startsWith("user:")
        ? `${USER_CART_PREFIX}${userId}`
        : null;

  const cartStorage =
    cartScope === "guest"
      ? sessionStorage
      : cartScope?.startsWith("user:")
        ? localStorage
        : null;

  /*
   * =======================================================
   * CART STATE
   * =======================================================
   *
   * scope identifies the owner of these items.
   */

  const [cartState, setCartState] = useState({
    scope: null,
    items: [],
  });

  /*
   * Track the previously resolved owner.
   *
   * This distinguishes guest-to-user sign-in from
   * initial authentication restoration.
   */

  const previousScopeRef = useRef(null);

  /*
   * =======================================================
   * RESTORE CART / AUTHENTICATION TRANSITIONS
   * =======================================================
   */

  useEffect(() => {
    if (!cartScope || !storageKey || !cartStorage) {
      return;
    }

    const previousScope =
      previousScopeRef.current;

    /*
     * Load only the active account's cart.
     */

    let items = readCart(
      storageKey,
      cartStorage
    );

    /*
     * Remove legacy shared storage.
     *
     * Do not import potentially shared carts into
     * an authenticated user's account.
     */

    removeCart(
      LEGACY_CART_KEY,
      localStorage
    );

    removeCart(
      OLD_GUEST_CART_KEY,
      localStorage
    );

    /*
     * =====================================================
     * GUEST -> AUTHENTICATED USER
     * =====================================================
     *
     * Any signed-in role can inherit a guest cart.
     *
     * This happens only on a guest-to-user transition.
     *
     * It does not merge carts across two authenticated
     * accounts or on initial session restoration.
     */

    const isGuestToUserLogin =
      previousScope === "guest" &&
      cartScope.startsWith("user:");

    if (isGuestToUserLogin) {
      const guestItems = readCart(
        GUEST_CART_KEY,
        sessionStorage
      );

      if (guestItems.length > 0) {
        const mergedItems = mergeCarts(
          items,
          guestItems
        );

        /*
         * Save merged items before clearing the
         * original guest cart.
         */

        const saved = saveCart(
          storageKey,
          mergedItems,
          localStorage
        );

        if (saved) {
          items = mergedItems;

          removeCart(
            GUEST_CART_KEY,
            sessionStorage
          );
        }
      }
    }

    /*
     * Update the active cart owner.
     */

    previousScopeRef.current = cartScope;

    setCartState({
      scope: cartScope,
      items,
    });
  }, [
    cartScope,
    storageKey,
    cartStorage,
  ]);

  /*
   * =======================================================
   * PREVENT CROSS-ACCOUNT CART DISPLAY
   * =======================================================
   */

  const cartItems =
    cartScope !== null &&
    cartState.scope === cartScope
      ? cartState.items
      : [];

  const loading =
    authLoading ||
    cartScope === null ||
    cartState.scope !== cartScope;

  /*
   * =======================================================
   * PERSIST ACTIVE CART
   * =======================================================
   *
   * Never save items under another user's key.
   */

  useEffect(() => {
    if (
      !cartScope ||
      !storageKey ||
      !cartStorage ||
      cartState.scope !== cartScope
    ) {
      return;
    }

    saveCart(
      storageKey,
      cartState.items,
      cartStorage
    );
  }, [
    cartState,
    cartScope,
    storageKey,
    cartStorage,
  ]);

  /*
   * =======================================================
   * SAFE CART UPDATES
   * =======================================================
   */

  function updateItems(updater) {
    if (!cartScope || loading) {
      return;
    }

    setCartState((previous) => {
      if (previous.scope !== cartScope) {
        return previous;
      }

      return {
        scope: cartScope,
        items: updater(previous.items),
      };
    });
  }

  /*
   * =======================================================
   * ADD PRODUCT
   * =======================================================
   */

  function addToCart(product) {
    if (!product || product.inStock === false) {
      return;
    }

    const safeProduct = sanitizeCartItem(product);

    if (!safeProduct) {
      return;
    }

    updateItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) =>
          String(item.id) === String(safeProduct.id)
      );

      if (existingItem) {
        return previousItems.map((item) =>
          String(item.id) === String(safeProduct.id)
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
          ...safeProduct,
          cartQuantity: 1,
        },
      ];
    });
  }

  /*
   * =======================================================
   * INCREASE QUANTITY
   * =======================================================
   */

  function increaseQuantity(productId) {
    updateItems((previousItems) =>
      previousItems.map((item) =>
        String(item.id) === String(productId)
          ? {
              ...item,
              cartQuantity:
                item.cartQuantity + 1,
            }
          : item
      )
    );
  }

  /*
   * =======================================================
   * DECREASE QUANTITY
   * =======================================================
   *
   * Minimum quantity is 1.
   */

  function decreaseQuantity(productId) {
    updateItems((previousItems) =>
      previousItems.map((item) =>
        String(item.id) === String(productId)
          ? {
              ...item,
              cartQuantity: Math.max(
                1,
                item.cartQuantity - 1
              ),
            }
          : item
      )
    );
  }

  /*
   * =======================================================
   * REMOVE PRODUCT
   * =======================================================
   */

  function removeFromCart(productId) {
    updateItems((previousItems) =>
      previousItems.filter(
        (item) =>
          String(item.id) !== String(productId)
      )
    );
  }

  /*
   * =======================================================
   * CLEAR CURRENT USER'S CART
   * =======================================================
   */

  function clearCart() {
    updateItems(() => []);
  }

  /*
   * =======================================================
   * CLEAR GUEST CART
   * =======================================================
   *
   * Does not touch any authenticated user's cart.
   */

  function clearGuestCart() {
    removeCart(
      GUEST_CART_KEY,
      sessionStorage
    );

    if (cartScope === "guest") {
      setCartState({
        scope: "guest",
        items: [],
      });
    }
  }

  /*
   * =======================================================
   * PROVIDER
   * =======================================================
   */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        clearGuestCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/*
 * =========================================================
 * CART HOOK
 * =========================================================
 */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
