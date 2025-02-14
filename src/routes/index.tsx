import {RouterProvider, createBrowserRouter } from "react-router-dom";
import ProductListPage from '../pages/ProductList';
import ProductFormPage from '../pages/ProductForm';
import RootLayout from "../layouts/RootLayout";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <ProductListPage />,
      },
      {
        path: "/new-product",
        element: <ProductFormPage />,
      },
      {
        path: "/edit-product/:sku",
        element: <ProductFormPage />,
      }
    ],
  },
]);

const Routes = () => <RouterProvider router={router} />;

export default Routes;