/**
 * Inquiry form via Web3Forms (no backend).
 * Set access_key in index.html from https://web3forms.com
 */
export function initForm() {
  const form = document.querySelector("#inquiry-form");
  const status = document.querySelector("#form-status");
  const thanks = document.querySelector("#form-thanks");
  const submit = document.querySelector("#form-submit");

  if (!form || !status || !thanks) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.hidden = true;
    status.textContent = "";
    status.removeAttribute("data-type");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const accessKey = form.querySelector('[name="access_key"]')?.value;
    if (!accessKey || accessKey === "YOUR_ACCESS_KEY") {
      showStatus(
        "Add your Web3Forms access key in index.html to enable sending.",
        "error"
      );
      return;
    }

    form.classList.add("is-sending");
    if (submit) submit.textContent = "Sending…";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Unable to send inquiry.");
      }

      form.hidden = true;
      thanks.hidden = false;
      form.reset();
    } catch (error) {
      showStatus(
        error.message || "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      form.classList.remove("is-sending");
      if (submit) submit.textContent = "Send inquiry";
    }
  });

  function showStatus(message, type) {
    status.hidden = false;
    status.textContent = message;
    status.dataset.type = type;
  }
}
