export async function CurrencyConverter() {
  try {
    const date = new Date();
    const formattedDate = date
      .toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split("/")
      .reverse()
      .join("-");
    const fetched = await fetch(
      `https://api.fxratesapi.com/convert?from=USD&to=GEL&date=${formattedDate}&amount=2&format=json`
    );
    if (!fetched.ok) throw new Error("there is an error in fetch request");
    const data = await fetched.json();
    // console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function CurrencyNames() {
  try {
    const fetched = await fetch(`https://api.fxratesapi.com/currencies`);
    if (!fetched.ok)
      throw new Error("there was a problem with getting currency data");
    const data = await fetched.json();
    const arr = Object.entries(data);
    // console.log(arr);
    const names = arr.map((e) => e[1]).map((e) => `${e.code} ${e.name}`);
    // console.log("grwgsbgrs", names);

    // console.log(arr.map((el) => console.log(el)));
    // console.log(arr);
    return names;
  } catch (err) {
    console.error(err);
  }
}
