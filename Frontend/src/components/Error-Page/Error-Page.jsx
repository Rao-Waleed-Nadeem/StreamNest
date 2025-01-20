import { useRouteError } from "react-router-dom";
import { useState } from "react";

export default function ErrorPage() {
  const error = useRouteError();
  if (error) console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
