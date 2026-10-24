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

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  async function loadCustomers() {

    try {

      setError("");

      const data = await getCustomers();

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

    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }


  async function handleSubmit(event) {

    event.preventDefault();

    setError("");
    setMessage("");


    const customer = {

      id: Number(form.id),

      name: form.name,

      email: form.email,
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

        await createCustomer(customer);

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

    setEditingId(customer.id);

    setForm({
      id: customer.id,
      name: customer.name,
      email: customer.email,
    });

    setMessage("");
    setError("");
  }


  async function handleEmailUpdate(customer) {

    const newEmail = window.prompt(
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
        newEmail
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

    return <p>Loading customers...</p>;
  }


  return (

    <div>

      <h1>Customers</h1>


      <h2>
        {editingId !== null
          ? "Edit Customer"
          : "Add Customer"}
      </h2>


      <form onSubmit={handleSubmit}>

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
            disabled={editingId !== null}
            required
          />

        </div>


        <div>

          <label htmlFor="name">
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />

        </div>


        <div>

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

        </div>


        <button type="submit">

          {editingId !== null
            ? "Update Customer"
            : "Add Customer"}

        </button>


        {editingId !== null && (

          <button
            type="button"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>

        )}

      </form>


      {message && (
        <p>{message}</p>
      )}


      {error && (
        <p>{error}</p>
      )}


      <h2>Customer List</h2>


      <table>

        <thead>

          <tr>

            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>

          </tr>

        </thead>


        <tbody>

          {customers.map((customer) => (

            <tr key={customer.id}>

              <td>{customer.id}</td>

              <td>{customer.name}</td>

              <td>{customer.email}</td>

              <td>

                <button
                  onClick={() =>
                    handleEdit(customer)
                  }
                >
                  Edit
                </button>

                {" "}

                <button
                  onClick={() =>
                    handleEmailUpdate(customer)
                  }
                >
                  Email
                </button>

                {" "}

                <button
                  onClick={() =>
                    handleDelete(customer.id)
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}


export default AdminCustomers;