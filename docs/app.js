(function () {
  const API_BASE =
    "https://api.metals.dev/v1/latest?currency=USD&unit=kg";
  const API_KEY = "FJJRUREU3WF8LN1BH2GH7651BH2GH";

  const els = {
    gold: document.getElementById("gold"),
    silver: document.getElementById("silver"),
    mcxGold: document.getElementById("mcx-gold"),
    mcxSilver: document.getElementById("mcx-silver"),
    usdInr: document.getElementById("usd-inr"),
    updated: document.getElementById("updated"),
    refresh: document.getElementById("refresh"),
    toast: document.getElementById("toast"),
  };

  function formatNumber(num) {
    if (typeof num !== "number" || Number.isNaN(num)) return "—";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }

  function showToast(message, type) {
    els.toast.textContent = message;
    els.toast.className = "toast visible " + (type || "");
    clearTimeout(els.toast._tid);
    els.toast._tid = setTimeout(function () {
      els.toast.classList.remove("visible");
    }, 3500);
  }

  function setLoading(loading) {
    els.refresh.disabled = loading;
    els.refresh.classList.toggle("loading", loading);
  }

  function render(data) {
    const metals = data.metals || {};
    const currencies = data.currencies || {};
    const inrRate = currencies.INR;
    const usdToInr = typeof inrRate === "number" && inrRate > 0 ? 1 / inrRate : null;

    els.gold.textContent = formatNumber(metals.gold);
    els.silver.textContent = formatNumber(metals.silver);
    els.mcxGold.textContent = formatNumber(metals.mcx_gold);
    els.mcxSilver.textContent = formatNumber(metals.mcx_silver);
    els.usdInr.textContent = usdToInr != null ? formatNumber(usdToInr) : "—";

    const ts = data.timestamps && data.timestamps.metal;
    if (ts) {
      try {
        const d = new Date(ts);
        els.updated.textContent =
          "Last updated: " +
          d.toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          });
      } catch (_) {
        els.updated.textContent = "Last updated: " + ts;
      }
    } else {
      els.updated.textContent = "Last updated: just now";
    }
  }

  function fetchRates() {
    const url = API_BASE + "&api_key=" + encodeURIComponent(API_KEY);
    setLoading(true);

    fetch(url, { headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("API error: " + res.status);
        return res.json();
      })
      .then(function (json) {
        if (json.status !== "success") {
          throw new Error(json.message || "Invalid response");
        }
        render(json);
        showToast("Rates updated", "success");
      })
      .catch(function (err) {
        const msg =
          err.message || err.toString || "Failed to load rates. Check console.";
        showToast(msg, "error");
        console.error("Metals API error:", err);
      })
      .finally(function () {
        setLoading(false);
      });
  }

  els.refresh.addEventListener("click", fetchRates);

  fetchRates();
})();
