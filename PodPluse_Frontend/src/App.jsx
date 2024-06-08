import { Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import routes from './routes'
import PrivateRoute from "./utils/PrivateRoute"
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
              {routes.map(route => {
                return (
                  <Route
                    key={route.name}
                    path={route.path}
                    element={<route.element />}
                  />
                );
              })}
          </Route>
          <Route path="*" element={<p className="text-white-1">404 Not Found</p>} />
        </Routes >
      </Suspense>
    </BrowserRouter>
  )
}

export default App
