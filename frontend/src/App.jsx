import { BrowserRouter, Routes, Route } from "react-router-dom"

import Landing           from "./pages/Landing"
import Login             from "./pages/Login"
import Register          from "./pages/Register"
import Dashboard         from "./pages/Dashboard"
import SnippetCreator    from "./pages/SnippetCreator"
import PublicSnippet     from "./pages/PublicSnippet"
import ProtectedRoute    from "./components/ProtectedRoute"
import { ToastProvider } from "./components/Toast"
import SmoothScroll      from "./components/SmoothScroll"
import "./components/LiquidGlass.css"
import ClickSpark from "./component/ClickSpark"

import "./App.css"

function App() {
  return (
    
    <ToastProvider>
      <SmoothScroll>
        <ClickSpark
          sparkColor='#fbfbfbf7'
          sparkSize={15}
          sparkRadius={13}
          sparkCount={8}
          duration={400}
        >
        <BrowserRouter>
         
          

          
          
          
          <Routes>
            <Route path="/"                     element={<Landing />} />
            <Route path="/login"                element={<Login />} />
            <Route path="/register"             element={<Register />} />
            <Route path="/snippet/:share_token" element={<PublicSnippet />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute><SnippetCreator /></ProtectedRoute>
            } />
          </Routes>
          
        </BrowserRouter>
        </ClickSpark >
      </SmoothScroll>
    </ToastProvider>
   
  )
}

export default App