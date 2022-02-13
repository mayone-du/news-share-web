import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";
import IndexPage from "src/pages/index.page";

it("Should render Index Page", () => {
  render(<IndexPage />);
  expect(screen.getByText("Index Page")).toBeInTheDocument();
});
