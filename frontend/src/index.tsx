import React from 'react';
import '@mantine/core/styles.css';
import { colorsTuple, createTheme, MantineProvider } from '@mantine/core';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Layout from './pages/Layout/Layout.tsx';
import HomePage from './pages/HomePage/HomePage.tsx';
import AboutPage from './pages/AboutPage/AboutPage.tsx';
import RecipePage from './pages/RecipePage/RecipePage.tsx';
import GroceryListPage from './pages/GroceryListPage/GroceryListPage.tsx';

const router = createBrowserRouter([

  //any page that has the layout with the header will be a child of the root
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "recipe/:store",
        element: <RecipePage />,
      },
      {
        path: "grocery",
        element: <GroceryListPage />,
      }

    ]

    //this is an example of the routing I have from another project
    // children: [
    //   {
    //     index: true,
    //     element: <Navigate to="/home" replace />
    //   },
    //   {
    //     path: "home",
    //     element: <HomePage />,

    //   },
    //   {
    //     path: "quote",
    //     element: <QuotationPage />,

    //   },
    //   {
    //     path: "order",
    //     element: <OrderingPage />,
    //     children: [
    //       { path: "", element: <Navigate to="place" replace /> },
    //       { path: "place", element: <OrderPage /> },
    //       { path: "payment", element: <PaymentPage /> },
    //       { path: "review", element: <ConfirmationPage /> },
    //     ]
    //   },
    //   {
    //     path: "my-orders",
    //     element: <MyOrdersPage />,
    //   },
    //   {
    //     path: "contact-us",
    //     element: <ContactUs />,
    //   }
    // ]
  }

])


const theme = createTheme({
  colors: {
    // Add your color
    maxiBlue: [
      '#AEBDEA',
      '#8EA3E1',
      '#6E89D8',
      '#4E6ED0',
      '#3357C1',
      '#274394',
      '#223A81',
      '#1A2B61',
      '#111D40',
      '#090E20',
    ],
    // or replace default theme color
    igaRed: [
      '#F8DEDD',
      '#EEAEAA',
      '#E37D78',
      '#DC5C56',
      '#D53831',
      '#BA2E26',
      '#98251F',
      '#771D18',
      '#551511',
      '#330C0A',
    ],

    superCYellow: [
      '#FEFBEC',
      '#FCF3C5',
      '#F9EC9F',
      '#F7E478',
      '#F4DA48',
      '#F3D52B',
      '#E7C70D',
      '#C1A60B',
      '#AE950A',
      '#746307',
    ],

    metroGreen: [
      '#AADABA',
      '#8ECDA3',
      '#71C18C',
      '#55B475',
      '#449C62',
      '#357A4C',
      '#2C633E',
      '#1F472C',
      '#132B1B',
      '#060E09',
    ],

    background: colorsTuple('#f3f4e7'),
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
)

