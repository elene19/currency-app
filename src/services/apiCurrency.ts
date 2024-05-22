export async function CurrencyConverter(
  from: string,
  to: string,
  amount: string
) {
  try {
    /////////

    if (document.getElementById("selectors")) {
      const dateInputValue = (
        document.getElementById("date") as HTMLInputElement
      ).value;
      console.log(dateInputValue);

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
        `https://api.fxratesapi.com/convert?from=${from || "USD"}&to=${
          to || "GEL"
        }&date=${dateInputValue || formattedDate}&amount=${amount}&format=json`
      );

      if (!fetched.ok) throw new Error("there is an error in fetch request");
      const data = await fetched.json();
      console.log(data, "d");

      console.log(Object.entries(data)[6][1]);

      return Object.entries(data)[6][1];
    }
    ///////
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

    interface Name {
      code: string;
      name: string;
    }
    const names = arr
      .map((e) => e[1])
      .map((e) => ` ${(e as Name).code} ${(e as Name).name}`);

    return names;
  } catch (err) {
    console.error(err);
  }
}
