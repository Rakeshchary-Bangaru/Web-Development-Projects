import { useEffect, useState } from "react";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  updateCustomerEmail,
  deleteCustomer,
} from "../../services/customerApi";


function AdminCustomers() {

  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
  });

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  async function loadCustomers() {

    try {

      setError("");

      const data =
        await getCustomers();

      setCustomers(data);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadCustomers();

  }, []);


  function handleChange(event) {

    const {
      name,
      value,
    } = event.target;


    setForm(
      (previousForm) => ({
        ...previousForm,
        [name]: value,
      })
    );
  }


  async function handleSubmit(event) {

    event.preventDefault();

    setError("");
    setMessage("");


    const customer = {

      id:
        Number(form.id),

      name:
        form.name,

      email:
        form.email,
    };


    try {

      if (editingId !== null) {

        await updateCustomer(
          editingId,
          customer
        );

        setMessage(
          "Customer updated successfully"
        );

      } else {

        await createCustomer(
          customer
        );

        setMessage(
          "Customer created successfully"
        );
      }


      resetForm();

      await loadCustomers();

    } catch (error) {

      setError(error.message);

    }
  }


  function handleEdit(customer) {

    setEditingId(
      customer.id
    );


    setForm({
      id:
        customer.id,

      name:
        customer.name,

      email:
        customer.email,
    });


    setMessage("");
    setError("");
  }


  async function handleEmailUpdate(
    customer
  ) {

    const newEmail =
      window.prompt(
        `Enter new email for ${customer.name}`,
        customer.email
      );


    if (newEmail === null) {
      return;
    }


    if (newEmail.trim() === "") {

      setError(
        "Please enter a valid email"
      );

      return;
    }


    try {

      setError("");
      setMessage("");


      await updateCustomerEmail(
        customer.id,
        newEmail.trim()
      );


      setMessage(
        "Customer email updated successfully"
      );


      await loadCustomers();

    } catch (error) {

      setError(error.message);

    }
  }


  async function handleDelete(id) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this customer?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setMessage("");


      await deleteCustomer(id);


      setMessage(
        "Customer deleted successfully"
      );


      await loadCustomers();

    } catch (error) {

      setError(error.message);

    }
  }


  function handleCancelEdit() {

    resetForm();

    setMessage("");
    setError("");
  }


  function resetForm() {

    setForm({
      id: "",
      name: "",
      email: "",
    });

    setEditingId(null);
  }


  if (loading) {

    return (
      <p>
        Loading customers...
      </p>
    );
  }


  return (

    <div>

      {/* PAGE HEADER */}

      <div className="admin-page-header">

        <h1>
          Customers
        </h1>

        <p>
          Create, edit and manage
          customers in the store.
        </p>

      </div>


      {/* SUCCESS MESSAGE */}

      {message && (

        <div className="success-message">
          {message}
        </div>

      )}


      {/* ERROR MESSAGE */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* CUSTOMER FORM */}

      <div className="admin-card admin-form-card">

        <div className="admin-section-header">

          <h2>

            {editingId !== null
              ? "Edit Customer"
              : "Add Customer"}

          </h2>

        </div>


        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >

          <div className="admin-form-grid">

            <div>

              <label htmlFor="id">
                Customer ID
              </label>

              <input
                id="id"
                name="id"
                type="number"
                value={form.id}
                onChange={handleChange}
                disabled={
                  editingId !== null
                }
                placeholder="Enter customer ID"
                required
              />

            </div>


            <div>

              <label htmlFor="name">
                Customer Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
              />

            </div>


            <div>

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter customer email"
                required
              />

            </div>

          </div>


          <div className="admin-form-actions">

            <button
              className="primary-button"
              type="submit"
            >

              {editingId !== null
                ? "Update Customer"
                : "Add Customer"}

            </button>


            {editingId !== null && (

              <button
                className="secondary-button"
                type="button"
                onClick={
                  handleCancelEdit
                }
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      {/* CUSTOMER LIST */}

      <div className="admin-card admin-table-card">

        <div className="admin-section-header">

          <div>

            <h2>
              Customer List
            </h2>

            <p>
              {customers.length} customers
              currently registered.
            </p>

          </div>

        </div>


        <div className="table-container">

          <table className="admin-table">

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Name
                </th>

                <th>
                  Email
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {customers.map(
                (customer) => (

                  <tr key={customer.id}>

                    <td>
                      {customer.id}
                    </td>


                    <td>

                      <div className="customer-name-cell">

                        <div className="customer-avatar">

                          {customer.name
                            ?.charAt(0)
                            .toUpperCase()}

                        </div>


                        <strong>
                          {customer.name}
                        </strong>

                      </div>

                    </td>


                    <td>

                      <span className="customer-email">
                        {customer.email}
                      </span>

                    </td>


                    <td>

                      <div className="admin-action-buttons">

                        <button
                          className="admin-edit-button"
                          onClick={() =>
                            handleEdit(
                              customer
                            )
                          }
                        >
                          Edit
                        </button>


                        <button
                          className="admin-email-button"
                          onClick={() =>
                            handleEmailUpdate(
                              customer
                            )
                          }
                        >
                          Email
                        </button>


                        <button
                          className="admin-delete-button"
                          onClick={() =>
                            handleDelete(
                              customer.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}


export default AdminCustomers;