import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route
            path="/popular"
            element={<Movies pageTitle="Popular Movies" preset="popular" />}
          />
          <Route
            path="/latest"
            element={<Movies pageTitle="Latest Movies" preset="latest" />}
          />
          <Route path="/movies/:id" element={<MovieDetails />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
