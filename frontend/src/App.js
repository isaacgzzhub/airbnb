import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import SpotDetails from "./components/SpotDetails";
import CreateSpotForm from "./components/CreateSpotForm";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import SpotManagementPage from "./components/SpotManagementPage";
import UpdateSpotForm from "./components/UpdateSpotForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const handleDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <>
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route path="/spots/new" exact>
              <CreateSpotForm />
            </Route>
            <Route path="/spots/current" exact>
              <SpotManagementPage />
            </Route>
            <Route path="/spots/:spotId" exact>
              <SpotDetails />
            </Route>
            <Route path="/spots/:spotId/update" exact>
              <UpdateSpotForm />
            </Route>
          </Switch>

          {showDeleteModal && (
            <DeleteConfirmationModal
              onDelete={handleDelete}
              onCancel={() => setShowDeleteModal(false)}
            />
          )}
        </>
      )}
    </>
  );
}

export default App;
