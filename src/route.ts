import Converter from "./pages/converter";
import ExchangeRates from "./pages/exchangeRates";

export const router = async () => {
  const routes = [
    { path: "/", view: ExchangeRates },
    { path: "/converter", view: Converter },
  ];

  const match = routes.find((route) => {
    const routePathSegments = route.path
      .split("/")
      .filter((segment: string) => segment !== "");
    const urlPathSegments = location.pathname
      .split("/")
      .filter((segment) => segment !== "");

    if (routePathSegments.length !== urlPathSegments.length) {
      return false;
    }
    const match = routePathSegments.every((routeSegment: string, i: number) => {
      return (
        routeSegment === urlPathSegments[i] || routeSegment.startsWith(":")
      );
    });
    return match;
  });

  const view = match && (await match.view());

  const mainPage = document.querySelector("#app") as HTMLDivElement;
  mainPage.innerHTML = view as string;
};









