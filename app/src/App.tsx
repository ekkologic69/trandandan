import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Signin from "./components/Sign_in";
import Landing from "./components/Landing";
import Home from "./components/Home";
// import Profile from "./components/profile";
import PracticeMode from "./components/game_PracticeMode";
import Leaderboard from "./components/Leaderboard";
import Bars from "./components/bars";
import RequireAuth from "./components/routing-private";
import NotFoundPage from "./components/notFound";
import Friends from "./components/friends";
import { ProfilePage, Profile } from "./components/Profile";

function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Landing />
            </RequireAuth>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <>
              <Login />
            </>
          }
        ></Route>
        <Route
          path="/sign_in"
          element={
            <RequireAuth>
              <Signin />
            </RequireAuth>
          }
        ></Route>
        <Route
          path="/bot/"
          element={
            <RequireAuth>
              <div className="bg-[#150142] w-screen h-screen">
                <div className="game gameshadow">
                  <PracticeMode />
                </div>
              </div>
            </RequireAuth>
          }
        ></Route>
        <Route
          element={
            <RequireAuth>
              <Bars />
            </RequireAuth>
          }
        >
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          ></Route>
          <Route
            path="/friends"
            element={
              <RequireAuth>
                <Friends />
              </RequireAuth>
            }
          ></Route>
          <Route
            path="/leaderboard"
            element={
              <RequireAuth>
                <Leaderboard />
              </RequireAuth>
            }
          ></Route>
          <Route
            path="/profile/:id"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          ></Route>
          <Route
            path="/me"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          ></Route>
        </Route>
        <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
      </Routes>
    </div>
  );
}
export default App;
