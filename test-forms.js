const url = "https://docs.google.com/forms/d/e/1FAIpQLSeBYlctrWnUKcRo8Cwg0hCwM7SrCV_Xd6AlXp1biEOGQQX7-g/formResponse"
const formData = new URLSearchParams()
formData.append("entry.1496128865", "TEST_NUMBER_FROM_NODE")
formData.append("entry.1880432841", "Node Name")
formData.append("entry.2000396316", "node@email.com")
formData.append("entry.1650573881", "0600000000")
formData.append("entry.2073792560", "Node Corp")
formData.append("entry.599513277", "Test Event")
formData.append("entry.805825829", "2026-12-12") // Using the exact date they used
formData.append("entry.1445748112", "100")
formData.append("entry.1917157062", "Paris")
formData.append("entry.1362399368", "All")
formData.append("entry.1893131928", "Description here")
formData.append("entry.1869224234", "Oui")

fetch(url, {
  method: "POST",
  body: formData,
  headers: { 
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Origin": "https://angelivisions.com",
    "Referer": "https://docs.google.com/forms/d/e/1FAIpQLSeBYlctrWnUKcRo8Cwg0hCwM7SrCV_Xd6AlXp1biEOGQQX7-g/viewform"
  },
})
  .then(async (res) => {
    console.log("Status:", res.status)
    const text = await res.text()
    if (!res.ok) {
        console.log("Error body length:", text.length)
        if (text.includes("Non autorisé")) console.log("401 Non autorisé");
    } else {
      console.log("Success!")
    }
  })
  .catch((e) => console.error(e))
