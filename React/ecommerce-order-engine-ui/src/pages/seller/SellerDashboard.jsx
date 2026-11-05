import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  getSellerProducts,
} from "../../services/productApi";

import {
  getSellerOrders,
} from "../../services/orderApi";

import "../../styles/components/SellerDashboard.css";


function SellerDashboard() {

  const {
    currentUser,
  } = useAuth();


  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
   * =========================================================
   * LOAD SELLER DATA
   * =========================================================
   */
  useEffect(() => {

    async function loadDashboard() {

      try {

        setLoading(true);
        setError("");


        const [
          sellerProducts,
          sellerOrders,
        ] =
          await Promise.all([
            getSellerProducts(),
            getSellerOrders(),
          ]);


        setProducts(
          sellerProducts
        );

        setOrders(
          sellerOrders
        );

      } catch (error) {

        setError(
          error.message ||
          "Failed to load seller dashboard"
        );

      } finally {

        setLoading(false);

      }
    }


    loadDashboard();

  }, []);


  /*
   * =========================================================
   * FRIENDLY SELLER NAME
   * ---------------------------------------------------------
   * Temporary display name until the Seller Profile API
   * exposes an actual seller/business name.
   *
   * seller1@test.com
   * becomes
   * Seller1
   * =========================================================
   */
  const sellerDisplayName =
    useMemo(() => {

      const email =
        currentUser?.email;


      if (!email) {
        return "Seller";
      }


      const emailName =
        email.split("@")[0];


      return (
        emailName.charAt(0).toUpperCase() +
        emailName.slice(1)
      );

    }, [
      currentUser,
    ]);


  /*
   * =========================================================
   * TIME-BASED GREETING
   * =========================================================
   */
  const greeting =
    useMemo(() => {

      const hour =
        new Date().getHours();


      if (hour < 12) {
        return "Good morning";
      }


      if (hour < 17) {
        return "Good afternoon";
      }


      return "Good evening";

    }, []);


  /*
   * =========================================================
   * SELLER PERFORMANCE METRICS
   * =========================================================
   */
  const metrics =
    useMemo(() => {

      const totalProducts =
        products.length;


      const totalSales =
        orders.length;


      const unitsSold =
        orders.reduce(
          (orderTotal, order) => {

            const orderUnits =
              order.items.reduce(
                (itemTotal, item) =>
                  itemTotal +
                  Number(
                    item.quantity || 0
                  ),
                0
              );


            return (
              orderTotal +
              orderUnits
            );
          },
          0
        );


      /*
       * Seller-only revenue.
       */
      const revenue =
        orders.reduce(
          (total, order) =>
            total +
            Number(
              order.sellerSubtotal || 0
            ),
          0
        );


      const averageOrderValue =
        totalSales > 0
          ? revenue / totalSales
          : 0;


      const averageUnitsPerOrder =
        totalSales > 0
          ? Math.round(unitsSold / totalSales)
          : 0;


      /*
       * =====================================================
       * BEST SELLING PRODUCT
       * =====================================================
       */
      const productSales =
        {};


      orders.forEach((order) => {

        order.items.forEach((item) => {

          if (!productSales[item.productId]) {

            productSales[item.productId] = {
              name:
                item.productName,

              quantity:
                0,
            };
          }


          productSales[
            item.productId
          ].quantity +=
            Number(
              item.quantity || 0
            );

        });

      });


      const bestSellingProduct =
        Object.values(
          productSales
        ).sort(
          (a, b) =>
            b.quantity -
            a.quantity
        )[0] || null;


      /*
       * =====================================================
       * MOST RECENT ORDER
       * =====================================================
       */
      const latestOrder =
        [...orders].sort(
          (a, b) =>
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
        )[0] || null;


      return {

        totalProducts,
        totalSales,
        unitsSold,
        revenue,
        averageOrderValue,
        averageUnitsPerOrder,
        bestSellingProduct,
        latestOrder,

      };

    }, [
      products,
      orders,
    ]);


  /*
   * =========================================================
   * INR FORMAT
   * =========================================================
   */
  function formatCurrency(value) {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(
      value
    );
  }


  function formatDate(date) {

    if (!date) {
      return "No sales yet";
    }


    return new Date(
      date
    ).toLocaleString();
  }


  return (

    <div className="seller-dashboard">


      {/* =====================================================
          HEADER
         ===================================================== */}

  <div className="seller-dashboard-header">
  <h1>
    My  Dashboard
  </h1>

  <p>
    Monitor your store performance
    and manage your operations.
  </p>
</div>


      {/* =====================================================
          DYNAMIC WELCOME BANNER
         ===================================================== */}

      <section className="seller-welcome-banner">

        <div className="seller-welcome-main">

          <p className="seller-welcome-greeting">
            {greeting},
          </p>

          <h2>
            {sellerDisplayName} 👋
          </h2>

          <p>
            Here's what's happening with
            your store today.
          </p>

        </div>


        <div className="seller-welcome-account">

          <span>
            Seller Account
          </span>

          <strong>
            {currentUser?.email}
          </strong>

        </div>

      </section>


      {/* =====================================================
          LOADING
         ===================================================== */}

      {loading && (

        <div className="seller-dashboard-loading">

          Loading seller performance...

        </div>

      )}


      {/* =====================================================
          ERROR
         ===================================================== */}

      {error && (

        <div className="seller-dashboard-error">

          {error}

        </div>

      )}


      {/* =====================================================
          METRICS
         ===================================================== */}

      {!loading &&
        !error && (

          <>

            <div className="seller-metrics-grid">


              <div className="seller-metric-card">

                <p className="seller-metric-label">
                  Total Products
                </p>

                <p className="seller-metric-value">
                  {metrics.totalProducts}
                </p>

                <p className="seller-metric-caption">
                  Products currently maintained
                </p>

              </div>


              <div className="seller-metric-card">

                <p className="seller-metric-label">
                  Total Sales
                </p>

                <p className="seller-metric-value">
                  {metrics.totalSales}
                </p>

                <p className="seller-metric-caption">
                  Customer orders received
                </p>

              </div>


              <div className="seller-metric-card">

                <p className="seller-metric-label">
                  Units Sold
                </p>

                <p className="seller-metric-value">
                  {metrics.unitsSold}
                </p>

                <p className="seller-metric-caption">
                  Seller-owned items purchased
                </p>

              </div>


              <div className="seller-metric-card">

                <p className="seller-metric-label">
                  Revenue Generated
                </p>

                <p className="seller-metric-value">
                  {formatCurrency(
                    metrics.revenue
                  )}
                </p>

                <p className="seller-metric-caption">
                  Revenue from your products
                </p>

              </div>


              <div className="seller-metric-card">

                <p className="seller-metric-label">
                  Average Order Value
                </p>

                <p className="seller-metric-value">
                  {formatCurrency(
                    metrics.averageOrderValue
                  )}
                </p>

                <p className="seller-metric-caption">
                  Average seller subtotal
                </p>

              </div>

            </div>


            {/* =================================================
                STORE INSIGHTS
               ================================================= */}

            <section className="seller-dashboard-section">

              <div className="seller-dashboard-section-header">

                <h2>
                  Store Insights
                </h2>

                <p>
                  A quick summary of your
                  recent selling activity.
                </p>

              </div>


              <div className="seller-insights-grid">


                <div className="seller-insight-card">

                  <span>
                    Best Selling Product
                  </span>

                  <strong>
                    {
                      metrics.bestSellingProduct
                        ?.name ||
                      "No sales yet"
                    }
                  </strong>

                  <p>

                    {
                      metrics.bestSellingProduct
                        ? `${metrics.bestSellingProduct.quantity} units sold`
                        : "Sales data will appear here"
                    }

                  </p>

                </div>


                <div className="seller-insight-card">

                  <span>
                    Average Units / Order
                  </span>

                  <strong>

                    {
                      metrics
                        .averageUnitsPerOrder
                        
                    }

                  </strong>

                  <p>
                    Products sold per order
                  </p>

                </div>


                <div className="seller-insight-card">

                  <span>
                    Latest Order
                  </span>

                  <strong>

                    {
                      metrics.latestOrder
                        ? `#${metrics.latestOrder.orderId}`
                        : "No orders"
                    }

                  </strong>

                  <p>

                    {
                      metrics.latestOrder
                        ? formatDate(
                            metrics
                              .latestOrder
                              .createdAt
                          )
                        : "Waiting for your first order"
                    }

                  </p>

                </div>

              </div>

            </section>


            {/* =================================================
                PERFORMANCE MESSAGE
               ================================================= */}

            <section className="seller-performance-banner">

              <div>

                <span className="seller-performance-label">
                  Store Performance
                </span>

                <h2>

                  Your store has generated{" "}

                  <strong>
                    {formatCurrency(
                      metrics.revenue
                    )}
                  </strong>

                  {" "}in seller revenue.

                </h2>

                <p>

                  You've received{" "}

                  <strong>
                    {metrics.totalSales}
                  </strong>

                  {" "}orders and sold{" "}

                  <strong>
                    {metrics.unitsSold}
                  </strong>

                  {" "}units so far.

                </p>

              </div>

            </section>

          </>

        )}


      {/* =====================================================
          QUICK ACTIONS
         ===================================================== */}

      <section className="seller-dashboard-section">

        <div className="seller-dashboard-section-header">

          <h2>
            Quick Actions
          </h2>

          <p>
            Manage the main areas of
            your seller account.
          </p>

        </div>


        <div className="seller-action-grid">


          <div className="seller-action-card">

            <h3>
              Products
            </h3>

            <p>
              Create, edit and manage
              products belonging to your store.
            </p>

            <Link
              to="/seller/products"
              className="seller-action-link"
            >
              Manage Products
            </Link>

          </div>


          <div className="seller-action-card">

            <h3>
              Inventory
            </h3>

            <p>
              Monitor and update stock levels
              for products owned by your store.
            </p>

            <Link
              to="/seller/inventory"
              className="seller-action-link"
            >
              Manage Inventory
            </Link>

          </div>


          <div className="seller-action-card">

            <h3>
              Orders
            </h3>

            <p>
              Review customer orders containing
              products sold by your store.
            </p>

            <Link
              to="/seller/orders"
              className="seller-action-link"
            >
              View Orders
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}


export default SellerDashboard;